import React from 'react';

import Grid from './Grid';
import TopBar from './TopBar';

export default function View(props) {
  console.log(props);
  return (
    <>
      <TopBar returnHandler={props.onReturn} name={props.item.name} />
      <Grid />
    </>
  );
}
