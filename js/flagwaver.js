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

    // Enable debug mode
    var isDebugMode = false;

    // Physics settings
    var DAMPING = 0.03,
        DRAG    = 1 - DAMPING,
        SLACK   = 1.2,
        MASS    = 0.1,
        GRAVITY = 981 * 1.4;

    // Time settings
    var FPS        = 60,
        TIMESTEP   = 1 / FPS,
        timestep   = TIMESTEP,
        timestepSq = timestep * timestep,
        time,
        timePrev;

    // Wind settings
    var wind         = true,
        windStrength = 200,
        windForce    = new THREE.Vector3( 0, 0, 0 );

    // Ball settings
    var ballPosition = new THREE.Vector3( 0, -45, 0 ),
        ballSize     = 60; //40

    //
    // Simulation classes
    //

    // Cloth simulation variables
    var gravityForce = new THREE.Vector3( 0, -GRAVITY, 0 ),
        tmpForce     = new THREE.Vector3(),
        diff         = new THREE.Vector3();

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
    Particle.prototype.integrate = function ( timestepSq ) {

        var newPos = this.tmp.subVectors( this.position, this.previous );
        newPos.multiplyScalar( DRAG ).add( this.position );
        newPos.add( this.accel.multiplyScalar( timestepSq ) );

        this.tmp      = this.previous;
        this.previous = this.position;
        this.position = newPos;

        this.accel.set( 0, 0, 0 );

    };

    // Constraint constructor
    function Constraint ( p1, p2, restDistance ) {
        this.p1 = p1;
        this.p2 = p2;
        this.restDistance = restDistance;
    }

    // Satisfy constraint
    Constraint.prototype.satisfy = function () {

        var p1 = this.p1,
            p2 = this.p2,
            distance = this.restDistance,
            currentDist,
            correction,
            correctionHalf;

        diff.subVectors( p2.position, p1.position );
        currentDist = diff.length();
        if ( currentDist === 0 ) return; // prevents division by 0
        correction = diff.multiplyScalar( 1 - distance / currentDist );
        correctionHalf = correction.multiplyScalar( 0.5 );
        p1.position.add( correctionHalf );
        p2.position.sub( correctionHalf );

    };

    // Satisfy constraint unidirectionally
    Constraint.prototype.satisfyFixed = function () {

        var p1 = this.p1,
            p2 = this.p2,
            distance = this.restDistance,
            currentDist,
            correction;

        diff.subVectors( p1.position, p2.position );
        currentDist = diff.length() / SLACK;
        diff.normalize();
        correction = diff.multiplyScalar( currentDist - distance );
        if ( currentDist > distance ) {
            p2.position.add( correction );
        }

    };

    // Cloth constructor
    function Cloth ( xSegs, ySegs, restDistance, mass ) {

        var particles   = [],
            constraints = [],
            index,
            plane,
            geometry,
            weightForce,
            width, height,
            u, v;

        // Cloth properties
        width       = restDistance * xSegs;
        height      = restDistance * ySegs;
        weightForce = new THREE.Vector3();
        weightForce.copy( gravityForce ).multiplyScalar( mass );

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
                    new Particle( plane( u / xSegs, v / ySegs ), mass )
                );
            }
        }

        // Structural constraints

        for ( v = 0; v < ySegs; v++ ) {
            for ( u = 0; u < xSegs; u++ ) {

                constraints.push( new Constraint(
                    particles[ index( u, v ) ],
                    particles[ index( u, v + 1 ) ],
                    restDistance
                ) );

                constraints.push( new Constraint(
                    particles[ index( u, v ) ],
                    particles[ index( u + 1, v ) ],
                    restDistance
                ) );

            }
        }

        for ( u = xSegs, v = 0; v < ySegs; v++ ) {
            constraints.push( new Constraint(
                particles[ index( u, v ) ],
                particles[ index( u, v + 1 ) ],
                restDistance
            ) );
        }

        for ( v = ySegs, u = 0; u < xSegs; u++ ) {
            constraints.push( new Constraint(
                particles[ index( u, v ) ],
                particles[ index( u + 1, v ) ],
                restDistance
            ) );
        }

        // While many systems use shear and bend springs,
        // the relax constraints model seems to be just fine
        // using structural springs.

        // Shear
        var diagonalDist = window.Math.sqrt( restDistance * restDistance * 2 );

        for ( v = 0; v < ySegs; v++ ) {
            for ( u = 0; u < xSegs; u++ ) {

                constraints.push( new Constraint(
                    particles[ index( u, v ) ],
                    particles[ index( u + 1, v + 1 ) ],
                    diagonalDist
                ) );

                constraints.push( new Constraint(
                    particles[ index( u + 1, v ) ],
                    particles[ index( u, v + 1 ) ],
                    diagonalDist
                ) );

            }
        }

        // Bend

        // var wlen = restDistance * 2,
        //     hlen = restDistance * 2;

        // diagonalDist = window.Math.sqrt( wlen * wlen + hlen * hlen );

        // for ( v = 0; v < ySegs - 1; v++ ) {
        //     for ( u = 0; u < xSegs - 1; u++ ) {

        //         constraints.push( new Constraint(
        //             particles[ index( u, v ) ],
        //             particles[ index( u + 2, v ) ],
        //             wlen
        //         ) );

        //         constraints.push( new Constraint(
        //             particles[ index( u, v ) ],
        //             particles[ index( u, v + 2 ) ],
        //             hlen
        //         ) );

        //         constraints.push( new Constraint(
        //             particles[ index( u, v ) ],
        //             particles[ index( u + 2, v + 2 ) ],
        //             diagonalDist
        //         ) );

        //         constraints.push( new Constraint(
        //             particles[ index( u, v + 2 ) ],
        //             particles[ index( u + 2, v + 2 ) ],
        //             wlen
        //         ) );

        //         constraints.push( new Constraint(
        //             particles[ index( u + 2, v + 2 ) ],
        //             particles[ index( u + 2, v + 2 ) ],
        //             hlen
        //         ) );

        //         constraints.push( new Constraint(
        //             particles[ index( u + 2,  v ) ],
        //             particles[ index( u , v + 2 ) ],
        //             diagonalDist
        //         ) );

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

        var particles   = this.particles,
            constraints = this.constraints,
            faces       = this.geometry.faces,
            weightForce = this.weightForce,
            particle, constraint,
            face, normal,
            i, il;

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
            particle.addForce( weightForce );

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
            particle.integrate( timestepSq );
        }

        // Satisfy constraints
        for ( i = 0, il = constraints.length; i < il; i++ ) {
            constraints[ i ].satisfy();
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

    // Default flag options
    var defaultOptions = {
        width         : 300,
        height        : 200,
        mass          : MASS,
        levelOfDetail : 10
    };

    // Default flag texture
    var blankTexture = THREE.ImageUtils.generateDataTexture(
        4,
        4,
        new THREE.Color( 0xffffff )
    );

    // Utilties
    var Util = {};

    // Is valid number
    Util.isNumeric = function ( n ) {
        return !window.isNaN( window.parseFloat( n ) ) && window.isFinite( n );
    };

    // Copy object properties
    Util.extend = function () {
        var target = arguments[ 0 ],
            options,
            i, il;
        if ( typeof target !== 'object' ) { target = {}; }
        for ( i = 1, il = arguments.length; i < il; i++ ) {
            options = arguments[ i ];
            if ( typeof options === 'object' ) {
                for ( var k in options ) {
                    if (
                        options.hasOwnProperty( k ) &&
                        typeof options[ k ] !== 'undefined'
                    ) { target[ k ] = options[ k ]; }
                }
            }
        }
        return target;
    };

    // Load image
    function loadImg ( imgSrc, callback ) {

        // Create new image element
        var img = new window.Image();

        // Allow loading of CORS enabled images
        img.crossOrigin = 'anonymous';

        // If image is loaded successfully
        img.onload = function () {
            img.onload = null;
            img.onerror = null;
            if ( typeof callback === 'function' ) { callback( img ); }
        };

        // If image fails to load
        img.onerror = function () {
            window.console.log(
                'Error: FlagWaver: Failed to load image from ' + imgSrc + '.'
            );
            if ( typeof callback === 'function' ) { callback( null ); }
        };

        // Attempt to load image
        img.src = imgSrc;

    }

    // Use canvas to generate texture from image
    function createTextureFromImg ( img, transform ) {

        var canvas      = document.createElement( 'canvas' ),
            ctx         = canvas.getContext( '2d' ),
            defaultSize = defaultOptions.height,
            srcWidth    = img.width,
            srcHeight   = img.height,
            destWidth   = canvas.width  = defaultSize * srcWidth / srcHeight,
            destHeight  = canvas.height = defaultSize;

        if ( typeof transform === 'object' ) {

            // Swap X axis with Y axis
            if ( transform.swapXY ) {
                canvas.width  = destHeight;
                canvas.height = destWidth;
            }

            // Reflect
            if ( transform.reflect ) {
                ctx.translate( canvas.width, 0 );
                ctx.scale( -1, 1 );
            }

            // Rotate
            if ( Util.isNumeric( transform.rotate ) ) {
                ctx.translate( canvas.width / 2, canvas.height / 2 );
                ctx.rotate( transform.rotate );
                ctx.translate( -canvas.width / 2, -canvas.height / 2 );
            }

            // Translate
            if ( Util.isNumeric( transform.translateX ) ) {
                ctx.translate( transform.translateX, 0 );
            }
            if ( Util.isNumeric( transform.translateY ) ) {
                ctx.translate( 0, transform.translateY );
            }

        }

        if ( isDebugMode ) {
            window.console.log(
                'FlagWaver: Image properties' +
                '\n\t' + 'Image size: ' + srcWidth + 'x' + srcHeight +
                '\n\t' + 'Canvas size: ' + window.Math.round( destWidth ) +
                    'x' + window.Math.round( destHeight ) +
                '\n\t' + 'Aspect ratio: ' +
                    window.Number( ( srcWidth / srcHeight ).toFixed( 4 ) )
            );
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect( 0, 0, canvas.width, canvas.height );
        }

        ctx.drawImage(
            img, 0, 0, srcWidth, srcHeight, 0, 0, destWidth, destHeight
        );

        return new THREE.Texture( canvas );

    }

    // Flag constructor
    function Flag ( options ) {

        this.position  = new THREE.Vector3( 0, 0, 0 );
        this.offset    = new THREE.Vector3( 0, 0, 0 );

        this.hoisting  = HOISTING.Dexter;
        this.topEdge   = EDGE.Top;
        this.img       = null;

        this.options   = Util.extend( {}, defaultOptions );
        this.transform = {};
        this.pins      = [];

        this.createCloth( options );
        this.pin();

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

    }

    // Check if flag has been rotated into a vertical position
    Flag.prototype.isVertical = function () {
        return this.topEdge === EDGE.Left || this.topEdge === EDGE.Right;
    };

    // Add fixed constraints to flag cloth
    Flag.prototype.constrainCloth = function () {

        var xSegs            = this.cloth.xSegs,
            ySegs            = this.cloth.ySegs,
            restDistance     = this.cloth.restDistance * SLACK,
            particles        = this.cloth.particles,
            index            = this.cloth.index,
            fixedConstraints = [],
            u, v;

        for ( v = 0; v <= ySegs; v++ ) {
            for ( u = 0; u < xSegs; u++ ) {
                fixedConstraints.push( new Constraint(
                    particles[ index( u, v ) ],
                    particles[ index( u + 1, v ) ],
                    restDistance
                ) );
            }
        }

        this.fixedConstraints = fixedConstraints;

    }

    // Init new cloth object
    Flag.prototype.createCloth = function ( options ) {

        var restDistance;

        if ( !options ) { options = this.options; }
        restDistance = options.height / options.levelOfDetail;

        this.cloth = new Cloth(
            window.Math.round( options.width / restDistance ),
            window.Math.round( options.height / restDistance ),
            restDistance,
            options.mass
        );

        this.constrainCloth();

    };

    // Pin edges of flag cloth
    Flag.prototype.pin = function ( edge, spacing ) {

        var pins  = this.pins,
            xSegs = this.cloth.xSegs,
            ySegs = this.cloth.ySegs,
            index = this.cloth.index,
            i;

        spacing = window.parseInt( spacing );
        if ( !Util.isNumeric( spacing ) || spacing < 1 ) { spacing = 1; }

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

    // Recalculate offset position when flag cloth is rotated
    Flag.prototype.updatePosition = function () {
        this.object.position.set(
            this.position.x,
            this.position.y - this.cloth.height,
            0
        );
    };

    // Set the flag's position
    Flag.prototype.setPosition = function ( x, y, z ) {
        this.position.set( x, y, z );
        this.updatePosition();
    };

    // Apply options and create new cloth object
    Flag.prototype.setOptions = function ( options ) {

        options = Util.extend( this.options, options );

        if ( this.isVertical() ) {
            options = Util.extend( {}, options, {
                width  : this.options.height,
                height : this.options.width
            } );
        }

        this.createCloth( options );

        this.object.geometry.dispose();
        this.object.geometry = this.cloth.geometry;

        this.unpin();
        this.pin();

        this.updatePosition();

    };

    // Set flag texture
    Flag.prototype.setTexture = function ( texture ) {

        if ( !( texture instanceof THREE.Texture ) ) {
            window.console.log(
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

        /*material = new THREE.MeshBasicMaterial( {
            color       : 0xff0000,
            wireframe   : true,
            transparent : true,
            opacity     : 0.9
        } );*/

        if ( this.object.material.map ) { this.object.material.map.dispose(); }

        this.object.material.map = texture;
        this.object.material.needsUpdate = true;
        this.object.customDepthMaterial.uniforms.texture.value = texture;
        this.object.customDepthMaterial.needsUpdate = true;

    };

    // Apply transforms to flag texture
    Flag.prototype.transformTexture = function ( transform ) {
        if ( this.img ) {
            this.setTexture( createTextureFromImg( this.img, transform ) );
        }
    };

    // Recalculate texture transform based on image dimsensions and rotation
    Flag.prototype.updateTransform = function () {

        var transform = this.transform,
            canvas,
            offset;

        if ( !this.img || !this.material.map ) { return; }

        transform.rotate = this.topEdge.direction;

        if ( this.isVertical() ) {
            canvas = this.material.map.image;
            offset = ( canvas.width - canvas.height ) / 2;
            if ( transform.swapXY ) { offset *= -1; }
            transform.translateX = -offset;
            transform.translateY = offset;
            transform.swapXY     = true;
        }
        else {
            transform.translateX = 0;
            transform.translateY = 0;
            transform.swapXY     = false;
        }

        this.transformTexture( transform );

    };

    // Load new image as flag texture
    Flag.prototype.loadTexture = function ( imgSrc, callback ) {

        var onTextureLoaded = function ( img ) {
            if ( img ) {
                this.img = img;
                this.setTexture( createTextureFromImg( img, this.transform ) );
                this.updateTransform();
            }
            else {
                this.setTexture( blankTexture );
            }
            if ( typeof callback === 'function' ) { callback( img ); }
        };

        loadImg( imgSrc, onTextureLoaded.bind( this ) );

    };

    // Set the hoisting to dexter or sinister
    Flag.prototype.setHoisting = function ( hoisting ) {
        if ( hoisting !== HOISTING.Sinister ) { hoisting = HOISTING.Dexter; }
        this.hoisting = hoisting;
        this.transform.reflect = hoisting === HOISTING.Sinister;
        this.transformTexture( this.transform );
    };

    // Rotate the flag
    Flag.prototype.setTopEdge = function ( edge ) {

        var wasVertical = this.isVertical();

        switch ( edge ) {
            case 'left'   : this.topEdge = EDGE.Left;   break;
            case 'bottom' : this.topEdge = EDGE.Bottom; break;
            case 'right'  : this.topEdge = EDGE.Right;  break;
            case 'top'    :
            default       : this.topEdge = EDGE.Top;    break;
        }

        if ( wasVertical !== this.isVertical() ) { this.setOptions(); }

        this.updateTransform();

    };

    // Reset flag to initial state
    Flag.prototype.reset = function () {

        var particles  = this.cloth.particles,
            i, il;

        for ( i = 0, il = particles.length; i < il; i++ ) {
            particles[ i ].position.copy( particles[ i ].original );
        }

    };

    // Simulate flag cloth
    Flag.prototype.simulate = function () {

        var pins             = this.pins,
            particles        = this.cloth.particles,
            fixedConstraints = this.fixedConstraints,
            particle,
            i, il;

        this.cloth.simulate();

        // Pin constraints
        for ( i = 0, il = pins.length; i < il; i++ ) {
            particle = particles[ pins[ i ] ];
            particle.position.copy( particle.original );
            particle.previous.copy( particle.position );
        }

        // Fixed flag constraints
        for ( i = 0, il = fixedConstraints.length; i < il; i++ ) {
            fixedConstraints[ i ].satisfyFixed();
        }

    };

    // Render flag cloth
    Flag.prototype.render = function () { this.cloth.render(); };

    // Public flag interface
    Flag.prototype.createPublic = function () { return new PublicFlag( this ); };

    // Public Flag interface constructor
    function PublicFlag ( flag ) {

        var isDefaultSize = true,
            imgSrc        = null;

        function setDefaultSize ( img ) { // Get flag size from image
            var imgWidth    = ( img )? img.width  : defaultOptions.width,
                imgHeight   = ( img )? img.height : defaultOptions.height,
                defaultSize = defaultOptions.height,
                width,
                height;
            if ( imgWidth / imgHeight < 1 ) { // vertical flag
                width  = defaultSize;
                height = defaultSize * imgHeight / imgWidth;
            }
            else { // horizontal or square flag
                width  = defaultSize * imgWidth / imgHeight;
                height = defaultSize;
            }
            flag.setOptions( { width : width, height : height } );
        }

        this.options = {

            get topEdge () { return flag.topEdge.name; },
            set topEdge ( val ) { flag.setTopEdge( val ); },

            get hoisting () { return flag.hoisting; },
            set hoisting ( val ) { flag.setHoisting( val ); },

            get isDefaultSize () { return isDefaultSize; },
            set isDefaultSize ( val ) {
                isDefaultSize = !!val;
                if ( isDefaultSize ) { setDefaultSize( flag.img ); }
            },

            get width () { return flag.options.width; },
            set width ( val ) {
                val = window.Number( val );
                if ( Util.isNumeric( val ) && val > 0 ) {
                    isDefaultSize = false;
                    flag.setOptions( { width : val } );
                }
            },

            get height () { return flag.options.height; },
            set height ( val ) {
                val = window.Number( val );
                if ( Util.isNumeric( val ) && val > 0 ) {
                    isDefaultSize = false;
                    flag.setOptions( { height : val } );
                }
            },

            get mass () { return flag.options.mass; },
            set mass ( val ) {
                val = window.Number( val );
                if ( Util.isNumeric( val ) && val >= 0 ) {
                    flag.setOptions( { mass : val } );
                }
            },

            get levelOfDetail () { return flag.options.levelOfDetail; },
            set levelOfDetail ( val ) {
                val = window.Math.round( val );
                if ( Util.isNumeric( val ) && val > 0 ) {
                    flag.setOptions( { levelOfDetail : val } );
                }
            },

            get imgSrc () { return imgSrc; },
            set imgSrc ( src ) {
                var callback;
                if ( isDefaultSize ) { callback = setDefaultSize; }
                flag.loadTexture( imgSrc = src, callback );
            }

        };

        if ( isDebugMode ) { this._flag = flag; }

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
    var poleOffset  = 300,
        poleHeight  = 1000;

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
        flag = new Flag();
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
        if ( Util.isNumeric( value ) && value > 0 ) {
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

        timePrev = time;
        time = window.Date.now();
        if ( !timePrev ) { return; }

        timestep = ( time - timePrev ) / 1000;
        if ( timestep > TIMESTEP ) { timestep = TIMESTEP; }
        timestepSq = timestep * timestep;

        // windStrength = window.Math.cos( time / 7000 ) * 100 + 200;
        // windStrength = 100;
        windForce.set(
            window.Math.sin( time / 2000 ),
            window.Math.cos( time / 3000 ),
            window.Math.sin( time / 1000 )
        ).normalize().multiplyScalar( windStrength );
        // windForce.set( 2000, 0, 1000 ).normalize().multiplyScalar( windStrength );

        flag.simulate();
        render();

    }

    function render () {
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
