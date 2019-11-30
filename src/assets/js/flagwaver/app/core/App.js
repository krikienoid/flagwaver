import THREE from 'three';

import { TIME_STEP } from '../../constants';
import initStats from '../../utils/initStats';
import ModuleSystem from './ModuleSystem';

const stats = (process.env.NODE_ENV === 'development') ? initStats() : null;

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

        let { scene, camera, renderer } = settings;

        const cameraFocus = new THREE.Vector3(0, 5, 0);

        const clock = new THREE.Clock();
        const timestep = TIME_STEP;
        const maxUpdatesPerFrame = 90;
        const maxPanics = 255;
        let delta = 0;
        let panicCount = 0;

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
            camera.lookAt(cameraFocus);
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

        const panic = () => {
            delta = 0;

            if (panicCount <= maxPanics) {
                if (panicCount === maxPanics) {
                    console.warn('FlagWaver.App: maxUpdatesPerFrame exceeded. Suppressing further warnings.');
                } else {
                    console.warn('FlagWaver.App: maxUpdatesPerFrame exceeded.');
                }

                panicCount++;
            }
        };

        const loop = () => {
            requestAnimationFrame(loop);

            if (process.env.NODE_ENV === 'development') {
                stats.begin();
            }

            if (clock.running) {
                let updateCount = 0;

                delta += clock.getDelta();

                while (delta >= timestep) {
                    update(timestep);

                    delta -= timestep;

                    if (++updateCount >= maxUpdatesPerFrame) {
                        panic();

                        break;
                    }
                }
            }

            if (process.env.NODE_ENV === 'development') {
                stats.end();
            }
        };

        const destroy = () => {
            clock.stop();
            removeModules();
            cancelAnimationFrame(loop);

            scene.dispose();
            renderer.dispose();
            renderer.forceContextLoss();

            this.canvas = renderer.domElement = null;
            this.scene = scene = null;
            this.camera = camera = null;
            this.renderer = renderer = null;
        };

        // Init
        scene.add(camera);
        clock.start();
        start();
        loop();

        // Public properties and methods
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.canvas = renderer.domElement;
        this.clock = clock;
        this.timestep = timestep;
        this.destroy = destroy;
        this.render = render;
        this.start = start;
        this.update = update;
        this.needsUpdate = false;
    }
}
