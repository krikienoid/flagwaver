import Module from '../core/Module';

/**
 * @class ResizeModule
 *
 * @classdesc Updates canvas size on window resize.
 */
function ResizeModule() {
    this.app = null;
    this.resize = this.resize.bind(this);
}

ResizeModule.prototype = Object.create(Module.prototype);
ResizeModule.prototype.constructor = ResizeModule;

Object.assign(ResizeModule.prototype, {
    displayName: 'resizeModule',

    init: function (app) {
        this.app = app;

        window.addEventListener('resize', this.resize);
        this.resize();
    },

    deinit: function () {
        window.removeEventListener('resize', this.resize);
    },

    resize: function () {
        var scene = this.app.scene;
        var renderer = this.app.renderer;
        var camera = this.app.camera;

        var canvasHeight = 1;
        var canvasWidth = 1;

        // If canvas is added to DOM
        if (renderer.domElement.parentElement) {
            canvasWidth = renderer.domElement.parentElement.clientWidth;
            canvasHeight = renderer.domElement.parentElement.clientHeight;
        }

        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasWidth, canvasHeight);
        renderer.render(scene, camera);
    }
});

export default ResizeModule;
