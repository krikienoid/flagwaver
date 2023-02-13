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
 *   @param {THREE.Texture} [options.backSideTexture]
 *   @param {Object} [options.pin]
 */
export default class VideoFlag extends Flag {
    constructor(options) {
        super(options);

        const settings = Object.assign({}, options);
        const { texture, backSideTexture } = settings;

        this.video = texture && texture.image instanceof HTMLVideoElement
            ? texture.image
            : null;

        this.video2 = backSideTexture && backSideTexture.image instanceof HTMLVideoElement
            ? backSideTexture.image
            : null;
    }

    destroy() {
        super.destroy();

        this.pause();
    }

    play() {
        const video = this.video;
        const video2 = this.video2;
        const promises = [];

        if (video && video.paused) {
            promises.push(video.play());
        }

        if (video2 && video2.paused) {
            promises.push(video2.play());
        }

        return Promise.all(promises);
    }

    pause() {
        const video = this.video;
        const video2 = this.video2;

        if (video && !video.paused) {
            video.pause();
        }

        if (video2 && !video2.paused) {
            video2.pause();
        }
    }

    reset() {
        super.reset();

        const video = this.video;
        const video2 = this.video2;

        if (video) {
            video.currentTime = 0;
        }

        if (video2) {
            video2.currentTime = 0;
        }
    }

    simulate(deltaTime) {
        super.simulate(deltaTime);

        const video = this.video;
        const video2 = this.video2;

        if (video && video.paused) {
            const previousTime = video.currentTime;

            this.mesh.material.map.update();

            video.currentTime += deltaTime;

            if (
                video.loop &&
                deltaTime &&
                previousTime === video.currentTime
            ) {
                video.currentTime = 0;
            }
        }

        if (video2 && video2.paused) {
            const previousTime = video2.currentTime;

            this.mesh2.material.map.update();

            video2.currentTime += deltaTime;

            if (
                video2.loop &&
                deltaTime &&
                previousTime === video2.currentTime
            ) {
                video2.currentTime = 0;
            }
        }
    }
}
