import { Component } from 'react';
import PropTypes from 'prop-types';

import {
    FlagpoleType,
    FlagGroupModule,
    buildAsyncFlagFromImage,
    buildAsyncFlagFromVideo,
    buildFlag,
    buildFlagpole
} from '../../flagwaver';
import withAppContext from '../hocs/withAppContext';
import { getObject } from '../utils/BlobUtils';

const DEFAULT_FLAG_IMAGE_PATH = `${process.env.ROOT_URL}/assets/img/flag-default.png`;

class FlagGroup extends Component {
    static propTypes = {
        app: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired,
        addToast: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { app } = this.props;

        this.module = new FlagGroupModule();

        app.add(this.module);
        app.needsUpdate = true;

        this.renderModule();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.options !== this.props.options) {
            this.renderModule();
        }
    }

    componentWillUnmount() {
        this.props.app.remove(this.module);
    }

    updateFlag(flag) {
        const { app, options } = this.props;

        app.remove(this.module);

        this.module = new FlagGroupModule({
            flagpole: buildFlagpole(options, flag),
            flag: flag
        });

        if (
            options.flagpoleType === FlagpoleType.HORIZONTAL ||
            options.flagpoleType === FlagpoleType.OUTRIGGER
        ) {
            const flagGroup = this.module.subject;
            const flagpole = flagGroup.flagpole;
            const poleLength = flagpole.constructor.defaults.poleLength;

            // Center top of flagpole
            flagGroup.object.position
                .set(0, poleLength, 0)
                .sub(flagpole.top);
        }

        app.add(this.module);
        app.render();
        app.needsUpdate = true;
    }

    renderModule() {
        const { options, addToast } = this.props;
        const { imageSrc } = options;

        const src = imageSrc || DEFAULT_FLAG_IMAGE_PATH;

        (new Promise((resolve, reject) => {
            const file = getObject(src);
            const isVideo = (file && file.type.match(/video\/.*/)) ||
                src.match(/\.(3gp|avi|flv|mov|mp4|mpg|ogg|webm|wmv)$/);

            if (isVideo) {
                const isBrowserIE11 = window.document.documentMode;

                if (isBrowserIE11) {
                    reject('Browser feature not supported.');
                } else {
                    buildAsyncFlagFromVideo(src, options)
                        .then((flag) => {
                            resolve(flag);
                        })
                        .catch(() => {
                            reject('Video could not be loaded.');
                        });
                }
            } else {
                buildAsyncFlagFromImage(src, options)
                    .then((flag) => {
                        resolve(flag);
                    })
                    .catch(() => {
                        reject('Image could not be loaded.');
                    });
            }
        }))
            .then((flag) => {
                this.updateFlag(flag);
            })
            .catch((error) => {
                this.updateFlag(buildFlag(options));

                addToast({
                    status: 'error',
                    message: error
                });
            });
    }

    render() {
        return null;
    }
}

export default withAppContext(FlagGroup);
