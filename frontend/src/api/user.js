import makeRequest from './boilerplate';

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
