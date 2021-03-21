import React from 'react';

import AgentItem from './AgentItem';
import { Card, CardDeck } from 'react-bootstrap';
import './AgentsList.css';

const AgentsList = ({ agents, companies }) => (
  <div className='grid-container'>
    {agents.map((agent) => {
      return (
        <AgentItem
          key={agent.publicId}
          agent={agent}
          companyName={
            companies.find((company) => company.publicId === agent.companyId)
              .name
          }
        />
        
      );
    })}
  </div>
);

export default AgentsList;
