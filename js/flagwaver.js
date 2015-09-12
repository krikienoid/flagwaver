/**
 * Flag Waver
 *
 * Simulate a flag waving in the breeze right in your browser window.
 *
 */

var clothGeometry, pins;

;(function (window, document, undefined) {

    var scene, camera, renderer, object,
        container, canvas, vertexShader, fragmentShader,
        imageData;

    // pin flag to flagpole
    pins = [];
    for ( var j = 0; j <= cloth.h; j++ ) {
        pins.push( cloth.index( 0, j ) );
    }

    //
    // functions
    //

    function init (containerElem) {

        // get dom elements
        container = containerElem;
        vertexShader   = document.getElementById( 'vertexShaderDepth' ).textContent;
        fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

        // init scene
        scene     = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x000000, 1000, 10000 );
        scene.fog.color.setHSV( 0.6, 0.2, 1 );

        // init camera
        camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.y = 50;
        camera.position.z = 1500;
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
        var poleGeo = new THREE.CubeGeometry( 14, 750, 2 ),
            poleMat = new THREE.MeshPhongMaterial( {
                color    : 0x4A4A4A,
                specular : 0x111111,
                shiness  : 0,
                perPixel : true
            } ),
            mesh = new THREE.Mesh( poleGeo, poleMat );
        mesh.position.y = -175;
        mesh.position.x = -4;
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

    function setFlagImg (imageData) {

        // init cloth texture
        var flagMaterial, clothTexture;
        if (imageData !== undefined){
            clothTexture = THREE.ImageUtils.loadTexture( imageData.src );
        }
        else {
            clothTexture = THREE.ImageUtils.loadTexture( '/assets/images/jb-16.png' );
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
        clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h, true );
        clothGeometry.dynamic = true;
        clothGeometry.computeFaceNormals();
        var uniforms = { texture:  { type: "t", value: 0, texture: clothTexture } };

        // init cloth mesh
        scene.remove( object );
        object = new THREE.Mesh( clothGeometry, flagMaterial );
        object.position.set( 0, 0, 0 );
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
        var time = Date.now();
        // windStrength = Math.cos( time / 7000 ) * 100 + 200;
        // windStrength = 100;
        windForce.set(
            Math.sin( time / 2000 ),
            Math.cos( time / 3000 ),
            Math.sin( time / 1000 )
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
        var timer = Date.now() * 0.0002,
            p     = cloth.particles;
        for ( var i = 0, il = p.length; i < il; i ++ ) {
            clothGeometry.vertices[ i ].copy( p[ i ].position );
        }
        clothGeometry.computeFaceNormals();
        clothGeometry.computeVertexNormals();
        clothGeometry.normalsNeedUpdate  = true;
        clothGeometry.verticesNeedUpdate = true;
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
    }

    //
    // quick links!
    //

    var $setLink = $('#set-link'),
        $getLink = $('#get-link');

    function setLink (imgLink) {
        setFlagImg( { src : imgLink } );
    }

    $(window.document).ready(function getDataFromURL () {
        var hashData = window.location.href.split( '#' )[ 1 ],
            imgLink;
        if ( hashData && hashData.length ) {
            imgLink = window.unescape( hashData );
            setLink(imgLink);
            $setLink.val( imgLink );
        }
    });

    $getLink.on( 'click', function getLink () {
        if ($setLink.val().length) {
            window.prompt(
                'Your link:',
                window.location.href.split('#')[0] + '#' + window.escape($setLink.val())
            );
        }
        else {
            window.alert('Input field is empty!');
        }
    } );

    $setLink.on( 'change', function () {
        setLink( $setLink.val() );
    } );

    //
    // export
    //

    window.flagWaver = {
        init       : init,
        setWind    : setWind,
        setFlagImg : setFlagImg,
        container  : container,
        canvas     : canvas
    };

}(window, document));
