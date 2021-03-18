import axios from 'axios';

import logger from '../utils/logger';
const log = logger('API');

const instance = axios.create({
  baseURL: 'https://api.ayayot.com/',
  headers: {
    'Api-Version': 2,
  },
});

// TODO set expirations on auth and ws token
export function initializeIxon(encodedAuth, applicationId = 'UUdjNNsZ3Sn1') {
  return instance({
    method: 'post',
    url: '/access-tokens?fields=secretId',
    headers: {
      'Api-Application': applicationId,
      Authorization: `Basic ${encodedAuth}`,
      'Content-Type': 'application/json',
    },
    data: { expiresIn: 3600 },
  }).then((res) => {
    const token = res.data.data.secretId;
    return ixon(token, applicationId);
  });
}

function ixon(token, applicationId) {
  const requestCompanies = () =>
    instance({
      method: 'get',
      url: '/companies?fields=publicId,name',
      headers: {
        'Api-Application': applicationId,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      return res.data.data;
    });

  const requestAgents = (companyId) =>
    instance({
      method: 'get',
      url: '/agents?fields=publicId,name,deviceId',
      headers: {
        'Api-Application': applicationId,
        Authorization: `Bearer ${token}`,
        'Api-Company': companyId,
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      return res.data.data;
    });

  const requestTags = (companyId, agentId) =>
    instance({
      method: 'get',
      url: `agents/${agentId}/data-tags?fields=publicId,name,tagId,variable.type`,
      headers: {
        'Api-Application': applicationId,
        Authorization: `Bearer ${token}`,
        'Api-Company': companyId,
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      // log(res.data.data);
      return res.data.data;
    });

  const requestDataSources = (companyId, agentId) =>
    instance({
      method: 'get',
      url: `agents/${agentId}/data-sources`,
      headers: {
        'Api-Application': applicationId,
        Authorization: `Bearer ${token}`,
        'Api-Company': companyId,
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      return res.data.data;
    });

  const requestData = (
    companyId,
    tags,
    sourceId,
    limit = 0,
    offset = 0
    // start = '2021-02-02T00:00:00+00:00',
    // end = '2021-02-02T23:59:59+00:00',
    // timeZone = 'CET'
  ) =>
    instance({
      method: 'post',
      url: `/data`,
      headers: {
        'Api-Application': applicationId,
        Authorization: `Bearer ${token}`,
        'Api-Company': companyId,
        'Content-Type': 'application/json',
      },
      data: [
        {
          source: {
            publicId: sourceId,
          },
          tags: tags.map((tag) => ({
            id: tag.tagId,
            preAggr: 'raw',
            queries: [
              {
                ref: tag.publicId, // TODO maybe put calculationId or something useful here
                limit,
                offset,
              },
            ],
          })),
          // start,
          // end,
          // timeZone,
        },
      ],
    }).then((res) => {
      log(res.data.data);
      return res.data.data;
    });

  return {
    requestCompanies,
    requestAgents,
    requestTags,
    requestDataSources,
    requestData,
  };
}
