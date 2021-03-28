import React from 'react';
import { Link } from 'react-router-dom';

import './AgentItem.css';

const AgentItem = ({ agent, companyName }) => (
  <div className='agent-container'>
    <div className="agent-subcontainer">
      <h4> {companyName} </h4>
      <h5> <Link to={`/agent/${agent.publicId}`}>{agent.name}</Link></h5>
      <p>Status: Stable</p>
    </div>
  </div>
);

export default AgentItem;
