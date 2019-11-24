import THREE from 'three';

function setLightShadow(light) {
    const d = 300;

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
    const light1 = new THREE.AmbientLight(0x222222, 1);

    const light2 = new THREE.DirectionalLight(0xfefffa, 1.5);

    light2.position.set(50, 175, 100);
    setLightShadow(light2);

    return [light1, light2];
}

export function createDaytimeLights() {
    const light1 = new THREE.AmbientLight(0x333333, 1);

    const light2 = new THREE.DirectionalLight(0xdfebff, 2.5);

    light2.position.set(50, 175, 100);
    setLightShadow(light2);

    const light3 = new THREE.DirectionalLight(0xacdf9f, 0.35);

    light3.position.set(0, -1, 0);

    return [light1, light2, light3];
}

export function createNighttimeLights() {
    const light1 = new THREE.AmbientLight(0x010101, 0.3);

    const light2 = new THREE.DirectionalLight(0x8ba1ff, 1.5);

    light2.position.set(-80, 75, -120);
    setLightShadow(light2);

    const light3 = new THREE.DirectionalLight(0x4564cd, 0.08);

    light3.position.set(0, 1, 0);

    return [light1, light2, light3];
}
