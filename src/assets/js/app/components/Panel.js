import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Panel extends Component {
    static propTypes = {
        title: PropTypes.node,
        onPanelClose: PropTypes.func,
        children: PropTypes.node
    };

    static defaultProps = {
        onPanelClose: () => {}
    };

    render() {
        const { title, onPanelClose, children } = this.props;

        return (
            <div className="panel">
                <div className="panel-header">
                    <div className="panel-header-controls">
                        <a
                            href="#"
                            onClick={onPanelClose}
                        >&lsaquo; Back</a>
                    </div>

                    <div className="panel-header-inner">
                        <div className="panel-side">
                        </div>

                        <div className="panel-main">
                            <h2 className="panel-heading">
                                {title}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="panel-body">
                    <div className="panel-body-inner">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}
