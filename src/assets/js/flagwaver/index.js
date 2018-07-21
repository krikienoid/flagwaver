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
import Flag from './subjects/Flag';
import Wind from './subjects/Wind';
import WindModifiers from './subjects/WindModifiers';
import loadImage from './helpers/loadImage';
import buildFlag from './builders/buildFlag';
import applyWindForceToCloth from './interactions/applyWindForceToCloth';
import applyGravityToCloth from './interactions/applyGravityToCloth';

;(function (window, document, THREE, undefined) {
    //
    // Global settings
    //

    // Time settings
    var FPS        = 60;
    var TIMESTEP   = 1 / FPS;
    var timestep   = TIMESTEP;
    var timestepSq = timestep * timestep;
    var time;
    var timePrev;

    //
    // Simulation classes
    //

    // Public Flag interface constructor
    function PublicFlag(flag) {
        var self = this;

        var isDefaultSize = true;

        this.subject = flag || new Flag();
        this.configOptions = Object.assign({}, Flag.defaults);

        function swap(flag) {
            var old = self.subject;

            scene.remove(old.object);
            old.destroy();

            self.subject = flag;

            scene.add(self.subject.object);
        }

        function update(options) {
            var settings = Object.assign(
                {},
                Object.assign(self.configOptions, options)
            );

            if (settings.imgSrc) {
                loadImage(settings.imgSrc, function (image) {
                    if (image) {
                        if (isDefaultSize) {
                            settings.width = settings.height = 'auto';
                        }

                        swap(buildFlag(image, settings));
                    } else {
                        swap(new Flag(settings));
                    }
                });
            } else {
                swap(new Flag(settings));
            }
        }

        this.update = update;

        this.options = {
            get topEdge() { return self.configOptions.topEdge; },
            set topEdge(val) { update({ topEdge: val }); },

            get hoisting() { return self.configOptions.hoisting; },
            set hoisting(val) { update({ hoisting: val }); },

            get isDefaultSize() { return isDefaultSize; },
            set isDefaultSize(val) {
                var img;

                isDefaultSize = !!val;

                if (isDefaultSize) {
                    img = self.configOptions.imgSrc;
                    update({
                        width: img ? 'auto' : Flag.defaults.width,
                        height: img ? 'auto' : Flag.defaults.height
                    });
                }
            },

            get width() { return self.configOptions.width; },
            set width(val) {
                val = Number(val);

                if (Utils.isNumeric(val) && val > 0) {
                    isDefaultSize = false;
                    update({ width: val });
                }
            },

            get height() { return self.configOptions.height; },
            set height(val) {
                val = Number(val);

                if (Utils.isNumeric(val) && val > 0) {
                    isDefaultSize = false;
                    update({ height: val });
                }
            },

            get mass() { return self.configOptions.mass; },
            set mass(val) {
                val = Number(val);

                if (Utils.isNumeric(val) && val >= 0) {
                    update({ mass: val });
                }
            },

            get granularity() { return self.configOptions.granularity; },
            set granularity(val) {
                val = Math.round(val);

                if (Utils.isNumeric(val) && val > 0) {
                    update({ granularity: val });
                }
            },

            get imgSrc() { return self.configOptions.imgSrc; },
            set imgSrc(src) { update({ imgSrc: src }); }
        };

        update(this.configOptions);

        if (DEBUG) { this._flag = flag; }
    }

    PublicFlag.prototype.setOpts = function (o) {
        this.update(o);
        return this.getOpts();
    };

    PublicFlag.prototype.getOpts = function () {
        return Object.assign({}, this.configOptions);
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
    var wind;
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

        // Add event handlers
        window.addEventListener('resize', onResize);
        onResize();

        // Init flag object
        var flag = new Flag({
            topEdge: 'top',
            hoisting: 'dexter'
        });

        flag.object.position.set(0, poleOffset, 0);

        publicFlag = new PublicFlag(flag);

        wind = new Wind({
            directionModifier: WindModifiers.rotatingDirection
        });

        // Begin animation
        animate();
    }

    function setWind(value) {
        if (Utils.isNumeric(value) && value > 0) {
            wind.speed = value;
        } else {
            wind.speed = 0;
        }
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

        wind.update(timestep);
        applyWindForceToCloth(publicFlag.subject.cloth, wind);
        applyGravityToCloth(publicFlag.subject.cloth);
        publicFlag.subject.simulate(timestep);
        render();
    }

    function render() {
        publicFlag.subject.render();
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
            reset:  function () { publicFlag.subject.reset(); render(); },
            render: render
        },
        get flag() { return publicFlag; },
        get canvas() { return renderer.domElement; }
    };
})(window, document, THREE);
