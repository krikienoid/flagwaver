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

;(function ( window, document, THREE, undefined ) {

    //
    // Global Settings
    //

    // Physics Settings
    var DAMPING = 0.03,
        DRAG    = 1 - DAMPING,
        MASS    = .1,
        GRAVITY = 981 * 1.4;

    // Time Settings
    var TIMESTEP    = 18 / 1000,
        TIMESTEP_SQ = TIMESTEP * TIMESTEP;

    // Wind Settings
    var wind         = true,
        windStrength = 300,
        windForce    = new THREE.Vector3( 0, 0, 0 );

    // Ball Settings
    var ballPosition = new THREE.Vector3( 0, -45, 0 ),
        ballSize     = 60; //40

    // Simulation variables
    var gravityForce = new THREE.Vector3( 0, -GRAVITY, 0 ).multiplyScalar( MASS ),
        tmpForce     = new THREE.Vector3(),
        diff         = new THREE.Vector3(),
        lastTime;

    // Objects
    var cloth;

    //
    // Classes
    //

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
        this.a.addSelf(
            this.tmp2.copy( force ).multiplyScalar( this.invMass )
        );
    };

    // Performs verlet integration
    Particle.prototype.integrate = function ( timesq ) {

        var newPos = this.tmp.sub( this.position, this.previous );
        newPos.multiplyScalar( DRAG ).addSelf( this.position );
        newPos.addSelf( this.a.multiplyScalar( timesq ) );

        this.tmp      = this.previous;
        this.previous = this.position;
        this.position = newPos;

        this.a.set( 0, 0, 0 );

    }

    function Cloth ( xSegs, ySegs, restDistance ) {

        var particles   = [],
            constraints = [],
            pins        = [],
            plane, geometry,
            width, height,
            u, v;

        xSegs        = Math.round(xSegs) || 15;
        ySegs        = Math.round(ySegs) || 10;
        restDistance = Math.round(restDistance) || 20;
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
            for (u = 0; u <= xSegs; u++ ) {
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

        // Pins
        for ( var j = 0; j <= ySegs; j++ ) {
            pins.push( index( 0, j ) );
        }

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

    // Simulate Cloth
    Cloth.prototype.simulate = function ( time ) {

        var particles   = this.particles,
            constraints = this.constraints,
            i, il, particle, pt, constraint,
            face, faces, normal;

        // TIMESTEP    = ( time - lastTime );
        // TIMESTEP    = ( TIMESTEP > 30 ) ? TIMESTEP / 1000 : 30 / 1000;
        // TIMESTEP_SQ = TIMESTEP * TIMESTEP;
        // lastTime    = time;
        // console.log( TIMESTEP );

        // Aerodynamic forces
        if ( wind ) {
            faces = this.geometry.faces;
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

        // Start Constraints
        for ( i = 0, il = constraints.length; i < il; i++ ) {
            constraint = constraints[ i ];
            satisfyConstraints( constraint[ 0 ], constraint[ 1 ], constraint[ 2 ] );
        }

        // Ball Constraints
        ballPosition.z = -window.Math.sin( window.Date.now() / 300 ) * 90 ; //+ 40;
        ballPosition.x = window.Math.cos( window.Date.now() / 200 ) * 70

        // if ( sphere.visible ) { 
        //     for ( i = 0, il = particles.length; i < il; i++ ) {
        //     	   particle = particles[ i ];
        //     	   pos = particle.position;
        //     	   diff.sub( pos, ballPosition );
        //     	   if ( diff.length() < ballSize ) {
        //     	   	   // collided
        //     	   	   diff.normalize().multiplyScalar( ballSize );
        //     	   	   pos.copy( ballPosition ).addSelf( diff );
        //     	   }
        //     }
        // }

        // Pin Constraints
        for ( i = 0, il = this.pins.length; i < il; i++ ) {
            var xy = this.pins[ i ];
            var p  = particles[ xy ];
            p.position.copy( p.original );
            p.previous.copy( p.original );
        }

    };

    //
    // Simulation Functions
    //

    function satisfyConstraints ( p1, p2, distance ) {

        var currentDist,
            correction,
            correctionHalf;

        diff.sub( p2.position, p1.position );
        currentDist = diff.length();
        if ( currentDist === 0 ) return; // prevents division by 0
        correction = diff.multiplyScalar( 1 - distance / currentDist );
        correctionHalf = correction.multiplyScalar(0.5);
        p1.position.addSelf( correctionHalf );
        p2.position.subSelf( correctionHalf );

        // float difference = (restingDistance - d) / d
        // im1 = 1 / p1.mass // inverse mass quantities
        // im2 = 1 / p2.mass
        // p1.position += delta * (im1 / (im1 + im2)) * stiffness * difference

    }

    function simulate ( time ) {

        if ( !lastTime ) {
            lastTime = time;
            return;
        }

        cloth.simulate( time );

    }

    //
    // Render Functions
    //

    var container, canvas, vertexShader, fragmentShader,
        scene, camera, renderer,
        object, imageData;

    var GRANULARITY = 1;

    function init ( containerElem ) {

        // Get DOM elements
        container      = containerElem;
        vertexShader   = document.getElementById( 'vertexShaderDepth' ).textContent;
        fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

        // Init scene
        scene     = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x000000, 1000, 10000 );
        scene.fog.color.setHSV( 0.6, 0.2, 1 );

        // Init camera
        camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.y = 50;
        camera.position.z = 2000;
        scene.add( camera );

        // Init lights
        var light, d = 300;
        scene.add( new THREE.AmbientLight( 0x666666 ) );
        light = new THREE.DirectionalLight( 0xffffff, 1.75 );
        light.color.setHSV( 0.6, 0.125, 1 );
        light.position.set( 50, 175, 100 );
        light.position.multiplyScalar( 1.3 );
        light.castShadow      = true;
        light.shadowMapWidth  = 2048;
        light.shadowMapHeight = 2048;
        light.shadowCameraLeft   = -d;
        light.shadowCameraRight  = d;
        light.shadowCameraTop    = d;
        light.shadowCameraBottom = -d;
        light.shadowCameraFar    = 1000;
        light.shadowDarkness     = 0.5;
        scene.add( light );
        light = new THREE.DirectionalLight( 0xffffff, 0.35 );
        light.color.setHSV( 0.3, 0.95, 1 );
        light.position.set( 0, -1, 0 );
        scene.add( light );

        // Init flag pole
        var poleGeo = new THREE.CubeGeometry( 14, 750, 2 ),
            poleMat = new THREE.MeshPhongMaterial( {
                color    : 0x4A4A4A,
                specular : 0x111111,
                shiness  : 0,
                perPixel : true
            } ),
            mesh = new THREE.Mesh( poleGeo, poleMat );
        mesh.position.y    = -175;
        mesh.position.x    = -4;
        mesh.receiveShadow = true;
        mesh.castShadow    = true;
        scene.add( mesh );

        // Init renderer object
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.physicallyBasedShading = true;
        renderer.shadowMapEnabled = true;

        // Init flag
        setFlagImg();

        // Append renderer to dom
        canvas = renderer.domElement;
        container.appendChild( canvas );

        // Begin animation
        window.addEventListener( 'resize', onResize );
        animate();
        onResize();

    }

    function setFlagImg ( imageDataVal ) {

        var DEFAULT      = 10 * GRANULARITY,
            xSegs        = 15,
            ySegs        = 10,
            imgSrc       = 'img/NZ.2b.png',
            imgWidth     = 15,
            imgHeight    = 10;

        // Get image data
        if ( imageDataVal ) imageData = imageDataVal;

        // Get image src
        if ( imageData && imageData.src ) imgSrc = imageData.src;

        // Load image file
        testImg = new Image();
        testImg.onload = function () {

            // Get flag size from file
            imgWidth  = this.width;
            imgHeight = this.height;
            if ( imgWidth / imgHeight < 1 ) { // vertical flag
                xSegs = DEFAULT;
                ySegs = window.Math.round( DEFAULT * imgHeight / imgWidth );
            }
            else { // horizontal or square flag
                xSegs = window.Math.round( DEFAULT * imgWidth / imgHeight );
                ySegs = DEFAULT;
            }

            // Get flag size from user input
            if ( imageData && imageData.w ) xSegs = window.Number( imageData.w );
            if ( imageData && imageData.h ) ySegs = window.Number( imageData.h );

            // Init flag cloth
            cloth = new Cloth(
                xSegs,
                ySegs,
                20 / GRANULARITY
            );
            setFlag( imgSrc );

        };
        testImg.src = imgSrc;

    }

    function setFlag ( imgSrc ) {

        var clothTexture, flagMaterial;

        // Init cloth texture
        clothTexture = THREE.ImageUtils.loadTexture( imgSrc );
        //clothTexture.image.crossOrigin = 'anonymous';
        clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
        clothTexture.anisotropy = 16;

        flagMaterial = new THREE.MeshPhongMaterial( {
            alphaTest   : 0.5,
            ambient     : 0xffffff,
            color       : 0xffffff,
            specular    : 0x030303,
            emissive    : 0x111111,
            shiness     : 10,
            perPixel    : true,
            metal       : false,
            map         : clothTexture,
            doubleSided : true
        } );
        /*flagMaterial = new THREE.MeshBasicMaterial( {
            color       : 0xff0000,
            wireframe   : true,
            transparent : true,
            opacity     : 0.9
        } );*/

        // Init cloth geometry
        var uniforms = {
            texture : { type: "t", value: 0, texture: clothTexture }
        };

        // Init cloth mesh
        scene.remove( object );
        object = new THREE.Mesh( cloth.geometry, flagMaterial );
        object.position.set(
            0,
            ( cloth.restDistance * GRANULARITY - cloth.height ) + 0,
            0
        );
        object.castShadow    = true;
        object.receiveShadow = true;
        object.customDepthMaterial = new THREE.ShaderMaterial( {
            uniforms       : uniforms,
            vertexShader   : vertexShader,
            fragmentShader : fragmentShader
        } );
        scene.add( object );

    }

    function setWind ( value ) {
        if ( !window.isNaN( value ) ) windStrength = value;
        else windStrength = 0;
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
        requestAnimationFrame( animate );
        var time = window.Date.now();
        // windStrength = window.Math.cos( time / 7000 ) * 100 + 200;
        // windStrength = 100;
        windForce.set(
            window.Math.sin( time / 2000 ),
            window.Math.cos( time / 3000 ),
            window.Math.sin( time / 1000 )
        ).normalize().multiplyScalar( windStrength );
        // windForce.set( 2000, 0, 1000 ).normalize().multiplyScalar( windStrength );
        simulate( time );
        render();
    }

    function render () {
        var timer = window.Date.now() * 0.0002,
            p     = cloth.particles;
        for ( var i = 0, il = p.length; i < il; i ++ ) {
            cloth.geometry.vertices[ i ].copy( p[ i ].position );
        }
        cloth.geometry.computeFaceNormals();
        cloth.geometry.computeVertexNormals();
        cloth.geometry.normalsNeedUpdate  = true;
        cloth.geometry.verticesNeedUpdate = true;
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
        container  : container,
        canvas     : canvas,
        getFlagImg : function () {return imageData;}
    };

}( window, document, THREE ));
