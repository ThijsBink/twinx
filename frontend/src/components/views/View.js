import React from 'react';
import Chart from './Chart';

import './View.css';

const View = ({ view, data, onEdit }) => (
  <div className='view'>
    <div className='title'>
      <h6>{view.name}</h6>
      <button onClick={() => onEdit(view)}>O</button>
    </div>
    <Chart data={data} />
  </div>
);

export default View;
