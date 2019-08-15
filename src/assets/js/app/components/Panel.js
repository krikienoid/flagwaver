import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Panel extends Component {
    static propTypes = {
        title: PropTypes.node,
        children: PropTypes.node
    };

    render() {
        const { title, children } = this.props;

        return (
            <div className="panel">
                <div className="panel-header">
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
                    {children}
                </div>
            </div>
        );
    }
}
