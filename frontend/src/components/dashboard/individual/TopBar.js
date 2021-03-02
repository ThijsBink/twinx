import React from 'react';

export default function TopBar(props) {
  console.log(props.name);
  return (
    <div>
      <button onClick={props.returnHandler}>Back</button>
      {' ' + props.name}
    </div>
  );
}
