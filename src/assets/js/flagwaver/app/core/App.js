import THREE from 'three';

import ModuleSystem from './ModuleSystem';

const FPS = 60;
const TIME_STEP = 1 / FPS;

/**
 * @class App
 *
 * @classdesc Root module and time counter.
 *
 * @param {Object} options
 *   @param {THREE.Scene} options.scene
 *   @param {THREE.Camera} options.camera
 *   @param {THREE.WebGLRenderer} options.renderer
 */
export default class App extends ModuleSystem {
    constructor(options) {
        super();

        const settings = Object.assign({}, this.constructor.defaults, options);

        const { scene, camera, renderer } = settings;

        const clock = new THREE.Clock();
        const timestep = TIME_STEP;

        const removeModules = () => {
            const modules = this.modules;

            for (let i = 0, ii = modules.length; i < ii; i++) {
                this.remove(modules[i]);
            }
        };

        const startModules = () => {
            const modules = this.modules;

            for (let i = 0, ii = modules.length; i < ii; i++) {
                const module = modules[i];

                if (module.subject && module.reset) {
                    module.reset();
                }
            }
        };

        const markModulesNeedsUpdate = (value) => {
            const modules = this.modules;

            for (let i = 0, ii = modules.length; i < ii; i++) {
                const module = modules[i];

                if ('needsUpdate' in module) {
                    module.needsUpdate = value;
                }
            }
        };

        const updateModules = (deltaTime) => {
            const modules = this.modules;

            for (let i = 0, ii = modules.length; i < ii; i++) {
                const module = modules[i];

                if (module.update) {
                    module.update(deltaTime);
                }
            }
        };

        const render = () => {
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        };

        const start = () => {
            startModules();
            render();
        };

        const update = (deltaTime) => {
            if (this.needsUpdate) {
                markModulesNeedsUpdate(true);
                this.needsUpdate = false;
            }

            updateModules(deltaTime);
            render();
        };

        const loop = () => {
            requestAnimationFrame(loop);

            if (clock.running) {
                update(Math.min(clock.getDelta(), timestep));
            }
        };

        const destroy = () => {
            clock.stop();
            removeModules();
            cancelAnimationFrame(loop);
        };

        // Init
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
        this.destroy = destroy;
        this.start = start;
        this.update = update;
        this.needsUpdate = false;
    }
}
