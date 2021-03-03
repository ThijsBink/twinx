import React, { Component } from 'react';

import DashboardList from '../components/dashboard/general/List';
import DashboardItemPage from '../components/dashboard/individual/View';

export default class Dashboard extends Component {
  state = {
    items: [
      { name: 'item 1', id: 0 },
      { name: 'item 2', id: 1 },
      { name: 'item 3', id: 2 },
      { name: 'item 4', id: 3 },
    ],
    selectedItem: null,
  };

  selectItemHandler = (itemId) => {
    console.log(`Clicked item ${itemId}`);
    this.setState({
      selectedItem: this.state.items.find((item) => item.id === itemId),
    });
  };

  selectReturnHandler = () => {
    this.setState({
      selectedItem: null,
    });
  };

  render() {
    return this.state.selectedItem ? (
      <DashboardItemPage
        item={this.state.selectedItem}
        onReturn={this.selectReturnHandler.bind(this)}
      />
    ) : (
      <>
        <h1>Dashboard</h1>
        <DashboardList
          items={this.state.items}
          onSelectItem={this.selectItemHandler}
        />
      </>
    );
  }
}
