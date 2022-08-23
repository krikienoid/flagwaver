import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { loadImage } from '../../flagwaver';
import { SceneryBackground } from '../constants';

function AppBackground({
    options,
    addToast
}) {
    const { background, backgroundColor, backgroundImageSrc } = options;

    const [src, setSrc] = useState('');

    useEffect(() => {
        setSrc('');

        if (backgroundImageSrc) {
            loadImage(
                backgroundImageSrc,
                (image) => {
                    setSrc(backgroundImageSrc);
                },
                (e) => {
                    addToast({
                        status: 'error',
                        message: 'Image could not be loaded.'
                    });
                }
            );
        }
    }, [backgroundImageSrc]);

    return (
        <div
            className={`app-bg bg-image-full bg-${background}`}
            style={background === SceneryBackground.CUSTOM ? {
                backgroundColor: backgroundColor,
                backgroundImage: src
                    ? `url("${src.replace(/"/g, '\\"')}")`
                    : null
            } : null}
        ></div>
    );
}

AppBackground.propTypes = {
    options: PropTypes.object.isRequired,
    addToast: PropTypes.func.isRequired
};

export default AppBackground;
