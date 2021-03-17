let i = 0;
export const ACTIONS = {
  ADD_COMPANIES: ++i,
  /*
      companies: [
        {
          publicId: string
          name: string
        }
      ]
  */

  ADD_AGENTS: ++i,
  /*
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
          }
        ]
  */

  ADD_VIEW: ++i,
  /*
      agentId: string
      view: {
          id: string
          name: string
          dataSourceId: string
          formula: string
          tagIds: [int]
          settings: {
            type: enum['line' / 'bar' / 'area' / 'single' / ...]
            color: color
            background: color
            brush: bool
          }
        }
      ]
  */

  DELETE_VIEW: ++i,
  /*
      agentId: string
      viewId: string
  */

  ADD_SIGNAL: ++i,
  /*
      agentId: string
      viewId: string
      signal: {
        id: string
        greaterThan: bool
        threshold: float
      }
  */

  DELETE_SIGNAL: ++i,
  /*
      agentId: string
      viewId: string
      signalId: string
  */

  UPDATE_LAYOUT: ++i,
  /*
     agentId: string
     layout: [
       {
         viewId: string
         dataGrid: {...}
       }
     ]
 */
};

export const INTERPRETERS = {
  GET_COMPANIES: ++i,
  /*
      >>>
      companies: [...]
  */

  GET_AGENTS: ++i,
  /*
      >>>
      agents: [...]
  */

  GET_AGENT: ++i,
  /*
      <<<
      agentId

      >>>
      agents: [...]
  */

  GET_COMPANY_AGENTS: ++i,
  /*
      <<<
      companyId

      >>>
      agents: [...]
  */

  GET_AGENT_VIEWS: ++i,
  /*
      <<<
      agentId

      >>>
      views: [...]
  */

  GET_SIGNALLING_VIEWS: ++i,
  /*
      >>>
      views: [...]
  */

  GET_AGENT_TAGS: ++i,
  /*
      <<<
      agentId

      >>>
      tags: [...]
  */

  GET_AGENT_SIGNALS_TAGS: ++i,
  /*
      <<<
      agentId

      >>>
      tags: [...]
  */

  GET_AGENT_USED_TAGS: ++i,
  /*
      <<<
      agentId

      >>>
      tags: [...]
  */

  GET_BATCH_REQUEST_PARAMS_FOR_AGENT: ++i,
  /*
      <<<
      agentId

      >>>
      tags: {
        dataSourceId
      }
  */
};
