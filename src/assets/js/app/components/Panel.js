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
            <section className="panel">
                <header className="panel-header">
                    <div className="panel-header-inner">
                        <div className="panel-side">
                        </div>

                        <div className="panel-main">
                            <h2 className="panel-heading">
                                {title}
                            </h2>
                        </div>
                    </div>
                </header>

                <div className="panel-body">
                    {children}
                </div>
            </section>
        );
    }
}
