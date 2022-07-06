import Flag from './Flag';

/**
 * @class VideoFlag
 *
 * @classdesc Initializes a flag object with a playable video texture.
 *
 * @param {Object} [options]
 *   @param {number} [options.width]
 *   @param {number} [options.height]
 *   @param {number} [options.mass]
 *   @param {number} [options.restDistance]
 *   @param {THREE.Texture} [options.texture]
 *   @param {Object} [options.pin]
 */
export default class VideoFlag extends Flag {
    constructor(options) {
        super(options);

        const settings = Object.assign({}, options);
        const { texture } = settings;

        this.video = texture && texture.image instanceof HTMLVideoElement
            ? texture.image
            : null;
    }

    destroy() {
        super.destroy();

        this.pause();
    }

    play() {
        const video = this.video;

        if (video && video.paused) {
            return video.play();
        }

        return Promise.resolve();
    }

    pause() {
        const video = this.video;

        if (video && !video.paused) {
            video.pause();
        }
    }

    reset() {
        super.reset();

        const video = this.video;

        if (video) {
            video.currentTime = 0;
        }
    }

    simulate(deltaTime) {
        super.simulate(deltaTime);

        const video = this.video;

        if (video && video.paused) {
            const previousTime = video.currentTime;

            this.mesh.material.map.update();

            video.currentTime += deltaTime;

            if (video.loop && deltaTime && previousTime === video.currentTime) {
                video.currentTime = 0;
            }
        }
    }
}
