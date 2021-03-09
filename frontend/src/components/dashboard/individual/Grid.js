import React, { Component } from 'react';

import GridLayout from 'react-grid-layout';
import LineChart from './LineChart';

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
    layout: [],
  };

  constructor(props) {
    super(props);

    let originalLayout = getGridFromLocalStorage(props.agentId) || [];
    if (originalLayout.length > 0) {
      this.state = {
        layout: JSON.parse(JSON.stringify(originalLayout)),
      };
    } else {
      this.state = {
        layout: props.tags.map((tag) => ({
          i: tag.name,
          x: 0,
          y: tag.tagId,
          w: 4,
          h: 4,
        })),
      };
    }

    console.log(this.state);

    this.onLayoutChange = this.onLayoutChange.bind(this);
  }

  onLayoutChange(layout) {
    saveGridToLocalStorage(this.props.agentId, layout);
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
                <LineChart />
              </div>
            </div>
          );
        })}
      </GridLayout>
    );
  }
}
