import React from 'react';

import RGL, { WidthProvider } from 'react-grid-layout';
import View from './View';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './ViewsGrid.css';

const ReactGridLayout = WidthProvider(RGL);

export default function ViewsGrid({ views, data, onLayoutChangeHandler }) {
  const layout = views.map((view) => view.settings.dataGrid);

  function onLayoutChange(layout) {
    onLayoutChangeHandler(
      layout.map((dataGrid) => {
        const { i, x, y, w, h } = dataGrid;
        return {
          viewId: i,
          dataGrid: { i, x, y, w, h },
        };
      })
    );
  }

  return (
    <ReactGridLayout
      cols={20}
      rowHeight={30}
      className='layout'
      layout={layout}
      onLayoutChange={onLayoutChange}
    >
      {views.map((view) => (
        <div className='view-container' key={view.id}>
          <div
            className='view-item'
            // onMouseDown={(e) => e.stopPropagation()}
          >
            <View name={view.name} data={data[view.tagsIds[0]]} />{' '}
            {
              //TODO
            }
          </div>
        </div>
      ))}
    </ReactGridLayout>
  );
}