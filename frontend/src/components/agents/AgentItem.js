import React from 'react';
import { Link } from 'react-router-dom';

import './AgentItem.css';

export default function AgentItem({ agent, companyName }) {
  return (
    <div className='agent-container'>
      {companyName}
      <h5>
        <Link to={`/agent/${agent.publicId}`}>{agent.name}</Link>
      </h5>
    </div>
  );
}
