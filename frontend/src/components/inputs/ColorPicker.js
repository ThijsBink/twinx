import React, { useState } from 'react';
import { GithubPicker } from 'react-color';

export default function ColorPicker({ value, onChange }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => setDisplayColorPicker((current) => !current);
  const handleClose = () => setDisplayColorPicker(false);
  const handleChange = (newColor) => {
    onChange(newColor.hex);
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
            colors={['#efeaff', '#eaffeb', '#ffeaea', '#fffdea']}
            width='87px'
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
}
