import React, { Component } from 'react';

import GridLayout from 'react-grid-layout';

import {
  getGrid as getGridFromLocalStorage,
  saveGrid as saveGridToLocalStorage,
} from '../../../utils/local-storage';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export default class Grid extends Component {
  static defaultProps = {
    className: 'layout',
    cols: 12,
    rowHeight: 30,
    width: 1200,
    onLayoutChange: () => {},
  };

  state = {
    layout: [
      { i: 'a', x: 0, y: 0, w: 1, h: 2 },
      { i: 'b', x: 1, y: 0, w: 3, h: 2 },
      { i: 'c', x: 4, y: 0, w: 1, h: 2 },
    ],
  };

  constructor(props) {
    super(props);

    let originalLayout = getGridFromLocalStorage('layout') || [];
    if (originalLayout.length > 0) {
      this.state = {
        layout: JSON.parse(JSON.stringify(originalLayout)),
      };
    }

    this.onLayoutChange = this.onLayoutChange.bind(this);
  }

  onLayoutChange(layout) {
    saveGridToLocalStorage('layout', layout);
    this.setState({ layout });
    this.props.onLayoutChange(layout);
  }

  render() {
    // console.log(this.state.layout);
    return (
      <GridLayout
        className='layout'
        {...this.props}
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
      >
        {this.state.layout.map((item) => {
          return (
            <div key={item.i} className='chart-container'>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0',
                }}
              >
                {item.i}
              </div>
            </div>
          );
        })}
      </GridLayout>
    );
  }
}
