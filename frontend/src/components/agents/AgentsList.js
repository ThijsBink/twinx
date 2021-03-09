import React from 'react';

import AgentItem from './AgentItem';

const AgentsList = (props) => (
  <ul>
    {props.agents.map((agent) => (
      <AgentItem
        key={agent.publicId}
        id={agent.publicId}
        name={agent.name}
        onSelectAgent={props.onSelectAgent}
      />
    ))}
  </ul>
);

export default AgentsList;
