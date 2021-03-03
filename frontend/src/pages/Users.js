import React, { Component } from 'react';

import UsersList from '../components/users/UsersList';
import UserPage from '../components/users/UserPage';

export default class Users extends Component {
  state = {
    users: [
      { name: 'user 1', id: 0 },
      { name: 'user 2', id: 1 },
    ],
    selectedUser: null,
  };

  selectUserHandler = (userId) => {
    console.log(`Clicked user ${userId}`);
    this.setState({
      selectedUser: this.state.users.find((user) => user.id === userId),
    });
  };

  selectReturnHandler = () => {
    this.setState({
      selectedUser: null,
    });
  };

  render() {
    return this.state.selectedUser ? (
      <UserPage
        user={this.state.selectedUser}
        onReturn={this.selectReturnHandler}
      />
    ) : (
      <>
        <h1>Users</h1>

        <UsersList
          users={this.state.users}
          onSelectUser={this.selectUserHandler}
        />
      </>
    );
  }
}
