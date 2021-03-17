import React, { useState, useEffect, useRef } from 'react';
import Backdrop from '../components/backdrop/Backdrop';
import { v4 as uuid } from 'uuid';

import { useApi } from '../hooks/context/ApiContext';
import { ACTIONS, INTERPRETERS } from '../hooks/store/constants';

import ViewsGrid from '../components/views/ViewsGrid';
import AddNewView from '../components/views/AddNewView';

export default function Agent({ match }) {
  const [creating, setCreating] = useState(false);
  const [data, setData] = useState([]);
  const { interpret, dispatch, fetchData } = useApi();
  const { agentId } = match.params;

  let timeout; // TODO make a timeout hook for updating all data
  const mounted = useRef(false);

  const { name, tags, dataSources, views } = interpret({
    type: INTERPRETERS.GET_AGENT,
    params: {
      agentId: agentId,
    },
  });

  async function updateData() {
    if (views.length > 0 && mounted) {
      const newData = await fetchData(agentId, dataSources[0].publicId);
      setData(newData);
      console.log(newData);
    }
  }

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  });

  useEffect(
    () =>
      (timeout = setTimeout(() => {
        updateData();
      }, 10000)),
    [data]
  );

  function startCreateView() {
    setCreating(true);
  }

  function createViewHandler(viewName, dataSourceId, tagId, type) {
    console.log({ viewName, dataSourceId, tagId, type });

    let viewId = uuid();
    dispatch({
      type: ACTIONS.ADD_VIEW,
      payload: {
        agentId,
        view: {
          id: viewId,
          name: viewName,
          dataSourceId,
          tagsIds: [tagId],
          signals: [],
          settings: {
            type,
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

    setCreating(false);
  }

  function onLayoutChangeHandler(layout) {
    dispatch({
      type: ACTIONS.UPDATE_LAYOUT,
      payload: {
        agentId,
        layout,
      },
    });

    if (timeout) {
      clearTimeout(timeout);
    }
    updateData();
  }

  return (
    <>
      {creating && (
        <>
          <Backdrop />
          <AddNewView
            tags={tags}
            dataSources={dataSources}
            createViewHandler={createViewHandler}
          />
        </>
      )}
      <div className='agent-bar'>
        <h3>{name}</h3>
        <button onClick={startCreateView}>+ Add view</button>
      </div>
      <ViewsGrid
        views={views}
        data={data}
        onLayoutChangeHandler={onLayoutChangeHandler}
      />
    </>
  );
}
