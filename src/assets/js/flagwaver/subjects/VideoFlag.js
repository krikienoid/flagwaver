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
 *   @param {number} [options.granularity]
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
            video.play();
        }
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
            if (!video.paused) {
                video.pause();
            }

            video.currentTime = 0;
        }
    }

    simulate(deltaTime) {
        super.simulate(deltaTime);

        const video = this.video;

        if (video && video.paused) {
            video.currentTime += deltaTime;
        }
    }
}
