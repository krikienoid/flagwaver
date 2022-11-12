import {
    PCFSoftShadowMap,
    sRGBEncoding,

    ColorManagement,
    Fog,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer
} from 'three';

import {
    App,
    AnimationControlModule,
    ResizeModule,
    OrbitControlsModule,
    ProcessModule,
    applyGravityToCloth,
    applyWindForceToCloth,
    createInteraction
} from '../../flagwaver';

const cameraFocus = new Vector3(0, 5, 0);

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
        100
    );

    camera.position.set(0, 5, 12);
    camera.lookAt(cameraFocus);

    return camera;
}

function buildRenderer() {
    const dpr = window.devicePixelRatio
        ? Math.min(window.devicePixelRatio, 2)
        : 1;

    const renderer = new WebGLRenderer({
        antialias:              true,
        alpha:                  true,
        powerPreference:        'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(dpr);

    renderer.outputEncoding             = sRGBEncoding;
    renderer.physicallyCorrectLights    = true;
    renderer.shadowMap.enabled          = true;
    renderer.shadowMap.type             = PCFSoftShadowMap;

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

    app.add(new OrbitControlsModule());

    const { orbitControls } = app.module('orbitControlsModule');

    orbitControls.maxDistance = 80;
    orbitControls.minDistance = 4;
    orbitControls.target.copy(cameraFocus);
    orbitControls.target0.copy(cameraFocus);

    orbitControls.update();

    app.add(new ResizeModule());
    app.add(new AnimationControlModule());

    // This process module applies each wind force to each flag.
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

    // This process module checks for autoplay muting on every video flag.
    app.add(new ProcessModule(
        null,
        () => {
            const animationControlModule = app.module('animationControlModule');

            const flags = app.getModulesByType('flagGroupModule')
                .map(module => module.subject.flag)
                .filter(flag => flag.video || flag.video2);

            if (app.clock.running) {
                flags.map((flag) => {
                    flag.play()
                        .catch((e) => {
                            // Check for autoplay muting
                            if (
                                e instanceof DOMException &&
                                e.name === 'NotAllowedError'
                            ) {
                                animationControlModule.muted = true;
                            }
                        });
                });
            } else {
                flags.map((flag) => {
                    flag.pause();
                });

                setTimeout(() => {
                    app.render();
                }, 100);
            }

            flags.map((flag) => {
                if (flag.video) {
                    flag.video.muted = animationControlModule.muted;
                }

                if (flag.video2) {
                    flag.video2.muted = animationControlModule.muted;
                }
            });
        }
    ));

    return app;
}

export default function init() {
    ColorManagement.legacyMode = false;

    return buildApp();
}
