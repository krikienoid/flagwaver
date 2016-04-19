/**
 * Flag Waver
 *
 * Simulate a flag waving in the breeze right in your browser window.
 *
 */

/*
 * Aug 9 2012
 *
 * Its Singapore's National Day, so
 * Making a quick tweaks to simulate the Singapore flag in the wind
 */

/*
 * Aug 3 2012
 *
 * Since I started working for a new startup not too long ago,
 * I commute between home and work for over 2 hours a day.
 * Although this means less time on three.js,
 * I try getting a little coding on the train.
 *
 * This set of experiments started from a simple hook's law doodle,
 * to spring simulation, string simulation, and I realized
 * I once again stepped onto physics and particle simulation,
 * this time, more specifically soft body physics.
 *
 * Based on the "Advanced Character Physics" article,
 * this experiment attempts to use a "massless"
 * cloth simulation model. It's somewhat similiar
 * but simplier to most cloth simulations I found.
 *
 * This was coded out fairly quickly, so expect more to come
 * meanwhile feel free to experiment yourself and share
 *
 * Cheers,
 * Graphics Noob (aka @Blurspline, zz85)
 */

/*
 * Suggested Readings
 *
 * Advanced Character Physics by Thomas Jakobsen Character -
 *     http://web.archive.org/web/20070610223835/http:/www.teknikus.dk/tj/gdc2001.htm
 * http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
 * http://en.wikipedia.org/wiki/Cloth_modeling
 * http://cg.alexandra.dk/tag/spring-mass-system/
 * Real-time Cloth Animation -
 *     http://www.darwin3d.com/gamedev/articles/col0599.pdf
 */

/*
 * Nov 14 2015
 *
 * Modified by /u/krikienoid for use in Flag Waver.
 */

//
// Flag Waver Tool
//

;( function ( window, document, THREE, undefined ) {

    //
    // Global settings
    //

    // Physics settings
    var DAMPING = 0.03,
        DRAG    = 1 - DAMPING,
        MASS    = 0.1,
        GRAVITY = 981 * 1.4;

    // Time settings
    var TIMESTEP    = 18 / 1000,
        TIMESTEP_SQ = TIMESTEP * TIMESTEP;

    // Wind settings
    var wind         = true,
        windStrength = 300,
        windForce    = new THREE.Vector3( 0, 0, 0 );

    // Ball settings
    var ballPosition = new THREE.Vector3( 0, -45, 0 ),
        ballSize     = 60; //40

    //
    // Simulation classes
    //

    // Cloth simulation variables
    var gravityForce = new THREE.Vector3( 0, -GRAVITY, 0 ).multiplyScalar( MASS ),
        tmpForce     = new THREE.Vector3(),
        diff         = new THREE.Vector3(),
        lastTime;

    // Particle constructor
    function Particle ( position, mass ) {
        this.position = new THREE.Vector3(); // position
        this.previous = new THREE.Vector3(); // previous
        this.original = new THREE.Vector3();
        this.position.copy( position );
        this.previous.copy( position );
        this.original.copy( position );
        this.accel    = new THREE.Vector3( 0, 0, 0 ); // acceleration
        this.mass     = mass;
        this.invMass  = 1 / mass;
        this.tmp      = new THREE.Vector3();
        this.tmp2     = new THREE.Vector3();
    }

    // Force -> Acceleration
    Particle.prototype.addForce = function ( force ) {
        this.accel.add(
            this.tmp2.copy( force ).multiplyScalar( this.invMass )
        );
    };

    // Performs verlet integration
    Particle.prototype.integrate = function ( timesq ) {

        var newPos = this.tmp.subVectors( this.position, this.previous );
        newPos.multiplyScalar( DRAG ).add( this.position );
        newPos.add( this.accel.multiplyScalar( timesq ) );

        this.tmp      = this.previous;
        this.previous = this.position;
        this.position = newPos;

        this.accel.set( 0, 0, 0 );

    };

    // Cloth constructor
    function Cloth ( xSegs, ySegs, restDistance ) {

        var particles   = [],
            constraints = [],
            index,
            plane,
            geometry,
            width, height,
            u, v;

        xSegs        = window.Math.round( xSegs ) || 15;
        ySegs        = window.Math.round( ySegs ) || 10;
        restDistance = window.Math.round( restDistance ) || 20;
        width        = restDistance * xSegs;
        height       = restDistance * ySegs;

        // Index get function
        index = function ( u, v ) { return u + v * ( xSegs + 1 ); };

        // Cloth plane function
        plane = function ( u, v ) {
            return new THREE.Vector3( u * width, v * height, 0 ); //( u - 0.5 )
        };

        // Cloth geometry
        geometry = new THREE.ParametricGeometry( plane, xSegs, ySegs, true );
        geometry.dynamic = true;
        geometry.computeFaceNormals();

        // Particles
        for ( v = 0; v <= ySegs ; v++ ) {
            for ( u = 0; u <= xSegs; u++ ) {
                particles.push(
                    new Particle( plane( u / xSegs, v / ySegs ), MASS )
                );
            }
        }

        // Structural constraints

        for ( v = 0; v < ySegs; v++ ) {
            for ( u = 0; u < xSegs; u++ ) {

                constraints.push( [
                    particles[ index( u, v ) ],
                    particles[ index( u, v + 1 ) ],
                    restDistance
                ] );

                constraints.push( [
                    particles[ index( u, v ) ],
                    particles[ index( u + 1, v ) ],
                    restDistance
                ] );

            }
        }

        for ( u = xSegs, v = 0; v < ySegs; v++ ) {
            constraints.push( [
                particles[ index( u, v ) ],
                particles[ index( u, v + 1 ) ],
                restDistance

            ] );
        }

        for ( v = ySegs, u = 0; u < xSegs; u++ ) {
            constraints.push( [
                particles[ index( u, v ) ],
                particles[ index( u + 1, v ) ],
                restDistance
            ] );
        }

        // While many systems use shear and bend springs,
        // the relax constraints model seems to be just fine
        // using structural springs.

        // Shear
        var diagonalDist = window.Math.sqrt( restDistance * restDistance * 2 );

        for ( v = 0; v < ySegs; v++ ) {
            for ( u = 0; u < xSegs; u++ ) {

                constraints.push( [
                    particles[ index( u, v ) ],
                    particles[ index( u + 1, v + 1 ) ],
                    diagonalDist
                ] );

                constraints.push( [
                    particles[ index( u + 1, v ) ],
                    particles[ index( u, v + 1 ) ],
                    diagonalDist
                ] );

            }
        }

        // Bend

        // var wlen = restDistance * 2,
        //     hlen = restDistance * 2;

        // diagonalDist = window.Math.sqrt( wlen * wlen + hlen * hlen );

        // for ( v = 0; v < ySegs - 1; v++ ) {
        //     for ( u = 0; u < xSegs - 1; u++ ) {

        //         constraints.push( [
        //             particles[ index( u, v ) ],
        //             particles[ index( u + 2, v ) ],
        //             wlen
        //         ] );

        //         constraints.push( [
        //             particles[ index( u, v ) ],
        //             particles[ index( u, v + 2 ) ],
        //             hlen
        //         ] );

        //         constraints.push( [
        //             particles[ index( u, v ) ],
        //             particles[ index( u + 2, v + 2 ) ],
        //             diagonalDist
        //         ] );

        //         constraints.push( [
        //             particles[ index( u, v + 2 ) ],
        //             particles[ index( u + 2, v + 2 ) ],
        //             wlen
        //         ] );

        //         constraints.push( [
        //             particles[ index( u + 2, v + 2 ) ],
        //             particles[ index( u + 2, v + 2 ) ],
        //             hlen
        //         ] );

        //         constraints.push( [
        //             particles[ index( u + 2,  v ) ],
        //             particles[ index( u , v + 2 ) ],
        //             diagonalDist
        //         ] );

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

    }

    // Helper function
    function satisfyConstraints ( p1, p2, distance ) {

        var currentDist,
            correction,
            correctionHalf;

        diff.subVectors( p2.position, p1.position );
        currentDist = diff.length();
        if ( currentDist === 0 ) return; // prevents division by 0
        correction = diff.multiplyScalar( 1 - distance / currentDist );
        correctionHalf = correction.multiplyScalar( 0.5 );
        p1.position.add( correctionHalf );
        p2.position.sub( correctionHalf );

        // float difference = ( restingDistance - d ) / d
        // im1 = 1 / p1.mass // inverse mass quantities
        // im2 = 1 / p2.mass
        // p1.position += delta * ( im1 / ( im1 + im2 ) ) * stiffness * difference

    }

    // Simulate cloth
    Cloth.prototype.simulate = function ( time ) {

        var particles   = this.particles,
            constraints = this.constraints,
            faces       = this.geometry.faces,
            particle, constraint,
            face, normal,
            i, il;

        // if ( !lastTime ) {
        //     lastTime = time;
        //     return;
        // }
        // TIMESTEP    = ( time - lastTime );
        // TIMESTEP    = ( TIMESTEP > 30 ) ? TIMESTEP / 1000 : 30 / 1000;
        // TIMESTEP_SQ = TIMESTEP * TIMESTEP;
        // lastTime    = time;
        // console.log( TIMESTEP );

        // Aerodynamic forces
        if ( wind ) {
            for ( i = 0, il = faces.length; i < il; i++ ) {
                face   = faces[ i ];
                normal = face.normal;
                tmpForce.copy( normal ).normalize().multiplyScalar(
                    normal.dot( windForce )
                );
                particles[ face.a ].addForce( tmpForce );
                particles[ face.b ].addForce( tmpForce );
                particles[ face.c ].addForce( tmpForce );
            }
        }

        // Gravity force
        for ( i = 0, il = particles.length; i < il; i++ ) {
            particle = particles[ i ];
            particle.addForce( gravityForce );

            // var x = particle.position.x,
            //     y = particle.position.y,
            //     z = particle.position.z,
            //     t = window.Date.now() / 1000;
            // windForce.set(
            //     window.Math.sin( x * y * t ),
            //     window.Math.cos( z * t ),
            //     window.Math.sin( window.Math.cos( 5 * x * y * z ) )
            // ).multiplyScalar( 100 );
            // particle.addForce( windForce );
            particle.integrate( TIMESTEP_SQ );
        }

        // Start constraints
        for ( i = 0, il = constraints.length; i < il; i++ ) {
            constraint = constraints[ i ];
            satisfyConstraints(
                constraint[ 0 ],
                constraint[ 1 ],
                constraint[ 2 ]
            );
        }

        // Ball constraints
        ballPosition.z = -window.Math.sin( window.Date.now() / 300 ) * 90; //+40
        ballPosition.x = window.Math.cos( window.Date.now() / 200 ) * 70;

        // if ( sphere.visible ) {
        //     for ( i = 0, il = particles.length; i < il; i++ ) {
        //         particle = particles[ i ];
        //         pos = particle.position;
        //         diff.subVectors( pos, ballPosition );
        //         if ( diff.length() < ballSize ) {
        //             // collided
        //             diff.normalize().multiplyScalar( ballSize );
        //             pos.copy( ballPosition ).add( diff );
        //         }
        //     }
        // }

    };

    // Render cloth
    Cloth.prototype.render = function () {
        var particles = this.particles,
            vertices  = this.geometry.vertices,
            i, il;
        for ( i = 0, il = particles.length; i < il; i++ ) {
            vertices[ i ].copy( particles[ i ].position );
        }
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
        this.geometry.normalsNeedUpdate  = true;
        this.geometry.verticesNeedUpdate = true;
    };

    // Flag settings enums
    var HOISTING = { Dexter : 'dexter', Sinister : 'sinister' },
        EDGE     = {
            Top    : { name : 'top',    direction : 0                   },
            Left   : { name : 'left',   direction : -window.Math.PI / 2 },
            Bottom : { name : 'bottom', direction : window.Math.PI      },
            Right  : { name : 'right',  direction : window.Math.PI / 2  }
        };

    // Edge relations
    // c = clockwise, cc = counterclockwise, x = across
    EDGE.Left.c   = EDGE.Bottom.x = EDGE.Right.cc  = EDGE.Top;
    EDGE.Bottom.c = EDGE.Right.x  = EDGE.Top.cc    = EDGE.Left;
    EDGE.Right.c  = EDGE.Top.x    = EDGE.Left.cc   = EDGE.Bottom;
    EDGE.Top.c    = EDGE.Left.x   = EDGE.Bottom.cc = EDGE.Right;

    // Flag constructor
    function Flag ( xSegs, ySegs, restDistance ) {

        this.cloth    = new Cloth( xSegs, ySegs, restDistance );
        this.pins     = [];

        this.position = new THREE.Vector3( 0, 0, 0 );
        this.offset   = new THREE.Vector3( 0, 0, 0 );
        this.hoisting = HOISTING.Dexter;
        this.topEdge  = EDGE.Top;

        this.material = new THREE.MeshPhongMaterial( {
            alphaTest : 0.5,
            color     : 0xffffff,
            specular  : 0x030303,
            shininess : 0.001, // https://github.com/mrdoob/three.js/issues/7252
            metal     : false,
            side      : THREE.DoubleSide
        } );

        this.object = new THREE.Mesh( this.cloth.geometry, this.material );
        this.object.castShadow    = true;
        this.object.receiveShadow = true;
        this.object.customDepthMaterial = new THREE.ShaderMaterial( {
            uniforms       : { texture : { type: 't', value: blankTexture } },
            vertexShader   : vertexShader,
            fragmentShader : fragmentShader
        } );

        this.updateQuaternion();

    }

    // Set flag texture from image
    Flag.prototype.loadTexture = function ( imgSrc ) {

        var setTexture = this.setTexture.bind( this ),
            texture,
            tmpImg;

        if ( imgSrc.substr( 0, 5 ) === 'data:' ) {
            tmpImg = document.createElement( 'img' );
            tmpImg.src = imgSrc;
            texture = new THREE.Texture( tmpImg );
            texture.needsUpdate = true;
            setTexture( texture );
        }
        else {
            texture = THREE.ImageUtils.loadTexture(
                imgSrc,
                null,
                function () { setTexture( texture ); },
                function () {
                    window.console.log(
                        'Error: FlagWaver: Failed to load image as texture.'
                    );
                    setTexture( blankTexture );
                }
            );
        }

    };

    // Pin edges of flag cloth
    Flag.prototype.pin = function ( edge, spacing ) {

        var pins  = this.pins,
            xSegs = this.cloth.xSegs,
            ySegs = this.cloth.ySegs,
            index = this.cloth.index,
            i;

        spacing = window.parseInt( spacing );
        if ( window.isNaN( spacing ) || spacing < 1 ) spacing = 1;

        switch ( edge ) {
            case EDGE.Top :
                for ( i = 0; i <= xSegs; i += spacing ) {
                    pins.push( index( i, ySegs ) );
                }
                break;
            case EDGE.Bottom :
                for ( i = 0; i <= xSegs; i += spacing ) {
                    pins.push( index( i, 0 ) );
                }
                break;
            case EDGE.Right :
                for ( i = 0; i <= ySegs; i += spacing ) {
                    pins.push( index( xSegs, i ) );
                }
                break;
            case EDGE.Left :
            default :
                for ( i = 0; i <= ySegs; i += spacing ) {
                    pins.push( index( 0, i ) );
                }
                break;
        }

    };

    // Remove pins from flag cloth
    Flag.prototype.unpin = function () { this.pins = []; };

    // Recalculate offset position when flag is rotated
    Flag.prototype.updatePosition = function () {

        var isFlipped = ( this.hoisting === HOISTING.Sinister ),
            w = this.cloth.width,
            h = this.cloth.height;

        switch ( this.topEdge ) {
            case EDGE.Bottom :
                this.offset.x = this.position.x + ( ( isFlipped )? 0 : w );
                this.offset.y = this.position.y;
                break;
            case EDGE.Left :
                this.offset.x = this.position.x + ( ( isFlipped )? -h : 0 );
                this.offset.y = this.position.y;
                break;
            case EDGE.Right :
                this.offset.x = this.position.x + ( ( isFlipped )? 0 : h );
                this.offset.y = this.position.y - w;
                break;
            case EDGE.Top :
            default :
                this.offset.x = this.position.x + ( ( isFlipped )? -w : 0 );
                this.offset.y = this.position.y - h;
                break;
        }

        this.object.position.set( this.offset.x, this.offset.y, 0 );

    };

    // Recalculate quaternion when flag is rotated
    Flag.prototype.updateQuaternion = function () {

        var quaternion = new THREE.Quaternion(),
            yAxis      = new THREE.Vector3( 0, 1, 0 ),
            zAxis      = new THREE.Vector3( 0, 0, 1 ),
            yRadians   = 0,
            zRadians   = this.topEdge.direction;

        if ( this.hoisting === HOISTING.Sinister ) {
            yRadians = window.Math.PI;
        }

        quaternion.setFromAxisAngle( yAxis, yRadians );
        quaternion.setFromAxisAngle( zAxis, zRadians );

        this.quaternion = quaternion;

    };

    // Determine hoist edge based on rotation and reapply pins
    Flag.prototype.updatePins = function () {
        this.unpin();
        this.pin(
            ( this.hoisting === HOISTING.Sinister )?
            this.topEdge.c :
            this.topEdge.cc
        );
    };

    // Set the flag's position
    Flag.prototype.setPosition = function ( x, y, z ) {
        this.position.set( x, y, z );
        this.updatePosition();
    };

    // Rotate the flag
    Flag.prototype.setTopEdge = function ( edge ) {
        switch ( edge ) {
            case 'left'   : this.topEdge = EDGE.Left;   break;
            case 'bottom' : this.topEdge = EDGE.Bottom; break;
            case 'right'  : this.topEdge = EDGE.Right;  break;
            case 'top'    :
            default       : this.topEdge = EDGE.Top;    break;
        }
        this.updatePins();
        this.updatePosition();
        this.updateQuaternion();
    };

    // Set the hoisting to dexter or sinister
    Flag.prototype.setHoisting = function ( hoisting ) {
        if ( hoisting !== HOISTING.Sinister ) hoisting = HOISTING.Dexter;
        this.hoisting = hoisting;
        this.updatePins();
        this.updatePosition();
        this.updateQuaternion();
    };

    // Set new cloth object
    Flag.prototype.setCloth = function ( xSegs, ySegs, restDistance ) {

        var oldGeo = this.object.geometry;

        this.cloth = new Cloth( xSegs, ySegs, restDistance );

        this.object.geometry = this.cloth.geometry;

        oldGeo.dispose();

        this.updatePins();
        this.updatePosition();

    };

    // Set flag texture
    Flag.prototype.setTexture = function ( texture ) {

        var oldTex;

        if ( !( texture instanceof THREE.Texture ) ) {
            window.console.log(
                'Error: FlagWaver: Invalid texture object.'
            );
            return;
        }

        // texture.generateMipmaps = false;
        texture.anisotropy = 16;
        texture.minFilter  = THREE.LinearFilter;
        texture.magFilter  = THREE.LinearFilter;
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

        /*material = new THREE.MeshBasicMaterial( {
            color       : 0xff0000,
            wireframe   : true,
            transparent : true,
            opacity     : 0.9
        } );*/

        oldTex = this.object.material.map

        this.object.material.map = texture;
        this.object.material.needsUpdate = true;
        this.object.customDepthMaterial.uniforms.texture.value = texture;
        this.object.customDepthMaterial.needsUpdate = true;

        if ( oldTex ) oldTex.dispose();

    };

    // Reset flag to initial state
    Flag.prototype.reset = function () {

        var particles  = this.cloth.particles,
            i, il;

        for ( i = 0, il = particles.length; i < il; i++ ) {
            particles[ i ].position.copy(
                particles[ i ].original
            ).applyQuaternion( this.quaternion );
        }

    };

    // Simulate flag cloth
    Flag.prototype.simulate = function () {

        var pins      = this.pins,
            particles = this.cloth.particles,
            particle,
            i, il;

        this.cloth.simulate();

        // Pin constraints
        for ( i = 0, il = pins.length; i < il; i++ ) {
            particle = particles[ pins[ i ] ];
            particle.position.copy( particle.original ).applyQuaternion(
                this.quaternion
            );
            particle.previous.copy( particle.position );
        }

    };

    // Render flag cloth
    Flag.prototype.render = function () { this.cloth.render(); };

    // Public flag interface
    Flag.prototype.createPublic = function () { return new PublicFlag( this ); };

    function getImgSize ( imgSrc, callback ) {

        // Test load to get image size
        var testImg = new window.Image();

        // Load image and get size
        testImg.onload = function () {
            if ( typeof callback === 'function' ) {
                callback( this.width, this.height );
            }
        };

        // Do nothing if image fails to load
        testImg.onerror = function () {
            window.console.log(
                'Error: FlagWaver: Failed to load image from ' + imgSrc + '.'
            );
        };

        // Attempt to load image
        testImg.src = imgSrc;

    }

    // Public Flag interface constructor
    function PublicFlag ( flag ) {

        var isDefaultSize = true;
            xSegs         = 15,
            ySegs         = 10,
            imgSrc        = null;

        function setDefaultSize () {
            getImgSize( imgSrc, function ( w, h ) {
                // Get flag size from image
                var defaultSize = 10 * granularity;
                if ( w / h < 1 ) { // vertical flag
                    xSegs = defaultSize;
                    ySegs = window.Math.round( defaultSize * h / w );
                }
                else { // horizontal or square flag
                    xSegs = window.Math.round( defaultSize * w / h );
                    ySegs = defaultSize;
                }
                flag.setCloth( xSegs, ySegs, 20 / granularity );
            } );
        }

        this.options = {

            get topEdge () { return flag.topEdge.name; },
            set topEdge ( val ) { flag.setTopEdge( val ); },

            get hoisting () { return flag.hoisting; },
            set hoisting ( val ) { flag.setHoisting( val ); },

            get isDefaultSize () { return isDefaultSize; },
            set isDefaultSize ( val ) {
                isDefaultSize = !!val;
                if ( isDefaultSize ) setDefaultSize();
            },

            get width () { return xSegs; },
            set width ( val ) {
                val = window.parseInt( val );
                if ( !window.isNaN( val ) && val > 0 ) {
                    xSegs = val;
                    isDefaultSize = false;
                    flag.setCloth( xSegs, ySegs, 20 / granularity );
                }
            },

            get height () { return ySegs; },
            set height ( val ) {
                val = window.parseInt( val );
                if ( !window.isNaN( val ) && val > 0 ) {
                    ySegs = val;
                    isDefaultSize = false;
                    flag.setCloth( xSegs, ySegs, 20 / granularity );
                }
            },

            get imgSrc () { return imgSrc; },
            set imgSrc ( src ) {
                flag.loadTexture( imgSrc = src );
                if ( isDefaultSize ) setDefaultSize();
            }

        };

    }

    PublicFlag.prototype.setOpts = function ( o ) {
        for ( var k in o ) {
            if ( this.options.hasOwnProperty( k ) && o.hasOwnProperty( k ) ) {
                this.options[ k ] = o[ k ];
            }
        }
    };

    PublicFlag.prototype.getOpts = function () {
        var o = {};
        for ( var k in this.options ) {
            if ( this.options.hasOwnProperty( k ) ) {
                o[ k ] = this.options[ k ];
            }
        }
        return o;
    };

    //
    // Rendering
    //

    // Renderer settings
    var granularity = 1,
        poleOffset  = 300,
        poleHeight  = 1000;

    // Flag default settings
    var defaultSettings = {
        width    : null,     // w = 15
        height   : 10,       // h = 10
        hoisting : 'dexter', // hoist = dexter | sinister
        topEdge  : 'top',    // top = top | left | bottom | right
        src      : '',       // src = field.png
        reverse  : ''        // reverse = 'field.png'
    };

    var blankTexture = THREE.ImageUtils.generateDataTexture(
        4,
        4,
        new THREE.Color( 0xffffff )
    );

    // Renderer variables
    var vertexShader, fragmentShader,
        scene, camera, renderer,
        flag, publicFlag;

    function init () {

        var light, d,
            poleGeo, poleMat, poleMesh;

        // Get shaders
        vertexShader   = document.getElementById( 'vertexShaderDepth' ).textContent;
        fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

        // Init scene
        scene     = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x000000, 1000, 10000 );
        scene.fog.color.setHSL( 0.6, 1, 0.9 );

        // Init camera
        camera = new THREE.PerspectiveCamera(
            30,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );
        camera.position.y = 50;
        camera.position.z = 2000;
        scene.add( camera );

        // Init lights
        scene.add( new THREE.AmbientLight( 0x222222 ) );
        light = new THREE.DirectionalLight( 0xffffff, 1.75 );
        light.color.setHSL( 0.6, 1, 0.9375 );
        light.position.set( 50, 175, 100 );
        light.position.multiplyScalar( 1.3 );
        light.castShadow      = true;
        light.shadowMapWidth  = 2048;
        light.shadowMapHeight = 2048;
        light.shadowCameraTop    = d = 300;
        light.shadowCameraLeft   = -d;
        light.shadowCameraBottom = -d;
        light.shadowCameraRight  = d;
        light.shadowCameraFar    = 1000;
        light.shadowDarkness     = 0.5;
        scene.add( light );
        light = new THREE.DirectionalLight( 0xffffff, 0.35 );
        light.color.setHSL( 0.3, 0.5, 0.75 );
        light.position.set( 0, -1, 0 );
        scene.add( light );

        // Init flag pole
        poleGeo = new THREE.CylinderGeometry( 6, 6, poleHeight );
        poleMat = new THREE.MeshPhongMaterial( {
            color     : 0x6A6A6A,
            specular  : 0xffffff,
            metal     : true,
            shininess : 18
        } );
        poleMesh = new THREE.Mesh( poleGeo, poleMat );
        poleMesh.position.y    = poleOffset - poleHeight / 2;
        poleMesh.position.x    = -4;
        poleMesh.receiveShadow = true;
        poleMesh.castShadow    = true;
        scene.add( poleMesh );

        // Init renderer object
        renderer = new THREE.WebGLRenderer( {
            antialias : true,
            alpha     : true
        } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.gammaInput             = true;
        renderer.gammaOutput            = true;
        renderer.shadowMap.enabled      = true;

        // Misc settings
        THREE.ImageUtils.crossOrigin = 'anonymous';

        // Add event handlers
        window.addEventListener( 'resize', onResize );
        onResize();

        // Init flag object
        flag = new Flag( 15, 10, 20 );
        flag.setTopEdge( 'top' );
        flag.setHoisting( 'dexter' );
        flag.setPosition( 0, poleOffset, 0 );
        flag.setTexture( blankTexture );
        scene.add( flag.object );
        publicFlag = flag.createPublic();

        // Begin animation
        animate();

    }

    function setWind ( value ) {
        if ( !window.isNaN( value ) ) {
            windStrength = value;
        }
        else {
            windStrength = 0;
        }
        wind = !!windStrength;
    }

    function onResize () {
        var h;
        if ( renderer.domElement.parentElement ) {
            h = renderer.domElement.parentElement.clientHeight;
        }
        else {
            h = 1;
        }
        camera.aspect = window.innerWidth / h;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, h );
        renderer.render( scene, camera );
    }

    var animationPaused = false;

    function animate () {
        if ( !animationPaused ) {
            window.requestAnimationFrame( animate );
        }
        animateFrame();
    }

    function animateFrame () {
        var time = window.Date.now();
        // windStrength = window.Math.cos( time / 7000 ) * 100 + 200;
        // windStrength = 100;
        windForce.set(
            window.Math.sin( time / 2000 ),
            window.Math.cos( time / 3000 ),
            window.Math.sin( time / 1000 )
        ).normalize().multiplyScalar( windStrength );
        // windForce.set( 2000, 0, 1000 ).normalize().multiplyScalar( windStrength );
        flag.simulate( time );
        render();
    }

    function render () {
        var timer = window.Date.now() * 0.0002;
        flag.render();
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
    }

    //
    // Export
    //

    window.flagWaver = {
        init       : init,
        setWind    : setWind,
        animation  : {
            start  : function () {
                if ( animationPaused ) {
                    animationPaused = false;
                    animate();
                }
            },
            stop   : function () { animationPaused = true; },
            step   : function () { if ( animationPaused ) animateFrame(); },
            reset  : function () { flag.reset(); render(); },
            render : render
        },
        get flag () { return publicFlag; },
        get canvas () { return renderer.domElement; }
    };

} )( window, document, THREE );
