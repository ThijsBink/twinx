import React from 'react';
import Chart from './Chart';

import './View.css';

const View = ({ view, data, onEdit, onSignal }) => (
  <div className='view'>
    <div className='title'>
      <h6>{view.name}</h6>
      <div>
        <button onClick={() => onSignal()}>S</button>
        <button onClick={() => onEdit(view)}>E</button>
      </div>
    </div>
    <div style={{ width: '100%', height: '100%', margin: 0 }}>
      <Chart data={data} />
    </div>
  </div>
);

export default View;
