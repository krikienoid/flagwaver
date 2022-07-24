import { AmbientLight, DirectionalLight } from 'three';

function setLightShadow(light) {
    const d = 10;

    light.castShadow            = true;
    light.shadow.mapSize.width  = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.top     = d;
    light.shadow.camera.left    = -d;
    light.shadow.camera.bottom  = -d;
    light.shadow.camera.right   = d;
    light.shadow.camera.far     = 1000;
}

export function createMutedLights() {
    const light1 = new AmbientLight(0xffffff, 0.4);

    const light2 = new DirectionalLight(0xfefffa, 4.5);

    light2.position.set(20, 70, 40);
    setLightShadow(light2);

    return [light1, light2];
}

export function createDaytimeLights() {
    const light1 = new AmbientLight(0xffffff, 0.6);

    const light2 = new DirectionalLight(0xdfebff, 6.5);

    light2.position.set(20, 70, 40);
    setLightShadow(light2);

    const light3 = new DirectionalLight(0xacdf9f, 0.35);

    light3.position.set(0, -1, 0);

    return [light1, light2, light3];
}

export function createNighttimeLights() {
    const light1 = new AmbientLight(0xffffff, 0.004);

    const light2 = new DirectionalLight(0xa8b4e2, 4.5);

    light2.position.set(-55, 50, -80);
    setLightShadow(light2);

    const light3 = new DirectionalLight(0x6877aa, 0.3);

    light3.position.set(0, 1, 0);

    return [light1, light2, light3];
}
