import React from 'react';

const Item = (props) => (
  <li>
    <button onClick={props.onSelect.bind(this, props.id)}>{props.name}</button>
  </li>
);

export default Item;
