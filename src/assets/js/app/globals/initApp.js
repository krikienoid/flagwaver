import {
    PCFSoftShadowMap,
    sRGBEncoding,

    Fog,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from 'three';

import FlagWaver, {
    App,
    AnimationModule,
    ResizeModule,
    ProcessModule,
    applyGravityToCloth,
    applyWindForceToCloth,
    createInteraction
} from '../../flagwaver';

function buildScene() {
    const scene = new Scene();

    scene.fog = new Fog(0xcce0fe, 1, 1000);

    return scene;
}

function buildCamera() {
    const camera = new PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(0, 5, 12);

    return camera;
}

function buildRenderer() {
    const dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
    const renderer = new WebGLRenderer({
        antialias: true,
        alpha:     true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(dpr);

    renderer.outputEncoding     = sRGBEncoding;
    renderer.shadowMap.enabled  = true;
    renderer.shadowMap.type     = PCFSoftShadowMap;

    return renderer;
}

function createInteractionProcessModule(getSubjectLists, action) {
    let updateFn = () => {};

    return new ProcessModule(
        (deltaTime) => {
            updateFn(deltaTime);
        },
        () => {
            updateFn = createInteraction(action, getSubjectLists());
        }
    );
}

function buildApp() {
    const app = new App({
        scene: buildScene(),
        camera: buildCamera(),
        renderer: buildRenderer()
    });

    app.add(new ResizeModule());
    app.add(new AnimationModule());

    app.add(createInteractionProcessModule(
        () => ['flagGroupModule', 'windModule'].map(moduleType =>
            app.getModulesByType(moduleType).map(module => module.subject)
        ),
        (subjects) => {
            const flagGroup = subjects[0];
            const wind = subjects[1];
            const flag = flagGroup.flag;

            applyGravityToCloth(flag.cloth, flag.object);
            applyWindForceToCloth(flag.cloth, wind, flag.object);
        }
    ));

    return app;
}

export default function init() {
    return buildApp();
}
