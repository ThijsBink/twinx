import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import { useApi } from '../hooks/context/ApiContext';
import { ACTIONS, INTERPRETERS } from '../hooks/store/constants';

import Backdrop from '../components/backdrop/Backdrop';
import ViewsGrid from '../components/views/ViewsGrid';
import Modal from '../components/modal/Modal';

// import logger from '../utils/logger';
// const log = logger('AGENT');

export default function Agent({
  match: {
    params: { agentId },
  },
}) {
  const [creating, setCreating] = useState(false);
  const [data, setData] = useState([]);
  const { interpret, dispatch, fetchData } = useApi();
  const interval = useRef(null);
  const agent = interpret({
    type: INTERPRETERS.GET_AGENT,
    params: {
      agentId,
    },
  });
  const viewRef = {
    name: useRef(),
    dataSource: useRef(),
    tagId: useRef(),
    type: useRef(),
  };

  // log('ON RENDER', agent.views.length);

  async function updateData() {
    if (agent.views.length > 0) {
      // log('ON UPDATE', agent.views.length);
      const newData = await fetchData(agent);
      if (interval) {
        setData(newData);
      }
      // log(newData);
    }
  }

  function createInterval() {
    updateData();
    clearInterval(interval.current);
    // log('CLEARED INTERVAL', interval.current);
    interval.current = setInterval(() => {
      updateData();
      // log('UPDATING FROM INTERVAL');
    }, 10000);
    // log('CREATED INTERVAL', interval.current);
  }

  useEffect(() => createInterval(), [agent.views.length]);

  useEffect(() => {
    return () => {
      // log('CLOSED');
      clearInterval(interval.current);
      interval.current = null;
      // log('CLEARED INTERVAL AT CLOSE', interval.current);
    };
  }, []);

  const startCreateView = () => setCreating(true);
  const cancelCreateView = () => setCreating(false);

  function createViewHandler() {
    const viewId = uuid();
    dispatch({
      type: ACTIONS.ADD_VIEW,
      payload: {
        agentId: agent.publicId,
        view: {
          id: viewId,
          name: viewRef.name.current.value,
          dataSourceId: viewRef.dataSource.current.value,
          tagsIds: [viewRef.tagId.current.value],
          signals: [],
          settings: {
            type: viewRef.type.current.value,
            stroke: '#8884d8',
            background: '#e2f3e3',
            dataGrid: {
              i: viewId,
              x: 0,
              y: 100,
              w: 10,
              h: 8,
            },
          },
        },
      },
    });

    cancelCreateView();
  }

  function onLayoutChangeHandler(layout) {
    dispatch({
      type: ACTIONS.UPDATE_LAYOUT,
      payload: {
        agentId: agent.publicId,
        layout,
      },
    });
  }

  return (
    <>
      {creating && (
        <>
          <Backdrop />
          <Modal
            title='Create view'
            canCancel
            onCancel={cancelCreateView}
            canConfirm
            onConfirm={createViewHandler}
          >
            <form className='add-new-view-form'>
              <div className='selections'>
                <div>
                  <h4>Name</h4>
                  <input type='text' ref={viewRef.name} />
                </div>
                <div>
                  <h4>Data Source</h4>
                  <select name='data-source' ref={viewRef.dataSource}>
                    {agent.dataSources.map((dataSource) => (
                      <option
                        key={dataSource.publicId}
                        value={dataSource.publicId}
                      >
                        {dataSource.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <h4>Tag</h4>
                  <select name='tag' ref={viewRef.tagId}>
                    {agent.tags.map((tag) => (
                      <option key={tag.publicId} value={tag.publicId}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <h4>Type</h4>
                  <select name='type' ref={viewRef.type}>
                    <option value='chart'>Chart</option>
                  </select>
                </div>
              </div>
            </form>
          </Modal>
        </>
      )}
      <div className='agent-bar'>
        <h3>{agent.name}</h3>
        <button onClick={startCreateView}>+ Add view</button>
      </div>
      <ViewsGrid
        views={agent.views}
        data={data}
        onLayoutChangeHandler={onLayoutChangeHandler}
      />
    </>
  );
}
