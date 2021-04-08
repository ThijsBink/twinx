import { useReducer, useEffect } from 'react';
import useLocalStorage from '../local-storage/useLocalStorage';
// import logger from '../../utils/logger';

import { ACTIONS, INTERPRETERS } from './constants';

/*=========== STORE ===========
{
    companies: [
        {
            publicId: string
            name: string
        }
    ]
    agents: [
        {
            publicId: string
            name: string
            companyId: string
            tags: [
                {
                    publicId: string
                    name: string
                    tagId: int
                    sourceId: string
                }
            ]
            layout: [
                {
                    i: string
                    x: int
                    y: int
                    w: int
                    h: int
                }
            ]
        }
    ]
    views: [
        {
            agentId: string
            id: string
            name: string
            color: color
            timeUnit: minute / hour / day / week / month
            timeTicks: int
            formula: string
            formulaGraph: {...}
            tagIdsList: [int]
            signal: {
                type: bool
                threshold: float
            }
        }
    ]
}*/

function reducer(state, action) {
  // const log = logger('REDUCER');
  // log(action.type, action.payload);
  switch (action.type) {
    case ACTIONS.ADD_COMPANIES:
      return {
        ...state,
        companies: action.payload,
      };

    case ACTIONS.ADD_AGENTS:
      return {
        ...state,
        agents: action.payload,
      };

    case ACTIONS.ADD_VIEW:
      return {
        ...state,
        views: [...state.views, action.payload.view],
      };

    case ACTIONS.EDIT_VIEW:
      return {
        ...state,
        views: state.views.map((view) =>
          view.id === action.payload.viewId
            ? {
                ...view,
                ...action.payload.viewParams,
              }
            : view
        ),
      };

    case ACTIONS.DELETE_VIEW:
      return {
        ...state,
        views: state.views.filter((view) => view.id !== action.payload.viewId),
      };

    case ACTIONS.EDIT_SIGNAL:
      return {
        ...state,
        views: state.views.map((view) =>
          view.id === action.payload.viewId
            ? {
                ...view,
                signal: action.payload.signal,
              }
            : view
        ),
      };

    case ACTIONS.UPDATE_LAYOUT:
      return {
        ...state,
        agents: state.agents.map((agent) => ({
          ...agent,
          layout:
            agent.publicId === action.payload.agentId
              ? action.payload.layout
              : agent.layout,
        })),
      };

    default:
      return state;
  }
}

export default function useStore(initialValue) {
  const [localStore, setLocalStore] = useLocalStorage(
    'aquasol:store',
    initialValue
  );
  const [state, dispatch] = useReducer(reducer, localStore);

  useEffect(() => {
    setLocalStore(state);
  }, [state, setLocalStore]);

  function interpret(interpreter) {
    // const log = logger('INTERPRET');
    // log(interpreter);
    switch (interpreter.type) {
      case INTERPRETERS.GET_COMPANIES:
        return state.companies;

      case INTERPRETERS.GET_AGENTS:
        return state.agents;

      case INTERPRETERS.GET_AGENT:
        return state.agents.find(
          (agent) => agent.publicId === interpreter.params.agentId
        );

      case INTERPRETERS.GET_AGENT_VIEWS:
        return state.views.filter(
          (view) => view.agentId === interpreter.params.agentId
        );

      case INTERPRETERS.GET_SIGNALING_VIEWS:
        return state.views.filter((view) => view.signal.type !== 'none');

      default:
        return state;
    }
  }

  return {
    isSaved: state.agents.length > 0,
    interpret,
    dispatch,
  };
}
