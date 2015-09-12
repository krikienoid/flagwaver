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

/*
 * Sep 12 2015
 * Modified by /u/krikienoid
 * for use as flag waving tool
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character - http://web.archive.org/web/20070610223835/http:/www.teknikus.dk/tj/gdc2001.htm
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

//
// Flag sim
//

;(function ( window, document, THREE, undefined ) {

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

    function Cloth ( w, h, restDistance ) {

        w = w || 10;
        h = h || 10;
        restDistance = restDistance || 20;

        var particles   = [],
            constraints = [],
            pins        = [],
            width       = restDistance * w,
            height      = restDistance * h,
            u, v, plane, clothGeometry;

        // Index
        function index ( u, v ) {
            return u + v * ( w + 1 );
        }

        // Cloth plane
        plane = function plane ( u, v ) {
            var x = u * width, //(u-0.5)
                y = v * height,
                z = 0;
            return new THREE.Vector3( x, y, z );
        };

        // Cloth geometry
        clothGeometry = new THREE.ParametricGeometry( plane, w, h, true );
        clothGeometry.dynamic = true;
        clothGeometry.computeFaceNormals();

        // Create particles
        for ( v = 0; v <= h ; v++ ) {
            for (u = 0; u <= w; u++ ) {
                particles.push(
                    new Particle (
                        u / w,
                        v / h,
                        0,
                        plane,
                        MASS
                    )
                );
            }
        }

        // Structural

        for ( v = 0; v < h; v++ ) {
            for ( u = 0; u < w; u++ ) {

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

        for ( u = w, v = 0; v < h; v++ ) {
            constraints.push( [
                particles[ index( u, v  ) ],
                particles[ index( u, v + 1 ) ],
                restDistance

            ] );
        }

        for ( v = h, u = 0; u < w; u++ ) {
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

        for ( v = 0; v < h; v++ ) {
            for ( u = 0; u < w; u++ ) {

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

        // // Bend

        // var wlen = restDistance * 2;
        // var hlen = restDistance * 2;
        // diagonalDist = window.Math.sqrt(wlen * wlen + hlen * hlen);

        // for (v=0;v<h-1;v++) {
        // 	for (u=0;u<w-1;u++) {
        // 		constraints.push([
        // 			particles[index(u, v)],
        // 			particles[index(u+2, v)],
        // 			wlen
        // 		]);

        // 		constraints.push([
        // 			particles[index(u, v)],
        // 			particles[index(u, v+2)],
        // 			hlen
        // 		]);

        // 		constraints.push([
        // 			particles[index(u, v)],
        // 			particles[index(u+2, v+2)],
        // 			diagonalDist
        // 		]);

        // 		constraints.push([
        // 			particles[index(u, v+2)],
        // 			particles[index(u+2, v+2)],
        // 			wlen
        // 		]);

        // 		constraints.push([
        // 			particles[index(u+2, v+2)],
        // 			particles[index(u+2, v+2)],
        // 			hlen
        // 		]);

        // 		constraints.push([
        // 			particles[index(u+2, v)],
        // 			particles[index(u, v+2)],
        // 			diagonalDist
        // 		]);

        // 	}
        // }

        // Pins
        for ( var j = 0; j <= h; j++ ) {
            pins.push( index( 0, j ) );
        }

        // Public attributes
        this.w            = w;
        this.h            = h;
        this.width        = width;
        this.height       = height;
        this.restDistance = restDistance;
        this.index        = index;
        this.plane        = plane;
        this.geometry     = clothGeometry;
        this.particles    = particles;
        this.constraints  = constraints;
        this.pins         = pins;

    }

    //
    // Simulation functions
    //

    // Sim variables
    var gravity  = new THREE.Vector3( 0, -GRAVITY, 0 ).multiplyScalar( MASS ),
        tmpForce = new THREE.Vector3(),
        diff     = new THREE.Vector3(),
        lastTime;

    function satisfyConstraints ( p1, p2, distance ) {
        diff.sub( p2.position, p1.position );
        var currentDist = diff.length();
        if ( currentDist === 0 ) return; // prevents division by 0
        var correction = diff.multiplyScalar(1 - distance/currentDist);
        var correctionHalf = correction.multiplyScalar(0.5);
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

        // TIMESTEP = (time - lastTime);
        // TIMESTEP = (TIMESTEP > 30) ? TIMESTEP / 1000 : 30 / 1000;
        // TIMESTEP_SQ = TIMESTEP * TIMESTEP;
        // lastTime = time;
        // console.log(TIMESTEP);

        var i, il, particles, particle, pt, constraints, constraint;

        // Aerodynamics forces
        if ( wind ) {
            var face,
                faces = cloth.geometry.faces,
                normal;

            particles = cloth.particles;

            for ( i = 0, il = faces.length; i < il; i++ ) {
                face   = faces[i];
                normal = face.normal;

                tmpForce.copy( normal ).normalize().multiplyScalar( normal.dot( windForce ) );
                particles[ face.a ].addForce( tmpForce );
                particles[ face.b ].addForce( tmpForce );
                particles[ face.c ].addForce( tmpForce );
            }
        }

        for (
            particles = cloth.particles, i = 0, il = particles.length;
            i < il;
            i++
        )
        {
            particle = particles[ i ];
            particle.addForce( gravity );
            //
            // var x = particle.position.x, y = particle.position.y, z = particle.position.z, t=window.Date.now() / 1000;
            // windForce.set(window.Math.sin(x*y*t), window.Math.cos(z*t), window.Math.sin(window.Math.cos(5*x*y*z))).multiplyScalar(100);
            // particle.addForce(windForce);
            particle.integrate( TIMESTEP_SQ );
        }

        // Start Constraints
        constraints = cloth.constraints;
        for ( i = 0, il = constraints.length; i < il; i++ ) {
            constraint = constraints[ i ];
            satisfyConstraints( constraint[0], constraint[1], constraint[2] );
        }

        // Ball Constraints
        ballPosition.z = -window.Math.sin( window.Date.now() / 300 ) * 90 ; //+ 40;
        ballPosition.x = window.Math.cos( window.Date.now() / 200 ) * 70

        // if (sphere.visible)
        // for (particles = cloth.particles, i=0, il = particles.length
        // 		;i<il;i++) {
        // 	particle = particles[i];
        // 	pos = particle.position;
        // 	diff.sub(pos, ballPosition);
        // 	if (diff.length() < ballSize) {
        // 		// collided
        // 		diff.normalize().multiplyScalar(ballSize);
        // 		pos.copy(ballPosition).addSelf(diff);
        // 	}
        // }
        //
        // // Pin Constraints

        for ( i = 0, il = cloth.pins.length; i < il; i++ ) {
            var xy = cloth.pins[ i ];
            var p  = particles[ xy ];
            p.position.copy( p.original );
            p.previous.copy( p.original );
        }

    }

    //
    // Render functions
    //

    var scene, camera, renderer, object,
        container, canvas, vertexShader, fragmentShader,
        imageData;

    function init (containerElem) {

        // get dom elements
        container      = containerElem;
        vertexShader   = document.getElementById( 'vertexShaderDepth' ).textContent;
        fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

        // init scene
        scene     = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x000000, 1000, 10000 );
        scene.fog.color.setHSV( 0.6, 0.2, 1 );

        // init camera
        camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.y = 50;
        camera.position.z = 2000;
        scene.add( camera );

        // init lights
        var light,
            d = 300;
        scene.add( new THREE.AmbientLight( 0x666666 ) );
        light = new THREE.DirectionalLight( 0xffffff, 1.75 );
        light.color.setHSV( 0.6, 0.125, 1 );
        light.position.set( 50, 200, 100 );
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

        // init flag pole
        var poleGeo = new THREE.CubeGeometry( 14, 1000, 2 ),
            poleMat = new THREE.MeshPhongMaterial( {
                color    : 0x4A4A4A,
                specular : 0x111111,
                shiness  : 0,
                perPixel : true
            } ),
            mesh = new THREE.Mesh( poleGeo, poleMat );
        mesh.position.y    = -200;
        mesh.position.x    = -4;
        mesh.receiveShadow = true;
        mesh.castShadow    = true;
        scene.add( mesh );

        // init renderer object
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.physicallyBasedShading = true;
        renderer.shadowMapEnabled = true;

        // init flag
        setFlagImg();

        // append renderer to dom
        canvas = renderer.domElement;
        container.appendChild( canvas );

        // execute
        window.addEventListener( 'resize', onResize );
        animate();
        onResize();

    }

    function setFlagImg ( imageDataVal ) {

        var xSegs = 15,
            ySegs = 10;

        imageData = imageDataVal;
        if ( imageData ) {
            if ( imageData.w ) xSegs = window.Number( imageData.w );
            if ( imageData.h ) ySegs = window.Number( imageData.h );
        }

        cloth = new Cloth( xSegs, ySegs );

        // init cloth texture
        var flagMaterial, clothTexture;
        if (imageData !== undefined){
            clothTexture = THREE.ImageUtils.loadTexture( imageData.src );
        }
        else {
            clothTexture = THREE.ImageUtils.loadTexture( 'img/NZ.2b.png' );
        }
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

        // init cloth geometry
        var uniforms = { texture:  { type: "t", value: 0, texture: clothTexture } };

        // init cloth mesh
        scene.remove( object );
        object = new THREE.Mesh( cloth.geometry, flagMaterial );
        object.position.set(
            0,
            (cloth.restDistance * 10 - cloth.height) + 100,
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

    function onResize () {
        var h;
        if (renderer.domElement.parentElement) {
            h = renderer.domElement.parentElement.clientHeight;
        }
        else {
            h = 1;
        }
        camera.aspect = window.innerWidth / h;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, h);
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
        // windForce.set(2000, 0, 1000).normalize().multiplyScalar(windStrength);
        simulate(time);
        render();
    }

    function setWind (value) {
        if(!window.isNaN(value)) windStrength = value;
        else windStrength = 0;
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
        getImageData : function () {return imageData;}
    };

}( window, document, THREE ));

//
// Quick links!
//

;(function ( window, document, $, undefined ) {

    var $setLink = $( '#set-link' ),
        $getLink = $( '#get-link' );

    function setLink ( imgSrc, w, h ) {
        window.flagWaver.setFlagImg( { src : imgSrc, w : w, h : h } );
    }

    // Auto load flag image from hash data url
    $( window.document ).ready( function getDataFromURL () {
        var hashData = window.location.href.split( '#' ),
            imgSrc;
        if ( hashData && hashData.length ) {
            imgSrc = window.unescape( hashData[ 1 ] );
            setLink(
                imgSrc,
                hashData[ 2 ],
                hashData[ 3 ]
            );
            $setLink.val( imgSrc );
        }
    } );

    // Generate hashed url for loaded flag image
    $getLink.on( 'click', function getLink () {
        if ( $setLink.val().length ) {
            var imageData = window.flagWaver.getImageData(),
                w = (imageData.w)? imageData.w : 0,
                h = (imageData.h)? imageData.h : 0;
            window.prompt(
                'Your link:',
                window.location.href.split('#')[0] + '#' +
                window.escape( $setLink.val() ) + '#' +
                ((w && h)? window.escape( w ) + '#' : '') +
                ((h && h)? window.escape( h ) + '#' : '')
            );
        }
        else {
            window.alert( 'Input field is empty!' );
        }
    } );

    // Load flag image from user given url
    $setLink.on( 'change', function () {
        setLink( $setLink.val() );
    } );

}( window, document, jQuery ));
