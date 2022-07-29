import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { loadImage } from '../../flagwaver';
import { SceneryBackground } from '../constants';

function AppBackground({
    options,
    addToast
}) {
    const { background, backgroundColor, backgroundImage } = options;

    const [src, setSrc] = useState('');

    useEffect(() => {
        setSrc('');

        if (backgroundImage.file) {
            setSrc(backgroundImage.url);
        } else if (backgroundImage.url) {
            loadImage(
                backgroundImage.url,
                (image) => {
                    setSrc(backgroundImage.url);
                },
                () => {
                    addToast({
                        status: 'error',
                        message: 'Image could not be loaded.'
                    });
                }
            );
        }
    }, [backgroundImage]);

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
