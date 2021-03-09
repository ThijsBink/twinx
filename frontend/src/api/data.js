import makeRequest from './boilerplate';

exports = {
  getTagsList: (applicationId, token, companyId, agentId) =>
    makeRequest(
      {
        location: `agents/${agentId}/data-tags`,
        fields: ['publicId', 'name', 'tagId'],
        headers: {
          'Api-Application': applicationId,
          'Api-Company': companyId,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      [] // !
    ),

  getDataSources: (applicationId, token, companyId, agentId) =>
    makeRequest(
      {
        location: `agents/${agentId}/data-sources`,
        fields: ['publicId', 'name', 'ipAddress'],
        headers: {
          'Api-Application': applicationId,
          'Api-Company': companyId,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      [] // !
    ),

  getData: (applicationId, token, companyId, sourceId, tags) =>
    makeRequest(
      {
        location: `/data`,
        headers: {
          'Api-Application': applicationId,
          'Api-Company': companyId,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: [
          {
            source: { publicId: sourceId },
            tags: [
              {
                id: 24,
                preAggr: 'raw',
                queries: [
                  {
                    ref: 'hello',
                    limit: 100,
                    offset: 0,
                  },
                ],
              },
            ],
            // start:
            //   '{{start timestamp of measurements format: 2021-01-14T11:00:00+00:00}}',
            // end:
            //   '{{end timestamp of measurements format: 2021-01-14T12:59:59+00:00}}',
            // timeZone: 'utc',
          },
        ],
      },
      [] // !
    ),

  getWSToken: (applicationId, token, companyId, agentId) =>
    makeRequest(
      {
        location: 'auth-tokens/data',
        headers: {
          'Api-Application': applicationId,
          'Api-Company': companyId,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          expiresIn: 3600,
          agents: [{ publicId: agentId }],
        },
      },
      ['secretId'] // !
    ),

  startLiveData: (wsToken, agentId) => {
    let wsUri = `wss://wse.mdr.ams.dkn.ayayot.com/agents/${agentId},/data-realtime`;

    let ws = new WebSocket(wsUri);
    ws.onopen = function (e) {
      console.log('CONNECTED');
      ws.send(`Authorization: ${wsToken}`);
    };
    ws.onclose = function (e) {
      console.log('DISCONNECTED');
    };
    ws.onmessage = function (e) {
      console.log('RESPONSE', e.data);
    };
    ws.onerror = function (e) {
      console.log('ERROR', e);
    };
  },
};
