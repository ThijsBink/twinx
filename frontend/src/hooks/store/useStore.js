import { useReducer, useEffect } from 'react';
import useLocalStorage from '../local-storage/useLocalStorage';

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
            dataSources: [
              {
                publicId: string
                name: string
              }
            ]
            tags: [
                {
                    publicId: string
                    name: string
                    tagId: int
                    type: string
                }
            ]
            views: [
                {
                    id: string
                    name: string
                    dataSourceId: string
                    formula: [string]
                    tagsIds: [int]
                    realTimeValue: float
                    signals: [
                        {
                            id: string
                            greaterThan: bool
                            threshold: float
                        }
                    ]
                    settings: {
                        type: enum['line' / 'bar' / 'area' / 'single' / ...]
                        color: color
                        background: color
                        dataGrid: {
                            i
                            x
                            y
                            w
                            h
                        }
                    }
                }
            ]
        }
    ]
}*/

function reducer(state, action) {
  console.log('DISPATCHED', action, 'to', state);
  switch (action.type) {
    case ACTIONS.ADD_COMPANIES:
      return {
        ...state,
        companies: action.payload.companies,
      };

    case ACTIONS.ADD_AGENTS:
      return {
        ...state,
        agents: action.payload.agents,
      };

    case ACTIONS.ADD_VIEW:
      return {
        ...state,
        agents: state.agents.map((agent) => ({
          ...agent,
          views:
            agent.publicId === action.payload.agentId
              ? [...agent.views, action.payload.view]
              : agent.views,
        })),
      };

    case ACTIONS.DELETE_VIEW:
      return {
        ...state,
        agents: state.agents.map((agent) => ({
          ...agent,
          views:
            agent.publicId === action.payload.agentId
              ? agent.views.filter((view) => view.id !== action.payload.viewId)
              : agent.views,
        })),
      };

    case ACTIONS.ADD_SIGNAL:
      return {
        ...state,
        agents: state.agents.map((agent) => ({
          ...agent,
          views:
            agent.publicId === action.payload.agentId
              ? agent.views.map((view) => ({
                  ...view,
                  signals:
                    view.id === action.payload.agentId
                      ? [...view.signals, action.payload.signal]
                      : view.signals,
                }))
              : agent.views,
        })),
      };

    case ACTIONS.DELETE_SIGNAL:
      return {
        ...state,
        agents: state.agents.map((agent) => ({
          ...agent,
          views:
            agent.publicId === action.payload.agentId
              ? agent.views.map((view) => ({
                  ...view,
                  signals:
                    view.id === action.payload.agentId
                      ? view.signals.filter(
                          (signal) => signal.id !== action.payload.signalId
                        )
                      : view.signals,
                }))
              : agent.views,
        })),
      };

    case ACTIONS.UPDATE_LAYOUT:
      return {
        ...state,
        agents: state.agents.map((agent) => ({
          ...agent,
          views:
            agent.publicId === action.payload.agentId
              ? agent.views.map((view) => ({
                  ...view,
                  settings: {
                    ...view.settings,
                    dataGrid: action.payload.layout.find(
                      (viewLayout) => viewLayout.viewId === view.id
                    ).dataGrid,
                  },
                }))
              : agent.views,
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
  }, [state]);

  function interpret(interpreter) {
    console.log('INTERPRET', state);
    switch (interpreter.type) {
      case INTERPRETERS.GET_COMPANIES:
        return state.companies;

      case INTERPRETERS.GET_AGENTS:
        return state.agents;

      case INTERPRETERS.GET_AGENT:
        return state.agents.find(
          (agent) => agent.publicId === interpreter.params.agentId
        );

      case INTERPRETERS.GET_COMPANY_AGENTS:
        return state.agents.find(
          (agent) => agent.companyId === interpreter.params.companyId
        );

      case INTERPRETERS.GET_AGENT_VIEWS:
        return state.agents.find(
          (agent) => agent.agentId === interpreter.params.agentId
        ).views;

      case INTERPRETERS.GET_SIGNALLING_VIEWS: {
        let views = [];
        state.agents.forEach((agent) =>
          agent.views.forEach((view) => {
            if (view.signals.length > 0) views.push(view);
          })
        );
        return views;
      }

      case INTERPRETERS.GET_AGENT_TAGS:
        return state.agents.find(
          (agent) => agent.publicId === interpreter.params.agentId
        ).tags;

      case INTERPRETERS.GET_AGENT_SIGNALS_TAGS: {
        let tags = [];
        const agent = state.agents.find(
          (agent) => agent.publicId === interpreter.params.agentId
        );
        agent.views.forEach((view) => {
          if (view.signals.length > 0) {
            view.tagsIds.forEach((tagId) => {
              if (!tags.find((tag) => tag.publicId === tagId)) {
                tags.push(
                  agent.tags.find((agentTag) => agentTag.publicId === tagId)
                );
              }
            });
          }
        });
        return tags;
      }

      case INTERPRETERS.GET_AGENT_USED_TAGS: {
        let tags = [];
        const agent = state.agents.find(
          (agent) => agent.publicId === interpreter.params.agentId
        );
        agent.views.forEach((view) => {
          view.tagsIds.forEach((tagId) => {
            if (!tags.find((tag) => tag.publicId === tagId)) {
              tags.push(
                agent.tags.find((agentTag) => agentTag.publicId === tagId)
              );
            }
          });
        });
        return tags;
      }

      case INTERPRETERS.GET_BATCH_REQUEST_PARAMS_FOR_AGENT: {
      }

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
