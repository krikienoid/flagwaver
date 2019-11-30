import THREE from 'three';

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
    const scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xcce0fe, 1, 1000);

    return scene;
}

function buildCamera() {
    const camera = new THREE.PerspectiveCamera(
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
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha:     true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(dpr);
    renderer.gammaInput        = true;
    renderer.gammaOutput       = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

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
