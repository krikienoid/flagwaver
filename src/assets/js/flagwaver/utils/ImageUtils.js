import { DataTexture } from 'three';

export function generateDataTexture(width, height, color) {
    const size = width * height;
    const data = new Uint8Array(4 * size);

    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);
    const a = 1 * 255;

    for (let i = 0; i < size; i++) {
        const stride = i * 4;

        data[stride] = r;
        data[stride + 1] = g;
        data[stride + 2] = b;
        data[stride + 3] = a;
    }

    const texture = new DataTexture(data, width, height);

    texture.needsUpdate = true;

    return texture;
}
