import React, { Component } from 'react';

import ApiContext from '../context/apiContext';

import {
  requestCompaniesList,
  requestAgentsList,
  requestRolesList,
  requestGroupList,
  requestUsersList,
  getUserCompany,
  getTagsList,
  getDataSources,
  getData,
  getWSToken,
  //   startLiveData,
} from '../api/endpoints';

export default class Api extends Component {
  static contextType = ApiContext;

  state = {
    endpoints: [
      {
        name: 'requestCompaniesList',
        f: requestCompaniesList,
        params: [this.context.applicationId, this.context.token],
      },
      {
        name: 'requestAgentsList',
        f: requestAgentsList,
        params: [
          this.context.applicationId,
          this.context.token,
          this.context.companyId,
        ],
      },
      {
        name: 'requestRolesList',
        f: requestRolesList,
        params: [
          this.context.applicationId,
          this.context.token,
          this.context.companyId,
        ],
      },
      {
        name: 'requestGroupList',
        f: requestGroupList,
        params: [
          this.context.applicationId,
          this.context.token,
          this.context.companyId,
        ],
      },
      {
        name: 'requestUsersList',
        f: requestUsersList,
        params: [
          this.context.applicationId,
          this.context.token,
          this.context.companyId,
        ],
      },
      {
        name: 'getUserCompany',
        f: getUserCompany,
        params: [this.context.applicationId, this.context.token],
      },
      {
        name: 'getTagsList',
        f: getTagsList,
        params: [
          this.context.applicationId,
          this.context.token,
          this.context.companyId,
          'YYU9A91jDGeb',
        ],
      },
      {
        name: 'getDataSources',
        f: getDataSources,
        params: [
          this.context.applicationId,
          this.context.token,
          this.context.companyId,
          'YYU9A91jDGeb',
        ],
      },
      {
        name: 'getData',
        f: getData,
        params: [
          this.context.applicationId,
          this.context.token,
          this.context.companyId,
          'NiITSFLAX31x',
        ],
      },
      {
        name: 'getWSToken',
        f: getWSToken,
        params: [
          this.context.applicationId,
          this.context.token,
          this.context.companyId,
          'YYU9A91jDGeb',
        ],
      },
      //   {
      //     name: 'startLiveData',
      //     f: startLiveData,
      //     params: [this.context.applicationId],
      //   },
    ],
  };

  render() {
    return (
      <>
        <h1>API</h1>
        {this.state.endpoints.map((ep) => {
          return (
            <button
              onClick={() => {
                ep.f(...ep.params);
              }}
            >
              {ep.name}
            </button>
          );
        })}
      </>
    );
  }
}
