import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

import './AgentItem.css';

const AgentItem = ({ agent, companyName }) => (
  <div className='agent-container'>
    <Card style={{ width: '18rem' }}>
    <Card.Header>{companyName}</Card.Header>
    <Card.Body>
      <Card.Title><Link to={`/agent/${agent.publicId}`}>{agent.name}</Link></Card.Title>
      <Card.Text>
        Param1: <br/>
        Param2: <br/>
        Param3: <br/> <br/>
        Status: Stable 
      </Card.Text>
    </Card.Body>
    </Card>
  </div>
);

export default AgentItem;
