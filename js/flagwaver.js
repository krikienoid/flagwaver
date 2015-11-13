/**
 * Flag Waver
 *
 * Simulate a flag waving in the breeze right in your browser window.
 *
 */

/*
 * Aug 9 2012
 * Its Singapore's National Day, so
 * Making a quick tweaks to simulate the Singapore flag in the wind
 *
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

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character - http://web.archive.org/web/20070610223835/http:/www.teknikus.dk/tj/gdc2001.htm
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

/*
 * Sep 12 2015
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
        MASS    = .1,
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

    // Simulation variables
    var gravityForce = new THREE.Vector3( 0, -GRAVITY, 0 ).multiplyScalar( MASS ),
        tmpForce     = new THREE.Vector3(),
        diff         = new THREE.Vector3(),
        lastTime;

    //
    // Simulation classes
    //

    // Particle constructor
    function Particle ( x, y, z, plane, mass ) {
        this.position = plane( x, y ); // position
        this.previous = plane( x, y ); // previous
        this.original = plane( x, y );
        this.a        = new THREE.Vector3( 0, 0, 0 ); // acceleration
        this.mass     = mass;
        this.invMass  = 1 / mass;
        this.tmp      = new THREE.Vector3();
        this.tmp2     = new THREE.Vector3();
    }

    // Force -> Acceleration
    Particle.prototype.addForce = function ( force ) {
        this.a.add(
            this.tmp2.copy( force ).multiplyScalar( this.invMass )
        );
    };

    // Performs verlet integration
    Particle.prototype.integrate = function ( timesq ) {

        var newPos = this.tmp.subVectors( this.position, this.previous );
        newPos.multiplyScalar( DRAG ).add( this.position );
        newPos.add( this.a.multiplyScalar( timesq ) );

        this.tmp      = this.previous;
        this.previous = this.position;
        this.position = newPos;

        this.a.set( 0, 0, 0 );

    }

    // Cloth constructor
    function Cloth ( xSegs, ySegs, restDistance ) {

        var particles   = [],
            constraints = [],
            pins        = [],
            plane,
            geometry,
            width, height,
            u, v;

        xSegs        = window.Math.round( xSegs ) || 15;
        ySegs        = window.Math.round( ySegs ) || 10;
        restDistance = window.Math.round( restDistance ) || 20;
        width        = restDistance * xSegs;
        height       = restDistance * ySegs;

        // Index
        function index ( u, v ) {
            return u + v * ( xSegs + 1 );
        }

        // Cloth Plane
        plane = function plane ( u, v ) {
            var x = u * width, //( u - 0.5 )
                y = v * height,
                z = 0;
            return new THREE.Vector3( x, y, z );
        };

        // Cloth Geometry
        geometry = new THREE.ParametricGeometry( plane, xSegs, ySegs, true );
        geometry.dynamic = true;
        geometry.computeFaceNormals();

        // Particles
        for ( v = 0; v <= ySegs ; v++ ) {
            for ( u = 0; u <= xSegs; u++ ) {
                particles.push(
                    new Particle (
                        u / xSegs,
                        v / ySegs,
                        0,
                        plane,
                        MASS
                    )
                );
            }
        }

        // Structural Constraints

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
                particles[ index( u, v  ) ],
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

        // var wlen = restDistance * 2;
        // var hlen = restDistance * 2;
        // diagonalDist = window.Math.sqrt( wlen * wlen + hlen * hlen );

        // for ( v = 0; v < ySegs - 1; v++ ) {
        // 	for ( u = 0; u < xSegs - 1; u++ ) {
        // 		constraints.push( [
        // 			particles[ index( u, v ) ],
        // 			particles[ index( u + 2, v ) ],
        // 			wlen
        // 		] );

        // 		constraints.push( [
        // 			particles[ index( u, v ) ],
        // 			particles[ index( u, v + 2 ) ],
        // 			hlen
        // 		] );

        // 		constraints.push( [
        // 			particles[ index( u, v ) ],
        // 			particles[ index( u + 2, v + 2 ) ],
        // 			diagonalDist
        // 		] );

        // 		constraints.push( [
        // 			particles[ index( u, v + 2 ) ],
        // 			particles[ index( u + 2, v + 2 ) ],
        // 			wlen
        // 		] );

        // 		constraints.push( [
        // 			particles[ index( u + 2, v + 2 ) ],
        // 			particles[ index( u + 2, v + 2 ) ],
        // 			hlen
        // 		] );

        // 		constraints.push( [
        // 			particles[ index( u + 2,  v ) ],
        // 			particles[ index( u , v + 2 ) ],
        // 			diagonalDist
        // 		] );

        // 	}
        // }

        // Public Properties and Methods
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
        this.pins         = pins;

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
            pins        = this.pins,
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
                tmpForce.copy( normal ).normalize().multiplyScalar( normal.dot( windForce ) );
                particles[ face.a ].addForce( tmpForce );
                particles[ face.b ].addForce( tmpForce );
                particles[ face.c ].addForce( tmpForce );
            }
        }

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
            satisfyConstraints( constraint[ 0 ], constraint[ 1 ], constraint[ 2 ] );
        }

        // Ball constraints
        ballPosition.z = -window.Math.sin( window.Date.now() / 300 ) * 90 ; //+ 40;
        ballPosition.x = window.Math.cos( window.Date.now() / 200 ) * 70

        // if ( sphere.visible ) {
        //     for ( i = 0, il = particles.length; i < il; i++ ) {
        //     	   particle = particles[ i ];
        //     	   pos = particle.position;
        //     	   diff.subVectors( pos, ballPosition );
        //     	   if ( diff.length() < ballSize ) {
        //     	   	   // collided
        //     	   	   diff.normalize().multiplyScalar( ballSize );
        //     	   	   pos.copy( ballPosition ).add( diff );
        //     	   }
        //     }
        // }

        // Pin constraints
        for ( i = 0, il = pins.length; i < il; i++ ) {
            particle = particles[ pins[ i ] ];
            particle.position.copy( particle.original );
            particle.previous.copy( particle.original );
        }

    };

    // Flag constructor
    function Flag ( xSegs, ySegs, restDistance ) {

        this.cloth  = new Cloth( xSegs, ySegs, restDistance );
        this.mesh   = null;
        this.object = null;

    }

    // Set flag texture
    Flag.prototype.initTexture = function ( texture ) {

        var uniforms;

        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.anisotropy = 16;

        this.mesh = new THREE.MeshPhongMaterial( {
            alphaTest   : 0.5,
            color       : 0xffffff,
            specular    : 0x030303,
            emissive    : 0x010101,
            shininess   : 0,
            metal       : false,
            map         : texture,
            side        : THREE.DoubleSide
        } );

        /*this.mesh = new THREE.MeshBasicMaterial( {
            color       : 0xff0000,
            wireframe   : true,
            transparent : true,
            opacity     : 0.9
        } );*/

        // Init cloth geometry
        uniforms = {
            texture : { type: "t", value: texture }
        };

        // Init cloth mesh
        this.object = new THREE.Mesh( this.cloth.geometry, this.mesh );
        this.object.castShadow    = true;
        this.object.receiveShadow = true;
        this.object.customDepthMaterial = new THREE.ShaderMaterial( {
            uniforms       : uniforms,
            vertexShader   : vertexShader,
            fragmentShader : fragmentShader
        } );

    };

    // Rotate the flag
    Flag.prototype.setTop = function ( edge ) {};

    // Pin the edge of a flag
    Flag.prototype.pinEdge = function ( dir ) {
        if ( dir === 'right' ) {
            this.object.position.set(
                -this.cloth.width,
                poleOffset - this.cloth.height,
                0
            );
            // Pin right edge
            this.pin( 'right' );
        }
        else {
            this.object.position.set(
                0,
                poleOffset - this.cloth.height,
                0
            );
            // Pin left edge
            this.pin( 'left' );
        }
    };

    // Pin edges of cloth
    Flag.prototype.pin = function ( edge, spacing ) {

        var i, ii;

        spacing = window.parseInt( spacing );
        if ( window.isNaN( spacing ) || spacing < 1 ) spacing = 1;

        if ( edge === 'top' ) {
            for ( i = 0, ii = this.cloth.xSegs; i <= ii; i += spacing ) {
                this.cloth.pins.push( this.cloth.index( i, this.cloth.ySegs ) );
            }
        }
        else if ( edge === 'bottom' ) {
            for ( i = 0, ii = this.cloth.xSegs; i <= ii; i += spacing ) {
                this.cloth.pins.push( this.cloth.index( i, 0 ) );
            }
        }
        else if ( edge === 'right' ) {
            for ( i = 0, ii = this.cloth.ySegs; i <= ii; i += spacing ) {
                this.cloth.pins.push( this.cloth.index( this.cloth.xSegs, i ) );
            }
        }
        else {
            for ( i = 0, ii = this.cloth.ySegs; i <= ii; i += spacing ) {
                this.cloth.pins.push( this.cloth.index( 0, i ) );
            }
        }

    };

    // Remove pins from cloth
    Flag.prototype.unpin = function () { this.cloth.pins = []; };

    //
    // Rendering
    //

    // Renderer settings
    var granularity = 1,
        poleOffset  = 300,
        poleHeight  = 1000;

    // Flag default settings
    var defaultSettings = {
        width    : null,   // w = 15
        height   : 10,     // h = 10
        hoistDir : 'left', // dir = left | right
        hoistTop : 'top',  // top = top | left | bottom | right
        src      : '',     // src = field.png
        reverse  : ''      // reverse = 'field.png'
    };

    // Renderer variables
    var vertexShader, fragmentShader,
        scene, camera, renderer, object,
        cloth, flagObject,
        imageData;

    function init () {

        var light, d,
            poleGeo, poleMat, poleMesh;

        // Get shaders
        vertexShader   = document.getElementById( 'vertexShaderDepth' ).textContent;
        fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

        // Init scene
        scene     = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x000000, 1000, 10000 );
        scene.fog.color.setHSL( 0.6, 0.2, 1 );

        // Init camera
        camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.y = 50;
        camera.position.z = 2000;
        scene.add( camera );

        // Init lights
        scene.add( new THREE.AmbientLight( 0x666666 ) );
        light = new THREE.DirectionalLight( 0xffffff, 1.75 );
        light.color.setHSL( 0.6, 0.125, 1 );
        light.position.set( 50, 175, 100 );
        light.position.multiplyScalar( 1.3 );
        light.castShadow      = true;
        light.shadowMapWidth  = 2048;
        light.shadowMapHeight = 2048;
        d = 300;
        light.shadowCameraLeft   = -d;
        light.shadowCameraRight  = d;
        light.shadowCameraTop    = d;
        light.shadowCameraBottom = -d;
        light.shadowCameraFar    = 1000;
        light.shadowDarkness     = 0.5;
        scene.add( light );
        light = new THREE.DirectionalLight( 0xffffff, 0.35 );
        light.color.setHSL( 0.3, 0.95, 1 );
        light.position.set( 0, -1, 0 );
        scene.add( light );

        // Init flag pole
        poleGeo = new THREE.BoxGeometry( 14, poleHeight, 2 );
        poleMat = new THREE.MeshPhongMaterial( {
            color     : 0x4A4A4A,
            specular  : 0x111111,
            shininess : 0
        } );
        poleMesh = new THREE.Mesh( poleGeo, poleMat );
        poleMesh.position.y    = poleOffset - poleHeight / 2;
        poleMesh.position.x    = -4;
        poleMesh.receiveShadow = true;
        poleMesh.castShadow    = true;
        scene.add( poleMesh );

        // Init renderer object
        renderer = new THREE.WebGLRenderer( { antialias : true, alpha : true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.gammaInput             = true;
        renderer.gammaOutput            = true;
        renderer.shadowMapEnabled       = true;

        // Misc settings
        THREE.ImageUtils.crossOrigin = 'anonymous';

        // Add event handlers
        window.addEventListener( 'resize', onResize );
        onResize();

        // Begin animation
        flagObject = new Flag(); // tmp cloth to init animation
        animate();

    }

    function setFlagImg ( flagSettings ) {

        var imgSrc, testImg;

        // Get image data
        if ( flagSettings ) {
            imageData = flagSettings;
            if ( !flagSettings.hoistDir ) {
                flagSettings.hoistDir = defaultSettings.hoistDir;
            }
        }

        // Get image src
        if ( imageData && imageData.src ) imgSrc = imageData.src;

        // Test load to get image size
        testImg = new window.Image();

        // Get image and create flag texture
        testImg.onload = function () {

            // Defaults
            var imgWidth    = this.width,
                imgHeight   = this.height,
                defaultSize = 10 * granularity,
                xSegs       = 15,
                ySegs       = 10;

            // Get flag size from image
            if ( imgWidth / imgHeight < 1 ) { // vertical flag
                xSegs = defaultSize;
                ySegs = window.Math.round( defaultSize * imgHeight / imgWidth );
            }
            else { // horizontal or square flag
                xSegs = window.Math.round( defaultSize * imgWidth / imgHeight );
                ySegs = defaultSize;
            }

            // Get flag size from user input
            if ( imageData && imageData.w ) xSegs = window.Number( imageData.w );
            if ( imageData && imageData.h ) ySegs = window.Number( imageData.h );

            // Init flag cloth
            flagObject = new Flag(
                xSegs,
                ySegs,
                20 / granularity
            );

            // Set flag texture
            setFlagTex( imgSrc );

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

    function setFlagTex ( imgSrc ) {
        var texture = THREE.ImageUtils.loadTexture(
            imgSrc,
            null,
            function () {
                // texture.generateMipmaps = false;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                setFlagMat( texture );
            },
            function () {
                window.console.log( 'Error: FlagWaver: Failed to load image as texture.' );
                setFlagMat(
                    THREE.ImageUtils.generateDataTexture(
                        4,
                        4,
                        new THREE.Color( 0xffffff )
                    )
                );
            }
        );
    }

    function setFlagMat ( texture ) {

        flagObject.initTexture( texture );
        flagObject.pinEdge();
        flagObject.setTop( 'top' );

        setFlag( flagObject );

    }

    function setFlag ( flag ) {
        scene.remove( object );
        object = flag.object;
        scene.add( object );
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
    }

    function animate () {
        window.requestAnimationFrame( animate );
        var time = window.Date.now();
        // windStrength = window.Math.cos( time / 7000 ) * 100 + 200;
        // windStrength = 100;
        windForce.set(
            window.Math.sin( time / 2000 ),
            window.Math.cos( time / 3000 ),
            window.Math.sin( time / 1000 )
        ).normalize().multiplyScalar( windStrength );
        // windForce.set( 2000, 0, 1000 ).normalize().multiplyScalar( windStrength );
        flagObject.cloth.simulate( time );
        render();
    }

    function render () {
        var timer     = window.Date.now() * 0.0002,
            particles = flagObject.cloth.particles,
            vertices  = flagObject.cloth.geometry.vertices,
            i, il;
        for ( i = 0, il = particles.length; i < il; i++ ) {
            vertices[ i ].copy( particles[ i ].position );
        }
        flagObject.cloth.geometry.computeFaceNormals();
        flagObject.cloth.geometry.computeVertexNormals();
        flagObject.cloth.geometry.normalsNeedUpdate  = true;
        flagObject.cloth.geometry.verticesNeedUpdate = true;
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
    }

    //
    // Export
    //

    window.flagWaver = {
        init       : init,
        setWind    : setWind,
        setFlagImg : setFlagImg,
        get canvas () { return renderer.domElement; },
        getFlagImg : function () { return imageData; }
    };

} )( window, document, THREE );
