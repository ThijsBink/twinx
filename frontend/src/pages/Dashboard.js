import React, { Component } from 'react';

import AgentsList from '../components/agents/AgentsList';
import AgentView from '../components/agents/AgentView';
import Spinner from '../components/spinner/Spinner';

import ApiContext from '../context/apiContext';

import { requestAgentsList } from '../api/endpoints';

export default class Dashboard extends Component {
  static contextType = ApiContext;

  state = {
    agents: [],
    selectedAgent: null,
    isLoading: false,
  };
  isActive = true;

  componentDidMount() {
    this.fetchAgents();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  fetchAgents = () => {
    this.setState({ isLoading: true });
    requestAgentsList(
      this.context.applicationId,
      this.context.token,
      this.context.companyId
    )
      .then((res) => {
        if (this.isActive) {
          this.setState({ agents: res, isLoading: false });
        }
      })
      .catch((err) => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };

  selectAgentHandler = (id) => {
    console.log(`Clicked item ${id}`);
    this.setState({
      selectedAgent: this.state.agents.find((agent) => agent.publicId === id),
    });
  };

  selectReturnHandler = () => {
    this.setState({
      selectedAgent: null,
    });
  };

  render() {
    return this.state.selectedAgent ? (
      <AgentView
        agent={this.state.selectedAgent}
        onReturn={this.selectReturnHandler.bind(this)}
      />
    ) : (
      <>
        <h1>Dashboard</h1>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <AgentsList
            agents={this.state.agents}
            onSelectAgent={this.selectAgentHandler}
          />
        )}
      </>
    );
  }
}
