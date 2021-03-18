import React from 'react';
import Chart from './Chart';

import './View.css';

const View = ({ name, data }) => (
  <div className='view'>
    <div className='title'>
      <h6>{name}</h6>
    </div>
    <Chart data={data} />
  </div>
);

export default View;
