import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import { useApi } from '../../hooks/context/ApiContext';

import './View.css';

export default function View({ name, data }) {
  return (
    <div className='view'>
      <div className='title'>
        <h6>{name}</h6>
      </div>
      <Chart data={data} />
    </div>
  );
}
