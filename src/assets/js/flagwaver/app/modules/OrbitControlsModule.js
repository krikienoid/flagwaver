import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Module from '../core/Module';

/**
 * @class OrbitControlsModule
 *
 * @classdesc Adds OrbitControls to app.
 */
export default class OrbitControlsModule extends Module {
    constructor() {
        super();

        this.orbitControls = null;
    }

    static displayName = 'orbitControlsModule';

    init(app) {
        this.orbitControls = new OrbitControls(
            app.camera,
            app.renderer.domElement
        );
    }

    deinit() {
        this.orbitControls.dispose();
    }
}
