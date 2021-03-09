const makeRequest = (params, resParams, apiVersion = '2') => {
  let URL = 'https://api.ayayot.com/';

  if (params.hasOwnProperty('location')) {
    URL += params['location'];
    if (params.hasOwnProperty('fields') && params['fields'].length > 0) {
      // URL += ('?fields=' + params['fields'].map((f) => f + ',')).slice(0, -1);
      URL += '?fields=' + params['fields'].map((f) => f);
    }
    // else if (params.hasOwnProperty('data')) {
    //   URL += '/data';
    // }
  }

  let options = {
    headers: {
      'Api-Version': apiVersion,
    },
    method: 'GET',
  };

  if (params.hasOwnProperty('headers')) {
    options.headers = {
      ...options.headers,
      ...params['headers'],
    };
  }

  if (params.hasOwnProperty('body')) {
    options = {
      ...options,
      method: 'POST',
      body: JSON.stringify(params['body']),
    };
    // options.method = 'POST';
    // options.body = JSON.stringify(params['body']);
  }

  console.log(URL);
  console.log(options);

  return fetch(URL, options)
    .then((res) => {
      console.log(res);
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then((resData) => {
      console.log(resData.data);
      return resParams.length > 0
        ? resParams.map((p) => resData.data[p])
        : resData.data;
    })
    .catch((err) => console.log(err));
};

exports.getAccessToken = (applicationId, encodedAuth) =>
  makeRequest(
    {
      location: 'access-tokens',
      fields: ['secretId'],
      headers: {
        'Api-Application': applicationId,
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedAuth}`,
      },
      body: {
        expiresIn: 3600,
      },
    },
    ['secretId']
  );

exports.requestCompaniesList = (applicationId, token) =>
  makeRequest(
    {
      location: 'companies',
      fields: ['publicId', 'name'],
      headers: {
        'Api-Application': applicationId,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    [] // !
  );

exports.requestAgentsList = (applicationId, token, companyId) =>
  makeRequest(
    {
      location: 'agents',
      fields: ['publicId', 'name'],
      headers: {
        'Api-Application': applicationId,
        'Api-Company': companyId,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    [] // !
  );

exports.requestRolesList = (applicationId, token, companyId) =>
  makeRequest(
    {
      location: 'roles',
      fields: ['publicId', 'name'],
      headers: {
        'Api-Application': applicationId,
        'Api-Company': companyId,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    [] // !
  );

exports.requestGroupList = (applicationId, token, companyId) =>
  makeRequest(
    {
      location: 'groups',
      fields: ['publicId', 'name'],
      headers: {
        'Api-Application': applicationId,
        'Api-Company': companyId,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    [] // !
  );

exports.requestUsersList = (applicationId, token, companyId) =>
  makeRequest(
    {
      location: 'users',
      headers: {
        'Api-Application': applicationId,
        'Api-Company': companyId,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    [] // !
  );

exports.getUserCompany = (applicationId, token) =>
  makeRequest(
    {
      location: 'companies',
      fields: ['publicId', 'name'],
      headers: {
        'Api-Application': applicationId,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    [] // !
  );

exports.getTagsList = (applicationId, token, companyId, agentId) =>
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
  );

exports.getDataSources = (applicationId, token, companyId, agentId) =>
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
  );

exports.getData = (applicationId, token, companyId, sourceId, tags) =>
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
          tags: tags.map((tag) => ({
            id: tag.id,
            preAggr: 'raw',
            queries: [
              {
                ref: tag.name,
                limit: 10,
                offset: 0,
              },
            ],
          })),
          // [
          //   {
          //     id: 16,
          //     preAggr: 'raw',
          //     queries: [
          //       {
          //         ref: 'hello',
          //         limit: 10,
          //         offset: 0,
          //       },
          //     ],
          //   },
          // ],
          // start:
          //   '{{start timestamp of measurements format: 2021-01-14T11:00:00+00:00}}',
          // end:
          //   '{{end timestamp of measurements format: 2021-01-14T12:59:59+00:00}}',
          // timeZone: 'utc',
        },
      ],
    },
    [] // !
  );

exports.getWSToken = (applicationId, token, companyId, agentId) =>
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
  );

exports.startLiveData = (wsToken, agentId) => {
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
};

//TODO get current data for agents
