import { useState } from 'react';
import { GithubPicker } from 'react-color';
import PropTypes from 'prop-types';

const colorChoices = [
  '#ff2c02',
  '#ff9a02',
  '#008c23',
  '#0049cb',
  '#6f02ff',
  '#000000',
];

/**
 * React-color documentation: https://casesandberg.github.io/react-color/
 */

export default function ColorPicker({ value, onChange }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => setDisplayColorPicker((current) => !current);
  const handleClose = () => setDisplayColorPicker(false);
  const handleChange = (newColor) => {
    onChange({ target: { name: 'color', value: newColor.hex } });
    handleClose();
  };

  return (
    <div>
      <div
        style={{
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        <div
          style={{
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: value,
          }}
        />
      </div>
      {displayColorPicker && (
        <div
          style={{
            position: 'absolute',
            zIndex: '2',
          }}
        >
          <div
            style={{
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
            }}
            onClick={handleClose}
          />
          <GithubPicker
            colors={colorChoices}
            width='87px'
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
}

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};
