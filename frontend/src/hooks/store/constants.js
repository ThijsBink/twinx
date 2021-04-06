export const ACTIONS = {
  ADD_COMPANIES: 'ADD_COMPANIES',
  /*
      payload: Companies;
  */

  ADD_AGENTS: 'ADD_AGENTS',
  /*
      payload: Agents;
  */

  ADD_VIEW: 'ADD_VIEW',
  /*
      payload: { agentId: string; view: View };
  */

  EDIT_VIEW: 'EDIT_VIEW',
  /*
      payload: { viewId: string, viewParams: ... };
  */

  DELETE_VIEW: 'DELETE_VIEW',
  /*
      payload: { viewId: string };
  */

  EDIT_SIGNAL: 'EDIT_SIGNAL',
  /*
      payload: { viewId: string; signal: Signal };
  */

  UPDATE_LAYOUT: 'UPDATE_LAYOUT',
  /*
     payload: { agentId: string; layout: Layout };
 */
};

export const INTERPRETERS = {
  GET_COMPANIES: 'GET_COMPANIES',

  GET_AGENTS: 'GET_AGENTS',

  GET_AGENT: 'GET_AGENT',
  /*
      params: { agentId: string };
  */

  GET_AGENT_VIEWS: 'GET_AGENT_VIEWS',
  /*
      params: { agentId: string };
  */

  GET_SIGNALING_VIEWS: 'GET_SIGNALING_VIEWS',

  GET_AGENT_USED_TAGS: 'GET_AGENT_USED_TAGS',
  /*
      params: { agentId: string };
  */

  GET_SIGNALS_USED_TAGS: 'GET_SIGNALS_USED_TAGS',
};
