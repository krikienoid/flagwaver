import PropTypes from 'prop-types';

function Panel({ title, children }) {
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

Panel.propTypes = {
    title: PropTypes.node,
    children: PropTypes.node
};

export default Panel;
