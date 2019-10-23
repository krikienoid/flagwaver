import THREE from 'three';

import FlagWaver, {
    App,
    AnimationModule,
    ResizeModule,
    FlagGroupModule,
    WindModule,
    GravityModule,
    WindForceModule
} from '../../flagwaver';

function buildScene() {
    const scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0x000000, 1000, 10000);
    scene.fog.color.setHSL(0.6, 1, 0.9);

    return scene;
}

function buildCamera() {
    const camera = new THREE.PerspectiveCamera(
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

    return renderer;
}

function initLights(app) {
    const scene = app.scene;

    scene.add(new THREE.AmbientLight(0x222222));

    const light1 = new THREE.DirectionalLight(0xffffff, 1.75);
    const d = 300;

    light1.color.setHSL(0.6, 1, 0.9375);
    light1.position.set(50, 175, 100);
    light1.position.multiplyScalar(1.3);
    light1.castShadow           = true;
    light1.shadow.mapSize.width   = 2048;
    light1.shadow.mapSize.height  = 2048;
    light1.shadow.camera.top      = d;
    light1.shadow.camera.left     = -d;
    light1.shadow.camera.bottom   = -d;
    light1.shadow.camera.right    = d;
    light1.shadow.camera.far      = 1000;

    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.35);

    light2.color.setHSL(0.3, 0.5, 0.75);
    light2.position.set(0, -1, 0);

    scene.add(light2);
}

function buildApp() {
    const app = new App({
        scene: buildScene(),
        camera: buildCamera(),
        renderer: buildRenderer()
    });

    initLights(app);

    app.add(new ResizeModule());
    app.add(new AnimationModule());

    app.add(new GravityModule(['flagModule']));
    app.add(new WindForceModule(['flagModule'], ['windModule']));

    return app;
}

export default function init() {
    return buildApp();
}
