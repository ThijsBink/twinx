import React from 'react';

const AgentItem = (props) => (
  <li>
    <button onClick={props.onSelectAgent.bind(this, props.id)}>
      {props.name}
    </button>
  </li>
);

export default AgentItem;
