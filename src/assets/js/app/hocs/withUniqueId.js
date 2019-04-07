import React, { Component } from 'react';

import uniqueId from '../utils/uniqueId';

export default function withUniqueId(WrappedComponent) {
    return class extends Component {
        constructor(props) {
            super(props);

            this.id = props.id || uniqueId('uid-');
        }

        render() {
            return (
                <WrappedComponent {...this.props} id={this.id} />
            );
        }
    };
}
