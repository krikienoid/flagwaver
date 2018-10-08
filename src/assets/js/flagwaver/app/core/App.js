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
 *   @param {Function} [options.onStart]
 *   @param {Function} [options.onUpdate]
 */
export default class App extends ModuleSystem {
    constructor(options) {
        super();

        const settings = Object.assign({}, this.constructor.defaults, options);

        const { scene, camera, renderer } = settings;

        const onStart = settings.onStart.bind(this);
        const onUpdate = settings.onUpdate.bind(this);

        const clock = new THREE.Clock();
        const timestep = TIME_STEP;

        const startModules = () => {
            const modules = this.modules;

            for (let i = 0, ii = modules.length; i < ii; i++) {
                const module = modules[i];

                if (module.subject && module.reset) {
                    module.reset();
                }
            }
        };

        const updateModules = (deltaTime) => {
            const modules = this.modules;

            for (let i = 0, ii = modules.length; i < ii; i++) {
                const module = modules[i];

                if ((module.subject || module.interact) && module.update) {
                    module.update(deltaTime);
                }
            }
        };

        const render = () => {
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        };

        const start = () => {
            onStart();
            startModules();
            render();
        };

        const update = (deltaTime) => {
            onUpdate(deltaTime);
            updateModules(deltaTime);
            render();
        };

        const loop = () => {
            requestAnimationFrame(loop);

            if (clock.running) {
                update(Math.min(clock.getDelta(), timestep));
            }
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
        this.start = start;
        this.update = update;
    }

    static defaults = {
        onStart: () => {},
        onUpdate: () => {}
    };
}
