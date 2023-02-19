import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MdOutlineCenterFocusWeak } from 'react-icons/md';
import { Spherical } from 'three';

import { isNumeric } from '../../flagwaver/utils/TypeUtils';
import Icon from '../components/Icon';
import TextInput from '../components/TextInput';
import withAppContext from '../hocs/withAppContext';

const spherical = new Spherical();

const degToRad = deg => deg * Math.PI / 180;
const radToDeg = rad => rad * 180 / Math.PI;
const round = n => Number(n.toFixed(2));

function CameraControlPanel({ app }) {
    const { orbitControls } = app.module('orbitControlsModule');

    const [radius, setRadius] = useState(0);
    const [theta, setTheta] = useState(0);
    const [phi, setPhi] = useState(0);

    const [targetX, setTargetX] = useState(0);
    const [targetY, setTargetY] = useState(0);
    const [targetZ, setTargetZ] = useState(0);

    const updatePosition = (name, value) => {
        if (!isNumeric(value)) { return; }

        spherical.radius = orbitControls.getDistance();
        spherical.theta = orbitControls.getAzimuthalAngle();
        spherical.phi = orbitControls.getPolarAngle();

        spherical[name] = Number(value);

        orbitControls.object.position
            .setFromSpherical(spherical)
            .add(orbitControls.target);

        orbitControls.update();
    };

    const handleXYZChange = (e) => {
        const value = e.target.value;

        if (!isNumeric(value)) { return; }

        orbitControls.target[e.target.name] = Number(value);

        orbitControls.update();
    };

    const resetCamera = () => {
        orbitControls.reset();
    };

    useEffect(() => {
        const handleChange = () => {
            app.refresh();

            setRadius(orbitControls.getDistance());
            setTheta(orbitControls.getAzimuthalAngle());
            setPhi(orbitControls.getPolarAngle());

            setTargetX(orbitControls.target.x);
            setTargetY(orbitControls.target.y);
            setTargetZ(orbitControls.target.z);
        };

        handleChange();

        orbitControls.addEventListener('change', handleChange);

        return () => {
            orbitControls.removeEventListener('change', handleChange);
        };
    }, []);

    return (
        <div className="form-section">
            <div className="form-group">
                <fieldset className="field-group">
                    <legend className="field-group-legend">
                        Position
                    </legend>

                    <div className="field-group-body">
                        <TextInput
                            label="r"
                            name="radius"
                            value={round(radius)}
                            onChange={(e) => {
                                updatePosition(
                                    e.target.name,
                                    Number(e.target.value)
                                );
                            }}
                        />

                        <TextInput
                            label="θ"
                            name="theta"
                            value={round(radToDeg(theta))}
                            onChange={(e) => {
                                updatePosition(
                                    e.target.name,
                                    degToRad(Number(e.target.value))
                                );
                            }}
                        />

                        <TextInput
                            label="φ"
                            name="phi"
                            value={round(radToDeg(phi))}
                            onChange={(e) => {
                                updatePosition(
                                    e.target.name,
                                    degToRad(Number(e.target.value))
                                );
                            }}
                        />
                    </div>
                </fieldset>
            </div>

            <div className="form-group">
                <fieldset className="field-group">
                    <legend className="field-group-legend">
                        Target
                    </legend>

                    <div className="field-group-body">
                        <TextInput
                            label="x"
                            name="x"
                            value={round(targetX)}
                            onChange={handleXYZChange}
                        />

                        <TextInput
                            label="y"
                            name="y"
                            value={round(targetY)}
                            onChange={handleXYZChange}
                        />

                        <TextInput
                            label="z"
                            name="z"
                            value={round(targetZ)}
                            onChange={handleXYZChange}
                        />
                    </div>
                </fieldset>
            </div>

            <div className="form-group">
                <button
                    type="button"
                    className="btn"
                    onClick={resetCamera}
                >
                    <Icon component={MdOutlineCenterFocusWeak} />
                    <span className="btn-text">Reset camera</span>
                </button>
            </div>
        </div>
    );
}

CameraControlPanel.propTypes = {
    app: PropTypes.object.isRequired
};

export default withAppContext(CameraControlPanel);
