import React, { Component } from 'react';

import Grid from '../dashboard/individual/Grid';
import TopBar from '../dashboard/individual/TopBar';
import Spinner from '../spinner/Spinner';

import ApiContext from '../../context/apiContext';

import { getTagsList } from '../../api/endpoints';

export default class AgentView extends Component {
  static contextType = ApiContext;

  state = {
    tags: [],
    selectedTag: null,
    isLoading: false,
  };
  isActive = true;

  componentDidMount() {
    this.fetchTags();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  fetchTags = () => {
    this.setState({ isLoading: true });
    getTagsList(
      this.context.applicationId,
      this.context.token,
      this.context.companyId,
      this.props.agent.publicId
    )
      .then((res) => {
        if (this.isActive) {
          this.setState({ tags: res, isLoading: false });
        }
      })
      .catch((err) => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <>
            <TopBar
              returnHandler={this.props.onReturn}
              name={this.props.agent.name}
            />
            <Grid agentId={this.props.agent.publicId} tags={this.state.tags} />
          </>
        )}
      </div>
    );
  }
}
