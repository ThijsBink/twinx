import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import { useApi } from '../hooks/context/ApiContext';
import { ACTIONS, INTERPRETERS } from '../hooks/store/constants';

import ViewsGrid from '../components/views/ViewsGrid';
import EditViewModal from '../components/modal/EditViewModal';
import EditSignalModal from '../components/modal/EditSignalModal';

import logger from '../utils/logger';
const log = logger('AGENT');

export default function Agent({
  match: {
    params: { agentId },
  },
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingView, setEditingView] = useState(false);
  const [isSignal, setIsSignal] = useState(false);
  const [data, setData] = useState([]);
  const { interpret, dispatch, fetchData } = useApi();
  const interval = useRef(null);
  const agent = interpret({
    type: INTERPRETERS.GET_AGENT,
    params: {
      agentId,
    },
  });

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
    }, 60000); // ! One minute interval
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

  function createView(name, color, dataSourceId, tagId, hours) {
    log('CREATING VIEW', { name, color, dataSourceId, tagId, hours });
    const viewId = uuid();
    dispatch({
      type: ACTIONS.ADD_VIEW,
      payload: {
        agentId: agent.publicId,
        view: {
          id: viewId,
          name,
          color,
          dataSourceId,
          tagsIds: [tagId],
          signals: [],
          hours,
          dataGrid: {
            i: viewId,
            x: 0,
            y: 100,
            w: 10,
            h: 8,
          },
        },
      },
    });
    setIsCreating(false);
  }

  function editView(name, color, dataSource, tag, hours) {
    log('EDITING VIEW', { name, color, dataSource, tag, hours });
    // const viewId = uuid();
    // dispatch({
    //   type: ACTIONS.ADD_VIEW,
    //   payload: {
    //     agentId: agent.publicId,
    //     view: {
    //       id: viewId,
    //       name,
    //       color,
    //       dataSourceId: dataSource.publicId,
    //       tagsIds: [tag],
    //       signals: [],
    //       hours,
    //       dataGrid: {
    //         i: viewId,
    //         x: 0,
    //         y: 100,
    //         w: 10,
    //         h: 8,
    //       },
    //     },
    //   },
    // });
    // setIsEditing(false);
    setEditingView(null);
  }

  // function onEditHandler(view) {

  // }

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
      {isCreating && (
        <EditViewModal
          isCreate
          onCancel={() => setIsCreating(false)}
          onConfirm={createView}
          tagList={agent.tags}
          dataSourceList={agent.dataSources}
        />
      )}
      {editingView && (
        <EditViewModal
          onCancel={() => setEditingView(null)}
          onConfirm={editView}
          tagList={agent.tags}
          dataSourceList={agent.dataSources}
          view={editingView}
        />
      )}
      {isSignal && (
        <EditSignalModal
          onCancel={() => setIsSignal(false)}
          onConfirm={() => setIsSignal(false)}
        />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginRight: '1rem',
          marginLeft: '1rem',
        }}
      >
        <h3>{agent.name}</h3>
        <button onClick={() => setIsCreating(true)}>+ Add view</button>
      </div>
      <ViewsGrid
        views={agent.views}
        data={data}
        onLayoutChangeHandler={onLayoutChangeHandler}
        onEditHandler={(v) => setEditingView(v)}
        onSignalHandler={() => setIsSignal(true)}
        // onEditHandler={onEditHandler}
      />
    </>
  );
}
