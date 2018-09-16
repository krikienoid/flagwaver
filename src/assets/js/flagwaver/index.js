/*!
 * FlagWaver - Core
 * @author krikienoid / https://github.com/krikienoid
 */

import THREE from 'three';
import WindModifiers from './subjects/WindModifiers';
import App from './app/core/App';
import ResizeModule from './app/modules/ResizeModule';
import AnimationModule from './app/modules/AnimationModule';
import FlagGroupModule from './app/modules/FlagGroupModule';
import WindModule from './app/modules/WindModule';
import GravityModule from './app/modules/GravityModule';
import WindForceModule from './app/modules/WindForceModule';

;(function (window, document, THREE, undefined) {
    var initialized = false;
    var app;

    function buildScene() {
        var scene = new THREE.Scene();

        scene.fog = new THREE.Fog(0x000000, 1000, 10000);
        scene.fog.color.setHSL(0.6, 1, 0.9);

        return scene;
    }

    function buildCamera() {
        var camera = new THREE.PerspectiveCamera(
            30,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );

        camera.position.y = 50;
        camera.position.z = 2000;

        return camera;
    }

    function buildRenderer() {
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha:     true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaInput        = true;
        renderer.gammaOutput       = true;
        renderer.shadowMap.enabled = true;

        return renderer;
    }

    function initLights(app) {
        var scene = app.scene;

        scene.add(new THREE.AmbientLight(0x222222));

        var light1 = new THREE.DirectionalLight(0xffffff, 1.75);
        var d = 300;

        light1.color.setHSL(0.6, 1, 0.9375);
        light1.position.set(50, 175, 100);
        light1.position.multiplyScalar(1.3);
        light1.castShadow           = true;
        light1.shadowMapWidth       = 2048;
        light1.shadowMapHeight      = 2048;
        light1.shadowCameraTop      = d;
        light1.shadowCameraLeft     = -d;
        light1.shadowCameraBottom   = -d;
        light1.shadowCameraRight    = d;
        light1.shadowCameraFar      = 1000;
        light1.shadowDarkness       = 0.5;

        scene.add(light1);

        var light2 = new THREE.DirectionalLight(0xffffff, 0.35);

        light2.color.setHSL(0.3, 0.5, 0.75);
        light2.position.set(0, -1, 0);

        scene.add(light2);
    }

    function buildApp() {
        var app = new App({
            scene: buildScene(),
            camera: buildCamera(),
            renderer: buildRenderer()
        });

        initLights(app);

        app.add(new ResizeModule());
        app.add(new AnimationModule());

        app.add(new WindModule());
        app.add(new FlagGroupModule());

        app.add(new GravityModule(['flagModule']));
        app.add(new WindForceModule(['flagModule'], ['windModule']));

        return app;
    }

    function init() {
        // Prevent multiple initialization
        if (initialized) {
            throw new Error('Already initialized.');
        }

        app = buildApp();

        app.module('windModule').setOptions({
            directionModifier: WindModifiers.rotatingDirection
        });

        app.module('windForceModule').needsUpdate = true;

        initialized = true;

        return app;
    }

    function setWind(value) {
        app.module('windModule').setOptions({ speed: value });
        app.module('windForceModule').needsUpdate = true;
    }

    //
    // Export
    //

    window.flagWaver = {
        init:      init,
        setWind:   setWind,
        animation: {
            start:  function () { app.module('animationModule').play(); },
            stop:   function () { app.module('animationModule').pause(); },
            step:   function () { app.module('animationModule').step(); },
            reset:  function () { app.module('animationModule').reset(); },
            render: function () { app.update(0); }
        },
        get app() { return app; },
        get canvas() { return app.renderer.domElement; }
    };
})(window, document, THREE);
