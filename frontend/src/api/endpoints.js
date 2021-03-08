const GET_REQ = 'GET';
const POST_REQ = 'POST';

const checkStatus = (res) => {
  if (res.status !== 200 && res.status !== 201) {
    throw new Error('Failed!');
  }
  return res.json();
};

// exports.requestEndpointsList = fetch('https://api.ayayot.com', {
//   method: GET_REQ,
//   headers: {
//     'Api-Version': '2',
//   },
// })
// .then((res) => checkStatus(res))
// .then((resData) => console.log(resData.data))
// .catch((err) => console.log(err));

exports.getAccessToken = (applicationId, encodedAuth) =>
  fetch(`https://api.ayayot.com:443/access-tokens?fields=secretId`, {
    method: POST_REQ,
    headers: {
      'Api-Version': '2',
      'Api-Application': applicationId,
      'Content-Type': 'application/json',
      Authorization: `Basic ${encodedAuth}`,
    },
    body: JSON.stringify({ expiresIn: 3600 }),
  })
    .then((res) => checkStatus(res))
    .then((resData) => {
      console.log(resData);
      if (resData.status === 'success') {
        return resData.data.secretId;
      } else {
        console.log('Unauthorized');
      }
    })
    .catch((err) => console.log(err));

exports.requestCompaniesList = (applicationId, token) => {
  fetch('https://api.ayayot.com/companies?fields=publicId,name', {
    method: GET_REQ,
    headers: {
      'Api-Version': '2',
      'Api-Application': applicationId,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => checkStatus(res))
    .then((resData) => console.log(resData.data))
    .catch((error) => console.log('error', error));
};

exports.requestAgentsList = (applicationId, token, companyId) =>
  fetch('https://api.ayayot.com/agents?fields=publicId,name', {
    method: GET_REQ,
    headers: {
      'Api-Version': '2',
      'Api-Application': applicationId,
      'Api-Company': companyId,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => checkStatus(res))
    .then((resData) => console.log(resData.data))
    .catch((error) => console.log('error', error));

exports.requestRolesList = (applicationId, token, companyId) =>
  fetch('https://api.ayayot.com/roles?fields=publicId,name', {
    method: GET_REQ,
    headers: {
      'Api-Version': '2',
      'Api-Application': applicationId,
      'Api-Company': companyId,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => checkStatus(res))
    .then((resData) => console.log(resData.data))
    .catch((error) => console.log('error', error));

exports.requestGroupList = (applicationId, token, companyId) =>
  fetch('https://api.ayayot.com/groups?fields=publicId,name', {
    method: GET_REQ,
    headers: {
      'Api-Version': '2',
      'Api-Application': applicationId,
      'Api-Company': companyId,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => checkStatus(res))
    .then((resData) => console.log(resData.data))
    .catch((error) => console.log('error', error));

exports.requestUsersList = (applicationId, token, companyId) =>
  fetch('https://api.ayayot.com/users', {
    method: GET_REQ,
    headers: {
      'Api-Version': '2',
      'Api-Application': applicationId,
      'Api-Company': companyId,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => checkStatus(res))
    .then((resData) => console.log(resData.data))
    .catch((error) => console.log('error', error));

exports.requestData = (applicationId, token, companyId) =>
  fetch('https://api.ayayot.com/users', {
    method: GET_REQ,
    headers: {
      'Api-Version': '2',
      'Api-Application': applicationId,
      'Api-Company': companyId,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => checkStatus(res))
    .then((resData) => console.log(resData.data))
    .catch((error) => console.log('error', error));

exports.getWSToken = (applicationId, token, companyId) =>
  fetch('https://api.ayayot.com/auth-tokens/data', {
    method: POST_REQ,
    headers: {
      'Api-Version': '2',
      'Api-Application': applicationId,
      'Api-Company': companyId,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      expiresIn: 3600,
      agents: [{ publicId: 'YYU9A91jDGeb' }],
    }),
  })
    .then((res) => checkStatus(res))
    .then((resData) => {
      console.log(resData.data.secretId);
    })
    .catch((error) => console.log('error', error));

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

//TODO get tags list
exports.getTagsList = (token) =>
  fetch('https://api.ayayot.com/users', {
    method: GET_REQ,
    headers: {
      'Api-Version': '2',
      // 'Api-Application': applicationId,
      // 'Api-Company': companyId,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => checkStatus(res))
    .then((resData) => console.log(resData.data))
    .catch((error) => console.log('error', error));

//TODO get current data for agents
//TODO
