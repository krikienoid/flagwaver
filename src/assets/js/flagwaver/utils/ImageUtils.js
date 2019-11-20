import THREE from 'three';

export function generateDataTexture(width, height, color) {
    const size = width * height;
    const data = new Uint8Array(3 * size);

    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);

    for (let i = 0; i < size; i++) {
        const stride = i * 3;

        data[stride] = r;
        data[stride + 1] = g;
        data[stride + 2] = b;
    }

    const texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);

    return texture;
}
