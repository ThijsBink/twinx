import { useState, useEffect, useRef, useCallback } from 'react';

import { v4 as uuid } from 'uuid';
import { useApi } from '../hooks/context/ApiContext';
import { ACTIONS, INTERPRETERS } from '../hooks/store/constants';

import ViewsGrid from '../components/views/ViewsGrid';
import EditView from '../components/forms/EditView';
import EditSignal from '../components/forms/EditSignal';

import { solve } from '../utils/formula';
import QueueIcon from '@material-ui/icons/Queue';
import {
  Grid,
  Modal,
  Button,
  Snackbar,
  Container,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import logger from '../utils/logger';
const log = logger('AGENT');

export default function Agent({ match }) {
  const classes = useStyles();
  const [isCreating, setIsCreating] = useState(false);
  const [editingView, setEditingView] = useState(null);
  const [editingViewSignal, setEditingViewSignal] = useState(null);
  const [data, setData] = useState({});
  const { interpret, dispatch, client } = useApi();
  const interval = useRef(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const updateFetch = () => {
    setFetchTrigger((i) => i + 1);
    setData({});
  };

  const agent = interpret({
    type: INTERPRETERS.GET_AGENT,
    params: {
      agentId: match.params.agentId,
    },
  });

  const views = interpret({
    type: INTERPRETERS.GET_AGENT_VIEWS,
    params: {
      agentId: match.params.agentId,
    },
  })
    // Add values property to view
    .map((view) => ({
      ...view,
      values: Object.keys(data).length
        ? [
            ...solve(view.formulaGraph, {
              type: 'tag',
              func: (graph) => ({
                type: 'array',
                values: data[graph.id][view.timeUnit],
              }),
            }).values,
          ].reverse()
        : [],
    }));

  const updateData = useCallback(async () => {
    setIsError(false);
    try {
      if (views.length) {
        const newData = await client.requestAgentData(agent, views);
        if (interval) setData(newData);
      }
      setIsLoading(false);
    } catch (err) {
      log(err);
      setIsLoading(false);
      setIsError(true);
    }
  }, [fetchTrigger, client]);

  useEffect(() => {
    updateData();
    clearInterval(interval.current);
    interval.current = setInterval(() => {
      updateData();
    }, 60000);
  }, [updateData]);

  useEffect(() => {
    return () => {
      clearInterval(interval.current);
      interval.current = null;
    };
  }, []);

  function editView(viewParams) {
    if (isCreating) {
      dispatch({
        type: ACTIONS.ADD_VIEW,
        payload: {
          view: {
            ...viewParams,
            agentId: agent.publicId,
            id: uuid(),
            signal: { type: 'none', threshold: 0 },
          },
        },
      });
      setIsCreating(false);
    } else {
      dispatch({
        type: ACTIONS.EDIT_VIEW,
        payload: {
          viewId: editingView.id,
          viewParams,
        },
      });
      setEditingView(null);
    }
    updateFetch();
  }

  function deleteView(viewId) {
    dispatch({
      type: ACTIONS.DELETE_VIEW,
      payload: {
        agentId: agent.publicId,
        viewId,
      },
    });
    setEditingView(null);
  }

  function editSignal(type, threshold, viewId) {
    dispatch({
      type: ACTIONS.EDIT_SIGNAL,
      payload: {
        agentId: agent.publicId,
        viewId,
        signal: { type, threshold },
      },
    });
    setEditingViewSignal(null);
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

  const closeModalHandler = () => {
    setIsCreating(false);
    setEditingView(null);
  };

  return (
    <>
      <Container className={classes.container}>
        <Modal open={isCreating || !!editingView} onClose={closeModalHandler}>
          <EditView
            isCreating={isCreating}
            onConfirm={editView}
            onDelete={deleteView}
            tagList={agent.tags}
            view={editingView}
          />
        </Modal>

        <Modal
          open={!!editingViewSignal}
          onClose={() => setEditingViewSignal(null)}
        >
          <EditSignal onEdit={editSignal} view={editingViewSignal} />
        </Modal>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={isError}
          message='Some error occurred'
          autoHideDuration={8000}
          key='alert_message'
        />

        <Grid container direction='row' justify='space-between'>
          <Grid item>
            <Typography
              gutterBottom
              className={classes.title}
              variant='subtitle1'
            >
              {agent.name}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              onClick={() => setIsCreating(true)}
            >
              <QueueIcon />
            </Button>
          </Grid>
        </Grid>
        <Container className={classes.gridContainer}>
          {isLoading && !Object.keys(data).length ? (
            <LinearProgress />
          ) : (
            <ViewsGrid
              views={views}
              layout={agent.layout}
              onLayoutChangeHandler={onLayoutChangeHandler}
              onEditHandler={(v) => setEditingView(v)}
              onSignalHandler={(v) => setEditingViewSignal(v)}
            />
          )}
        </Container>
      </Container>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 0,
    margin: 0,
    maxWidth: '100vw',
  },
  gridContainer: {
    padding: 0,
    margin: 0,
    maxWidth: '100%',
  },
  button: {
    marginRight: theme.spacing(3),
    '&:hover': {
      color: theme.palette.success.main,
      // backgroundColor: theme.palette.primary.dark,
    },
  },
  title: {
    marginLeft: theme.spacing(3),
    textShadow: theme.shadows[5],
  },
}));
