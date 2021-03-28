import React from 'react';
import Chart from './Chart';

import './View.css';
import { GraphButton } from '../../general-styles';

const View = ({ view, data, onEdit, onSignal }) => (
  <div className='view'>
    <div className='title'>
      <h6>{view.name}</h6>
      <div>
        <GraphButton style={{ marginRight: '3px'}}  onClick={() => onSignal()}>Signal</GraphButton>
        <GraphButton  onClick={() => onEdit(view)}>Edit</GraphButton>
      </div>
    </div>
    <div style={{ width: '100%', height: '100%', margin: 0 }}>
      <Chart data={data} />
    </div>
  </div>
);

export default View;
