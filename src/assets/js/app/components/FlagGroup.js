import { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import {
    Flag,
    FlagpoleType,
    FlagGroupModule,
    VideoFlag,
    buildFlagpole,
    computeFlagOptionsFromImage,
    loadImage,
    loadVideo
} from '../../flagwaver';
import withAppContext from '../hocs/withAppContext';
import { getObject } from '../utils/BlobUtils';

const DEFAULT_FLAG_IMAGE_PATH = `${process.env.ROOT_URL}/assets/img/flag-default.png`;

const copyProperties = (object, keys) => keys.reduce((result, key) => {
    result[key] = object[key];

    return result;
}, {});

const isVideoSrc = (src) => {
    const file = getObject(src);

    return (file && file.type.match(/video\/.*/)) ||
        src.match(/\.(3gp|avi|flv|mov|mp4|mpg|ogg|webm|wmv)$/);
};

const promiseLoadImage = src => new Promise((resolve, reject) => {
    loadImage(
        src,
        (image) => { resolve(image); },
        (e) => { reject('Image could not be loaded.'); }
    );
});

const promiseLoadVideo = src => new Promise((resolve, reject) => {
    loadVideo(
        src,
        (video) => { resolve(video); },
        (e) => { reject('Video could not be loaded.'); }
    );
});

const arePropsEqual = (prevProps, nextProps) => {
    const { options: prevOptions, ...prevRestProps } = prevProps;
    const { options: nextOptions, ...nextRestProps } = nextProps;

    const areOptionsEqual = Object.keys(prevOptions)
        .filter(a => a !== 'isTwoSided')
        .reduce((result, key) =>
            result && prevOptions[key] === nextOptions[key], true);

    const areRestPropsEqual = Object.keys(prevRestProps)
        .reduce((result, key) =>
            result && prevRestProps[key] === nextRestProps[key], true);

    return areOptionsEqual && areRestPropsEqual;
};

function FlagGroup({ app, options, addToast }) {
    const module = useRef();

    const updateFlag = (flag) => {
        app.remove(module.current);

        const flagpoleOptions = copyProperties(options, [
            'flagpoleType',
            'verticalHoisting'
        ]);

        module.current = new FlagGroupModule({
            flagpole: buildFlagpole(flagpoleOptions, flag),
            flag: flag
        });

        if (
            flagpoleOptions.flagpoleType === FlagpoleType.HORIZONTAL ||
            flagpoleOptions.flagpoleType === FlagpoleType.OUTRIGGER
        ) {
            const flagGroup = module.current.subject;
            const flagpole = flagGroup.flagpole;
            const poleLength = flagpole.constructor.defaults.poleLength;

            // Center top of flagpole
            flagGroup.object.position
                .set(0, poleLength, 0)
                .sub(flagpole.top);
        }

        app.add(module.current);
        app.render();
        app.needsUpdate = true;
    };

    const renderModule = () => {
        const { imageSrc, backSideImageSrc } = options;

        const src = imageSrc || DEFAULT_FLAG_IMAGE_PATH;
        const src2 = backSideImageSrc;

        const textureOptions = copyProperties(options, [
            'width',
            'height',
            'hoisting',
            'orientation',
            'resolution'
        ]);

        const flagOptions = copyProperties(options, [
            'mass',
            'restDistance'
        ]);

        (new Promise((resolve, reject) => {
            if (isVideoSrc(src) || isVideoSrc(src2)) {
                Promise.all([
                    isVideoSrc(src)
                        ? promiseLoadVideo(src)
                        : promiseLoadImage(src),
                    isVideoSrc(src2)
                        ? promiseLoadVideo(src2)
                        : src2
                            ? promiseLoadImage(src2)
                            : null
                ])
                    .then(([image, backSideImage]) => {
                        resolve(new VideoFlag({
                            ...flagOptions,
                            ...computeFlagOptionsFromImage({
                                ...textureOptions,
                                image,
                                backSideImage
                            })
                        }));
                    })
                    .catch(reject);
            } else {
                Promise.all([
                    promiseLoadImage(src),
                    src2 ? promiseLoadImage(src2) : null
                ])
                    .then(([image, backSideImage]) => {
                        resolve(new Flag({
                            ...flagOptions,
                            ...computeFlagOptionsFromImage({
                                ...textureOptions,
                                image,
                                backSideImage
                            })
                        }));
                    })
                    .catch(reject);
            }
        }))
            .then((flag) => {
                updateFlag(flag);
            })
            .catch((error) => {
                updateFlag(new Flag(flagOptions));

                addToast({
                    status: 'error',
                    message: error
                });
            });
    };

    useEffect(() => {
        module.current = new FlagGroupModule();

        app.add(module.current);
        app.needsUpdate = true;

        renderModule();

        return () => {
            app.remove(module.current);
        };
    }, []);

    useEffect(() => {
        renderModule();
    }, [options]);

    return null;
}

FlagGroup.propTypes = {
    app: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    addToast: PropTypes.func.isRequired
};

export default withAppContext(memo(FlagGroup, arePropsEqual));
