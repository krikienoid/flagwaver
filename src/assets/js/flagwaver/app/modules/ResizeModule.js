import Module from '../core/Module';

/**
 * @class ResizeModule
 *
 * @classdesc Updates canvas size on window resize.
 */
export default class ResizeModule extends Module {
    constructor() {
        super();

        this.app = null;
        this.resize = this.resize.bind(this);
    }

    static displayName = 'resizeModule';

    init(app) {
        this.app = app;

        window.addEventListener('resize', this.resize);
        this.resize();
    }

    deinit() {
        window.removeEventListener('resize', this.resize);
    }

    resize() {
        const { scene, camera, renderer } = this.app;
        const parentElement = renderer.domElement.parentElement;
        let canvasHeight = 1;
        let canvasWidth = 1;

        // If canvas is added to DOM
        if (parentElement) {
            canvasWidth = parentElement.clientWidth;
            canvasHeight = parentElement.clientHeight;
        }

        // Update scene
        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasWidth, canvasHeight);
        renderer.render(scene, camera);
    }
}
