import THREE from 'three';
import ModuleSystem from './ModuleSystem';

var FPS = 60;
var TIME_STEP = 1 / FPS;

/**
 * @class App
 *
 * @classdesc Root module and time counter.
 *
 * @param {Object} options
 *   @param {THREE.Scene} options.scene
 *   @param {THREE.Camera} options.camera
 *   @param {THREE.WebGLRenderer} options.renderer
 *   @param {Function} [options.onStart]
 *   @param {Function} [options.onUpdate]
 */
function App(options) {
    ModuleSystem.call(this);

    var self = this;

    var settings = Object.assign({}, App.defaults, options);

    var scene = settings.scene;
    var camera = settings.camera;
    var renderer = settings.renderer;

    var onStart = settings.onStart.bind(this);
    var onUpdate = settings.onUpdate.bind(this);

    var clock = new THREE.Clock();
    var timestep = TIME_STEP;

    function startModules() {
        var modules = self.modules;
        var i, il;
        var module;

        for (i = 0, il = modules.length; i < il; i++) {
            module = modules[i];

            if (module.subject && module.reset) {
                module.reset();
            }
        }
    }

    function updateModules(deltaTime) {
        var modules = self.modules;
        var i, il;
        var module;

        for (i = 0, il = modules.length; i < il; i++) {
            module = modules[i];

            if ((module.subject || module.interact) && module.update) {
                module.update(deltaTime);
            }
        }
    }

    function render() {
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    function start() {
        onStart();
        startModules();
        render();
    }

    function update(deltaTime) {
        onUpdate(deltaTime);
        updateModules(deltaTime);
        render();
    }

    function loop() {
        requestAnimationFrame(loop);

        if (clock.running) {
            update(Math.min(clock.getDelta(), timestep));
        }
    }

    // Init
    ModuleSystem.call(this);
    scene.add(camera);
    clock.start();
    start();
    loop();

    // Public properties and methods
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.canvas = renderer.domElement;
    this.clock = clock;
    this.timestep = timestep;
    this.start = start;
    this.update = update;
}

App.prototype = Object.create(ModuleSystem.prototype);
App.prototype.constructor = App;

Object.assign(App, {
    defaults: {
        onStart: function () {},
        onUpdate: function () {}
    }
});

export default App;
