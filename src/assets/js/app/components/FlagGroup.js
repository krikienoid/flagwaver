import { Component } from 'react';
import PropTypes from 'prop-types';

import {
    FlagGroupModule,
    buildAsyncFlagFromImage,
    buildFlagpole
} from '../../flagwaver';
import withAppContext from '../hocs/withAppContext';

const DEFAULT_FLAG_IMAGE_PATH = './assets/img/flag-default.png';

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

        app.add(this.module);
        app.needsUpdate = true;
    }

    renderModule() {
        const { options, addToast } = this.props;
        const src = options.imageSrc || DEFAULT_FLAG_IMAGE_PATH;

        buildAsyncFlagFromImage(src, options)
            .then((flag) => {
                this.updateFlag(flag);
            }, (flag) => {
                this.updateFlag(flag);
            })
            .catch((e) => {
                addToast({
                    status: 'error',
                    message: 'Image could not be loaded.'
                });
            });
    }

    render() {
        return null;
    }
}

export default withAppContext(FlagGroup);
