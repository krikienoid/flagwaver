import { useRef } from 'react';
import PropTypes from 'prop-types';
import { NodeGroup } from 'react-move';

import FocusDisabled from '../components/FocusDisabled';
import Toast from '../components/Toast';
import { easeQuadInOut } from '../utils/easings';

function Toasts({ toasts, removeToast }) {
    const liRefs = useRef(new Map()).current;

    const setLiRef = id => (elem) => {
        elem !== null ? liRefs.set(id, elem) : liRefs.delete(id);
    };

    return (
        <div role="alert" aria-live="assertive" aria-atomic="true">
            <NodeGroup
                data={toasts}
                keyAccessor={toast => toast.id}
                start={(d, i) => ({
                    h0: 0, // Default height, set on first render
                    h: 0,
                    x: 1
                })}
                enter={(d, i) => [
                    {
                        h: [1],
                        timing: {
                            duration: 400,
                            ease: easeQuadInOut
                        }
                    },
                    {
                        x: [0],
                        timing: {
                            delay: 400,
                            duration: 600,
                            ease: easeQuadInOut
                        }
                    }
                ]}
                leave={(d, i) => ({
                    x: [1],
                    timing: {
                        duration: 600,
                        ease: easeQuadInOut
                    }
                })}
            >
                {(nodes) => (
                    <ul className="toasts">
                        {nodes.map(({ key, data: toast, state }) => {
                            const { id, message, ...props } = toast;
                            const { h0, h, x } = state;

                            if (!h0) {
                                const node = liRefs.get(id);
                                const height = node ? node.clientHeight : 0;

                                state.h0 = height;
                            }

                            return (
                                <li
                                    key={key}
                                    ref={setLiRef(id)}
                                    style={{
                                        'height': h0 ? `${h * h0}px` : 'auto',
                                        'transform': `translate3d(${x * 22}rem, 0, 0)`
                                    }}
                                >
                                    <FocusDisabled disabled={!!x}>
                                        <div className="toasts-item-wrap">
                                            <Toast
                                                {...props}
                                                onDismissClick={() => {
                                                    removeToast(id);
                                                }}
                                            >
                                                <p>{message}</p>
                                            </Toast>
                                        </div>
                                    </FocusDisabled>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </NodeGroup>
        </div>
    );
}

Toasts.propTypes = {
    toasts: PropTypes.arrayOf(PropTypes.object).isRequired,
    removeToast: PropTypes.func.isRequired
};

export default Toasts;
