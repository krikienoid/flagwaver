import { Component } from 'react';
import PropTypes from 'prop-types';

import {
    FlagpoleType,
    FlagGroupModule,
    buildAsyncFlagFromImage,
    buildAsyncFlagFromVideo,
    buildFlagpole
} from '../../flagwaver';
import withAppContext from '../hocs/withAppContext';

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
        const { fileRecord, options, addToast } = this.props;
        const src = options.src || DEFAULT_FLAG_IMAGE_PATH;

        const { file } = fileRecord;
        const isVideo = (file && file.type.match(/video\/.*/)) || src.match(/\.(mp4|mov)$/);
        const isBrowserIE11 = window.document.documentMode;
        
        if (isVideo) {
            if (!isBrowserIE11) {
                buildAsyncFlagFromVideo(src, options)
                    .then((flag) => {
                        this.updateFlag(flag);
                    })
                    .catch((flag) => {
                        this.updateFlag(flag);

                        addToast({
                            status: 'error',
                            message: 'Video could not be loaded.'
                        });
                    });
            } else {
                addToast({
                    status: 'error',
                    message: 'Browser feature not supported.'
                });

                buildAsyncFlagFromImage(DEFAULT_FLAG_IMAGE_PATH, options)
                    .then((flag) => {
                        this.updateFlag(flag);
                    });
            }
        } else {
            buildAsyncFlagFromImage(src, options)
                .then((flag) => {
                    this.updateFlag(flag);
                })
                .catch((flag) => {
                    this.updateFlag(flag);

                    addToast({
                        status: 'error',
                        message: 'Image could not be loaded.'
                    });
                });
        }
    }

    render() {
        return null;
    }
}

export default withAppContext(FlagGroup);
