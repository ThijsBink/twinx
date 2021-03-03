import React from 'react';

const UserItem = (props) => (
  <li>
    <button onClick={props.onSelect.bind(this, props.id)}>{props.name}</button>
  </li>
);

export default UserItem;
