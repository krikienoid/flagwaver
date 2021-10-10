uniform sampler2D textureMap;
varying vec2 vUV;
out vec4 outColor;

vec4 pack_depth(const in float depth) {
    const vec4 bit_shift = vec4(256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0);
    const vec4 bit_mask = vec4(0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0);
    vec4 res = fract(depth * bit_shift);
    res -= res.xxyz * bit_mask;
    return res;
}

void main() {
    vec4 pixel = texture2D(textureMap, vUV);
    if (pixel.a < 0.5) discard;
    outColor = pack_depth(gl_FragCoord.z);
}
