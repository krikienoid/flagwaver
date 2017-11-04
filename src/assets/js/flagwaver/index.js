/*!
 * FlagWaver - Core
 * @author krikienoid / https://github.com/krikienoid
 */

import THREE from 'three';
import {
    DEBUG,
    DAMPING,
    DRAG,
    G,
    Hoisting,
    Side,
    Face,
    FlagpoleType
} from './constants';
import Utils from './utils/Utils';
import ShaderChunk from './webgl/ShaderChunk';
import Orientation from './abstracts/Orientation';

;(function (window, document, THREE, undefined) {
    //
    // Global settings
    //

    var SLACK   = 1.2;
    var MASS    = 0.1;
    var GRAVITY = G * 100 * 1.4;

    // Time settings
    var FPS        = 60;
    var TIMESTEP   = 1 / FPS;
    var timestep   = TIMESTEP;
    var timestepSq = timestep * timestep;
    var time;
    var timePrev;

    // Wind settings
    var wind         = true;
    var windStrength = 200;
    var windForce    = new THREE.Vector3(0, 0, 0);

    // Ball settings
    var ballPosition = new THREE.Vector3(0, -45, 0);
    var ballSize     = 60; // 40

    //
    // Simulation classes
    //

    // Cloth simulation variables
    var gravityForce = new THREE.Vector3(0, -GRAVITY, 0);
    var tmpForce     = new THREE.Vector3();
    var diff         = new THREE.Vector3();

    // Particle constructor
    function Particle(position, mass) {
        this.position = new THREE.Vector3(); // position
        this.previous = new THREE.Vector3(); // previous
        this.original = new THREE.Vector3();
        this.position.copy(position);
        this.previous.copy(position);
        this.original.copy(position);
        this.accel    = new THREE.Vector3(); // acceleration
        this.mass     = mass;
        this.invMass  = 1 / mass;
        this.tmp      = new THREE.Vector3();
        this.tmp2     = new THREE.Vector3();
    }

    // Force -> Acceleration
    Particle.prototype.addForce = function (force) {
        this.accel.add(
            this.tmp2.copy(force).multiplyScalar(this.invMass)
        );
    };

    // Performs verlet integration
    Particle.prototype.integrate = function (timestepSq) {
        var newPos = this.tmp.subVectors(this.position, this.previous);

        newPos.multiplyScalar(DRAG).add(this.position);
        newPos.add(this.accel.multiplyScalar(timestepSq));

        this.tmp      = this.previous;
        this.previous = this.position;
        this.position = newPos;

        this.accel.set(0, 0, 0);
    };

    // Constraint constructor
    function Constraint(p1, p2, restDistance) {
        this.p1 = p1;
        this.p2 = p2;
        this.restDistance = restDistance;
    }

    // Satisfy constraint
    Constraint.prototype.satisfy = function () {
        var p1 = this.p1;
        var p2 = this.p2;
        var distance = this.restDistance;

        var currentDist;
        var correction;
        var correctionHalf;

        diff.subVectors(p2.position, p1.position);
        currentDist = diff.length();

        if (currentDist === 0) { return; } // prevents division by 0

        correction = diff.multiplyScalar(1 - distance / currentDist);
        correctionHalf = correction.multiplyScalar(0.5);

        p1.position.add(correctionHalf);
        p2.position.sub(correctionHalf);
    };

    // Satisfy constraint unidirectionally
    Constraint.prototype.satisfyFixed = function () {
        var p1 = this.p1;
        var p2 = this.p2;
        var distance = this.restDistance;

        var currentDist;
        var correction;

        diff.subVectors(p1.position, p2.position);
        currentDist = diff.length() / SLACK;
        diff.normalize();

        correction = diff.multiplyScalar(currentDist - distance);

        if (currentDist > distance) {
            p2.position.add(correction);
        }
    };

    // Cloth constructor
    function Cloth(xSegs, ySegs, restDistance, mass) {
        var particles   = [];
        var constraints = [];
        var index;
        var plane;
        var geometry;
        var weightForce;
        var width, height;
        var u, v;

        // Cloth properties
        width       = restDistance * xSegs;
        height      = restDistance * ySegs;
        weightForce = new THREE.Vector3();
        weightForce.copy(gravityForce).multiplyScalar(mass);

        // Index get function
        index = function (u, v) {
            return u + v * (xSegs + 1);
        };

        // Cloth plane function
        plane = function (u, v) {
            return new THREE.Vector3(u * width, v * height, 0); // (u - 0.5)
        };

        // Cloth geometry
        geometry = new THREE.ParametricGeometry(plane, xSegs, ySegs, true);
        geometry.dynamic = true;
        geometry.computeFaceNormals();

        // Particles
        for (v = 0; v <= ySegs; v++) {
            for (u = 0; u <= xSegs; u++) {
                particles.push(
                    new Particle(plane(u / xSegs, v / ySegs), mass)
                );
            }
        }

        // Structural constraints

        for (v = 0; v < ySegs; v++) {
            for (u = 0; u < xSegs; u++) {
                constraints.push(new Constraint(
                    particles[index(u, v)],
                    particles[index(u, v + 1)],
                    restDistance
                ));

                constraints.push(new Constraint(
                    particles[index(u, v)],
                    particles[index(u + 1, v)],
                    restDistance
                ));
            }
        }

        for (u = xSegs, v = 0; v < ySegs; v++) {
            constraints.push(new Constraint(
                particles[index(u, v)],
                particles[index(u, v + 1)],
                restDistance
            ));
        }

        for (v = ySegs, u = 0; u < xSegs; u++) {
            constraints.push(new Constraint(
                particles[index(u, v)],
                particles[index(u + 1, v)],
                restDistance
            ));
        }

        // While many systems use shear and bend springs,
        // the relax constraints model seems to be just fine
        // using structural springs.

        // Shear
        var diagonalDist = Math.sqrt(restDistance * restDistance * 2);

        for (v = 0; v < ySegs; v++) {
            for (u = 0; u < xSegs; u++) {
                constraints.push(new Constraint(
                    particles[index(u, v)],
                    particles[index(u + 1, v + 1)],
                    diagonalDist
                ));

                constraints.push(new Constraint(
                    particles[index(u + 1, v)],
                    particles[index(u, v + 1)],
                    diagonalDist
                ));
            }
        }

        // Bend

        // var wlen = restDistance * 2;
        // var hlen = restDistance * 2;

        // diagonalDist = Math.sqrt(wlen * wlen + hlen * hlen);

        // for (v = 0; v < ySegs - 1; v++) {
        //     for (u = 0; u < xSegs - 1; u++) {
        //         constraints.push(new Constraint(
        //             particles[index(u, v)],
        //             particles[index(u + 2, v)],
        //             wlen
        //         ));

        //         constraints.push(new Constraint(
        //             particles[index(u, v)],
        //             particles[index(u, v + 2)],
        //             hlen
        //         ));

        //         constraints.push(new Constraint(
        //             particles[index(u, v)],
        //             particles[index(u + 2, v + 2)],
        //             diagonalDist
        //         ));

        //         constraints.push(new Constraint(
        //             particles[index(u, v + 2)],
        //             particles[index(u + 2, v + 2)],
        //             wlen
        //         ));

        //         constraints.push(new Constraint(
        //             particles[index(u + 2, v + 2)],
        //             particles[index(u + 2, v + 2)],
        //             hlen
        //         ));

        //         constraints.push(new Constraint(
        //             particles[index(u + 2,  v)],
        //             particles[index(u , v + 2)],
        //             diagonalDist
        //         ));
        //     }
        // }

        // Public properties and methods
        this.xSegs        = xSegs;
        this.ySegs        = ySegs;
        this.width        = width;
        this.height       = height;
        this.restDistance = restDistance;
        this.index        = index;
        this.plane        = plane;
        this.geometry     = geometry;
        this.particles    = particles;
        this.constraints  = constraints;
        this.weightForce  = weightForce;
    }

    // Simulate cloth
    Cloth.prototype.simulate = function () {
        var particles   = this.particles;
        var constraints = this.constraints;
        var faces       = this.geometry.faces;
        var weightForce = this.weightForce;
        var particle;
        var constraint;
        var face, normal;
        var i, il;

        // Aerodynamic forces
        if (wind) {
            for (i = 0, il = faces.length; i < il; i++) {
                face   = faces[i];
                normal = face.normal;

                tmpForce.copy(normal).normalize().multiplyScalar(
                    normal.dot(windForce)
                );

                particles[face.a].addForce(tmpForce);
                particles[face.b].addForce(tmpForce);
                particles[face.c].addForce(tmpForce);
            }
        }

        // Gravity force
        for (i = 0, il = particles.length; i < il; i++) {
            particle = particles[i];

            particle.addForce(weightForce);

            // var x = particle.position.x;
            // var y = particle.position.y;
            // var z = particle.position.z;
            // var t = Date.now() / 1000;

            // windForce.set(
            //     Math.sin(x * y * t),
            //     Math.cos(z * t),
            //     Math.sin(Math.cos(5 * x * y * z))
            // ).multiplyScalar(100);

            // particle.addForce(windForce);

            particle.integrate(timestepSq);
        }

        // Satisfy constraints
        for (i = 0, il = constraints.length; i < il; i++) {
            constraints[i].satisfy();
        }

        // Ball constraints
        ballPosition.z = -Math.sin(Date.now() / 300) * 90; // +40
        ballPosition.x = Math.cos(Date.now() / 200) * 70;

        // if (sphere.visible) {
        //     for (i = 0, il = particles.length; i < il; i++) {
        //         particle = particles[i];
        //         pos = particle.position;

        //         diff.subVectors(pos, ballPosition);

        //         if (diff.length() < ballSize) {
        //             // collided
        //             diff.normalize().multiplyScalar(ballSize);
        //             pos.copy(ballPosition).add(diff);
        //         }
        //     }
        // }
    };

    // Render cloth
    Cloth.prototype.render = function () {
        var particles = this.particles;
        var vertices  = this.geometry.vertices;
        var i, il;

        for (i = 0, il = particles.length; i < il; i++) {
            vertices[i].copy(particles[i].position);
        }

        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
        this.geometry.normalsNeedUpdate  = true;
        this.geometry.verticesNeedUpdate = true;
    };

    // Default flag options
    var defaultOptions = {
        width:         300,
        height:        200,
        mass:          MASS,
        levelOfDetail: 10
    };

    // Default flag texture
    var blankTexture = THREE.ImageUtils
        .generateDataTexture(4, 4, new THREE.Color(0xffffff));

    // Load image
    function loadImg(imgSrc, callback) {
        // Create new image element
        var img = new window.Image();

        // Allow loading of CORS enabled images
        img.crossOrigin = 'anonymous';

        // If image is loaded successfully
        img.onload = function () {
            img.onload = null;
            img.onerror = null;

            if (typeof callback === 'function') {
                callback(img);
            }
        };

        // If image fails to load
        img.onerror = function () {
            console.log(
                'Error: FlagWaver: Failed to load image from ' + imgSrc + '.'
            );

            if (typeof callback === 'function') {
                callback(null);
            }
        };

        // Attempt to load image
        img.src = imgSrc;
    }

    // Use canvas to generate texture from image
    function createTextureFromImg(img, transform) {
        var canvas      = document.createElement('canvas');
        var ctx         = canvas.getContext('2d');
        var defaultSize = defaultOptions.height;
        var srcWidth    = img.width;
        var srcHeight   = img.height;
        var destWidth   = defaultSize * srcWidth / srcHeight;
        var destHeight  = defaultSize;

        if (typeof transform === 'object') {
            // Set destination size
            if (transform.resize) {
                if (transform.resize.width > 0) {
                    destWidth = transform.resize.width;
                }

                if (transform.resize.height > 0) {
                    destHeight = transform.resize.height;
                }
            }

            // Swap X axis with Y axis
            if (transform.swapXY) {
                canvas.width  = destHeight;
                canvas.height = destWidth;
            } else {
                canvas.width  = destWidth;
                canvas.height = destHeight;
            }

            // Reflect
            if (transform.reflect) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }

            // Rotate
            if (Utils.isNumeric(transform.rotate)) {
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(transform.rotate);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);
            }

            // Translate
            if (Utils.isNumeric(transform.translateX)) {
                ctx.translate(transform.translateX, 0);
            }

            if (Utils.isNumeric(transform.translateY)) {
                ctx.translate(0, transform.translateY);
            }
        }

        if (DEBUG) {
            console.log(
                'FlagWaver: Image properties' +
                '\n\t' + 'Image size: ' + srcWidth + 'x' + srcHeight +
                '\n\t' + 'Canvas size: ' + Math.round(destWidth) +
                    'x' + Math.round(destHeight) +
                '\n\t' + 'Aspect ratio: ' +
                    Number((srcWidth / srcHeight).toFixed(4))
            );

            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(
            img, 0, 0, srcWidth, srcHeight, 0, 0, destWidth, destHeight
        );

        return new THREE.Texture(canvas);
    }

    // Flag constructor
    function Flag(options) {
        this.position  = new THREE.Vector3(0, 0, 0);
        this.offset    = new THREE.Vector3(0, 0, 0);

        this.hoisting  = Hoisting.DEXTER;
        this.topEdge   = Side.TOP;
        this.img       = null;

        this.options   = Object.assign({}, defaultOptions);
        this.transform = {};
        this.pins      = [];

        this.createCloth(options);
        this.pin();

        this.material = new THREE.MeshPhongMaterial({
            alphaTest: 0.5,
            color:     0xffffff,
            specular:  0x030303,
            shininess: 0.001, // https://github.com/mrdoob/three.js/issues/7252
            metal:     false,
            side:      THREE.DoubleSide
        });

        this.object = new THREE.Mesh(this.cloth.geometry, this.material);

        this.object.castShadow    = true;
        this.object.receiveShadow = true;
        this.object.customDepthMaterial = new THREE.ShaderMaterial({
            uniforms:       { texture: { type: 't', value: blankTexture } },
            vertexShader:   ShaderChunk.depth_vert,
            fragmentShader: ShaderChunk.depth_frag
        });
    }

    // Check if flag has been rotated into a vertical position
    Flag.prototype.isVertical = function () {
        return this.topEdge === Side.LEFT || this.topEdge === Side.RIGHT;
    };

    // Add fixed constraints to flag cloth
    Flag.prototype.constrainCloth = function () {
        var xSegs            = this.cloth.xSegs;
        var ySegs            = this.cloth.ySegs;
        var restDistance     = this.cloth.restDistance * SLACK;
        var particles        = this.cloth.particles;
        var index            = this.cloth.index;
        var fixedConstraints = [];
        var u, v;

        for (v = 0; v <= ySegs; v++) {
            for (u = 0; u < xSegs; u++) {
                fixedConstraints.push(new Constraint(
                    particles[index(u, v)],
                    particles[index(u + 1, v)],
                    restDistance
                ));
            }
        }

        this.fixedConstraints = fixedConstraints;
    };

    // Init new cloth object
    Flag.prototype.createCloth = function (options) {
        var restDistance;

        if (!options) { options = this.options; }

        restDistance = options.height / options.levelOfDetail;

        this.cloth = new Cloth(
            Math.round(options.width / restDistance),
            Math.round(options.height / restDistance),
            restDistance,
            options.mass
        );

        this.constrainCloth();
    };

    // Pin edges of flag cloth
    Flag.prototype.pin = function (edge, spacing) {
        var pins  = this.pins;
        var xSegs = this.cloth.xSegs;
        var ySegs = this.cloth.ySegs;
        var index = this.cloth.index;
        var i;

        spacing = parseInt(spacing);

        if (!Utils.isNumeric(spacing) || spacing < 1) { spacing = 1; }

        switch (edge) {
            case Side.TOP:
                for (i = 0; i <= xSegs; i += spacing) {
                    pins.push(index(i, ySegs));
                }

                break;

            case Side.BOTTOM:
                for (i = 0; i <= xSegs; i += spacing) {
                    pins.push(index(i, 0));
                }

                break;

            case Side.RIGHT:
                for (i = 0; i <= ySegs; i += spacing) {
                    pins.push(index(xSegs, i));
                }

                break;

            case Side.LEFT:
            default:
                for (i = 0; i <= ySegs; i += spacing) {
                    pins.push(index(0, i));
                }

                break;
        }
    };

    // Remove pins from flag cloth
    Flag.prototype.unpin = function () { this.pins = []; };

    // Recalculate offset position when flag cloth is rotated
    Flag.prototype.updatePosition = function () {
        this.object.position.set(
            this.position.x,
            this.position.y - this.cloth.height,
            0
        );
    };

    // Set the flag's position
    Flag.prototype.setPosition = function (x, y, z) {
        this.position.set(x, y, z);
        this.updatePosition();
    };

    // Apply options and create new cloth object
    Flag.prototype.setOptions = function (options) {
        options = Object.assign(this.options, options);

        if (this.isVertical()) {
            options = Object.assign({}, options, {
                width:  this.options.height,
                height: this.options.width
            });
        }

        this.createCloth(options);

        this.object.geometry.dispose();
        this.object.geometry = this.cloth.geometry;

        this.unpin();
        this.pin();

        this.updatePosition();
        this.updateTransform();
    };

    // Set flag texture
    Flag.prototype.setTexture = function (texture) {
        if (!(texture instanceof THREE.Texture)) {
            console.log(
                'Error: FlagWaver: Invalid texture object.'
            );

            return;
        }

        // texture.generateMipmaps = false;
        texture.needsUpdate = true;
        texture.anisotropy  = 16;
        texture.minFilter   = THREE.LinearFilter;
        texture.magFilter   = THREE.LinearFilter;
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

        // material = new THREE.MeshBasicMaterial({
        //     color:       0xff0000,
        //     wireframe:   true,
        //     transparent: true,
        //     opacity:     0.9
        // });

        if (this.object.material.map) { this.object.material.map.dispose(); }

        this.object.material.map = texture;
        this.object.material.needsUpdate = true;
        this.object.customDepthMaterial.uniforms.texture.value = texture;
        this.object.customDepthMaterial.needsUpdate = true;
    };

    // Apply transforms to flag texture
    Flag.prototype.transformTexture = function (transform) {
        if (this.img) {
            this.setTexture(createTextureFromImg(this.img, transform));
        }
    };

    // Recalculate texture transform based on image dimsensions and rotation
    Flag.prototype.updateTransform = function () {
        var transform = this.transform;
        var canvas;
        var offset;

        if (!this.img || !this.material.map) { return; }

        transform.resize = {
            width:  this.options.width,
            height: this.options.height
        };

        transform.rotate = Orientation.from(this.topEdge).angle;

        if (this.isVertical()) {
            canvas = this.material.map.image;
            offset = (canvas.width - canvas.height) / 2;

            if (transform.swapXY) { offset *= -1; }

            transform.translateX = -offset;
            transform.translateY = offset;
            transform.swapXY     = true;
        } else {
            transform.translateX = 0;
            transform.translateY = 0;
            transform.swapXY     = false;
        }

        this.transformTexture(transform);
    };

    // Load new image as flag texture
    Flag.prototype.loadTexture = function (imgSrc, callback) {
        var onTextureLoaded = function (img) {
            if (img) {
                this.img = img;
                this.setTexture(createTextureFromImg(img, this.transform));
                this.updateTransform();
            } else {
                this.setTexture(blankTexture);
            }

            if (typeof callback === 'function') {
                callback(img);
            }
        };

        loadImg(imgSrc, onTextureLoaded.bind(this));
    };

    // Set the hoisting to dexter or sinister
    Flag.prototype.setHoisting = function (hoisting) {
        if (hoisting !== Hoisting.SINISTER) { hoisting = Hoisting.DEXTER; }

        this.hoisting = hoisting;
        this.transform.reflect = hoisting === Hoisting.SINISTER;
        this.transformTexture(this.transform);
    };

    // Rotate the flag
    Flag.prototype.setTopEdge = function (edge) {
        var wasVertical = this.isVertical();

        switch (edge) {
            case 'left':   this.topEdge = Side.LEFT;   break;
            case 'bottom': this.topEdge = Side.BOTTOM; break;
            case 'right':  this.topEdge = Side.RIGHT;  break;
            case 'top':
            default:       this.topEdge = Side.TOP;    break;
        }

        if (wasVertical !== this.isVertical()) { this.setOptions(); }

        this.updateTransform();
    };

    // Reset flag to initial state
    Flag.prototype.reset = function () {
        var particles = this.cloth.particles;
        var i, il;

        for (i = 0, il = particles.length; i < il; i++) {
            particles[i].position.copy(particles[i].original);
        }
    };

    // Simulate flag cloth
    Flag.prototype.simulate = function () {
        var pins             = this.pins;
        var particles        = this.cloth.particles;
        var fixedConstraints = this.fixedConstraints;
        var particle;
        var i, il;

        this.cloth.simulate();

        // Pin constraints
        for (i = 0, il = pins.length; i < il; i++) {
            particle = particles[pins[i]];

            particle.position.copy(particle.original);
            particle.previous.copy(particle.position);
        }

        // Fixed flag constraints
        for (i = 0, il = fixedConstraints.length; i < il; i++) {
            fixedConstraints[i].satisfyFixed();
        }
    };

    // Render flag cloth
    Flag.prototype.render = function () { this.cloth.render(); };

    // Public flag interface
    Flag.prototype.createPublic = function () { return new PublicFlag(this); };

    // Public Flag interface constructor
    function PublicFlag(flag) {
        var isDefaultSize = true;
        var imgSrc        = null;

        function setDefaultSize(img) { // Get flag size from image
            var imgWidth  = (img) ? img.width  : defaultOptions.width;
            var imgHeight = (img) ? img.height : defaultOptions.height;
            var defaultSize = defaultOptions.height;
            var width, height;

            if (imgWidth / imgHeight < 1) { // vertical flag
                width  = defaultSize;
                height = defaultSize * imgHeight / imgWidth;
            } else { // horizontal or square flag
                width  = defaultSize * imgWidth / imgHeight;
                height = defaultSize;
            }

            flag.setOptions({ width: width, height: height });
        }

        this.options = {
            get topEdge() { return flag.topEdge; },
            set topEdge(val) { flag.setTopEdge(val); },

            get hoisting() { return flag.hoisting; },
            set hoisting(val) { flag.setHoisting(val); },

            get isDefaultSize() { return isDefaultSize; },
            set isDefaultSize(val) {
                isDefaultSize = !!val;

                if (isDefaultSize) { setDefaultSize(flag.img); }
            },

            get width() { return flag.options.width; },
            set width(val) {
                val = Number(val);

                if (Utils.isNumeric(val) && val > 0) {
                    isDefaultSize = false;
                    flag.setOptions({ width: val });
                }
            },

            get height() { return flag.options.height; },
            set height(val) {
                val = Number(val);

                if (Utils.isNumeric(val) && val > 0) {
                    isDefaultSize = false;
                    flag.setOptions({ height: val });
                }
            },

            get mass() { return flag.options.mass; },
            set mass(val) {
                val = Number(val);

                if (Utils.isNumeric(val) && val >= 0) {
                    flag.setOptions({ mass: val });
                }
            },

            get levelOfDetail() { return flag.options.levelOfDetail; },
            set levelOfDetail(val) {
                val = Math.round(val);

                if (Utils.isNumeric(val) && val > 0) {
                    flag.setOptions({ levelOfDetail: val });
                }
            },

            get imgSrc() { return imgSrc; },
            set imgSrc(src) {
                var callback;

                if (isDefaultSize) { callback = setDefaultSize; }

                flag.loadTexture(imgSrc = src, callback);
            }
        };

        if (DEBUG) { this._flag = flag; }
    }

    PublicFlag.prototype.setOpts = function (o) {
        for (var k in o) {
            if (this.options.hasOwnProperty(k) && o.hasOwnProperty(k)) {
                this.options[k] = o[k];
            }
        }
    };

    PublicFlag.prototype.getOpts = function () {
        var o = {};

        for (var k in this.options) {
            if (this.options.hasOwnProperty(k)) {
                o[k] = this.options[k];
            }
        }

        return o;
    };

    //
    // Rendering
    //

    // Renderer settings
    var poleOffset = 300;
    var poleHeight = 1000;

    // Renderer variables
    var scene;
    var camera;
    var renderer;
    var flag;
    var publicFlag;

    function init() {
        var light;
        var d;
        var poleGeo;
        var poleMat;
        var poleMesh;

        // Init scene
        scene     = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 1000, 10000);
        scene.fog.color.setHSL(0.6, 1, 0.9);

        // Init camera
        camera = new THREE.PerspectiveCamera(
            30,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );

        camera.position.y = 50;
        camera.position.z = 2000;

        scene.add(camera);

        // Init lights

        scene.add(new THREE.AmbientLight(0x222222));

        light = new THREE.DirectionalLight(0xffffff, 1.75);

        light.color.setHSL(0.6, 1, 0.9375);
        light.position.set(50, 175, 100);
        light.position.multiplyScalar(1.3);
        light.castShadow      = true;
        light.shadowMapWidth  = 2048;
        light.shadowMapHeight = 2048;
        light.shadowCameraTop    = d = 300;
        light.shadowCameraLeft   = -d;
        light.shadowCameraBottom = -d;
        light.shadowCameraRight  = d;
        light.shadowCameraFar    = 1000;
        light.shadowDarkness     = 0.5;

        scene.add(light);

        light = new THREE.DirectionalLight(0xffffff, 0.35);

        light.color.setHSL(0.3, 0.5, 0.75);
        light.position.set(0, -1, 0);

        scene.add(light);

        // Init flag pole
        poleGeo = new THREE.CylinderGeometry(6, 6, poleHeight);
        poleMat = new THREE.MeshPhongMaterial({
            color:     0x6A6A6A,
            specular:  0xffffff,
            metal:     true,
            shininess: 18
        });

        poleMesh = new THREE.Mesh(poleGeo, poleMat);

        poleMesh.position.y    = poleOffset - poleHeight / 2;
        poleMesh.position.x    = -4;
        poleMesh.receiveShadow = true;
        poleMesh.castShadow    = true;

        scene.add(poleMesh);

        // Init renderer object
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha:     true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaInput        = true;
        renderer.gammaOutput       = true;
        renderer.shadowMap.enabled = true;

        // Misc settings
        THREE.ImageUtils.crossOrigin = 'anonymous';

        // Add event handlers
        window.addEventListener('resize', onResize);
        onResize();

        // Init flag object
        flag = new Flag();

        flag.setTopEdge('top');
        flag.setHoisting('dexter');
        flag.setPosition(0, poleOffset, 0);
        flag.setTexture(blankTexture);

        scene.add(flag.object);

        publicFlag = flag.createPublic();

        // Begin animation
        animate();
    }

    function setWind(value) {
        if (Utils.isNumeric(value) && value > 0) {
            windStrength = value;
        } else {
            windStrength = 0;
        }

        wind = !!windStrength;
    }

    function onResize() {
        var h;

        if (renderer.domElement.parentElement) {
            h = renderer.domElement.parentElement.clientHeight;
        } else {
            h = 1;
        }

        camera.aspect = window.innerWidth / h;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, h);
        renderer.render(scene, camera);
    }

    var animationPaused = false;

    function animate() {
        if (!animationPaused) {
            window.requestAnimationFrame(animate);
        }

        animateFrame();
    }

    function animateFrame() {
        timePrev = time;
        time = Date.now();

        if (!timePrev) { return; }

        timestep = (time - timePrev) / 1000;
        if (timestep > TIMESTEP) { timestep = TIMESTEP; }
        timestepSq = timestep * timestep;

        // windStrength = Math.cos(time / 7000) * 100 + 200;
        // windStrength = 100;
        windForce.set(
            Math.sin(time / 2000),
            Math.cos(time / 3000),
            Math.sin(time / 1000)
        ).normalize().multiplyScalar(windStrength);
        // windForce.set(2000, 0, 1000).normalize().multiplyScalar(windStrength);

        flag.simulate();
        render();
    }

    function render() {
        flag.render();
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    //
    // Export
    //

    window.flagWaver = {
        init:      init,
        setWind:   setWind,
        animation: {
            start: function () {
                if (animationPaused) {
                    animationPaused = false;
                    animate();
                }
            },
            stop:   function () { animationPaused = true; },
            step:   function () { if (animationPaused) { animateFrame(); } },
            reset:  function () { flag.reset(); render(); },
            render: render
        },
        get flag() { return publicFlag; },
        get canvas() { return renderer.domElement; }
    };
})(window, document, THREE);
