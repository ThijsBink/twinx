import axios from 'axios';

import { formatFloat } from '../utils/numbers';
import moment from 'moment';

// import logger from '../utils/logger';
// const log = logger('API');

/**
 * Axios documentation: https://github.com/axios/axios
 * Ixon API documentation: https://developer.ixon.cloud/docs/how-to-use-the-apiv2
 */

const instance = axios.create({
  baseURL: 'https://api.ayayot.com/',
  headers: {
    'Api-Version': 2,
  },
});

/**
 * @param {*} encodedAuth - of form {Email:OTP:Password}, encrypted
 * @param {*} applicationId - need to ask ixon for it (see ixon documentation), set to 'UUdjNNsZ3Sn1' by default (given by Roy)
 * @returns
 */
export async function initializeIxon(
  encodedAuth,
  applicationId = 'UUdjNNsZ3Sn1'
) {
  const res = await instance({
    method: 'post',
    url: '/access-tokens?fields=secretId',
    headers: {
      'Api-Application': applicationId,
      Authorization: `Basic ${encodedAuth}`,
      'Content-Type': 'application/json',
    },
    data: { expiresIn: 100000 },
  });

  const token = res.data.data.secretId;
  return ixon(token, applicationId);
}

/**
 * Function returning promises used in application
 *
 * @param {*} token - bearer token
 * @param {*} applicationId
 * @returns
 */
function ixon(token, applicationId) {
  async function requestCompanies() {
    const res = await instance({
      method: 'get',
      url: '/companies?fields=publicId,name',
      headers: {
        'Api-Application': applicationId,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data.data;
  }

  async function requestAgents(companyId) {
    const res = await instance({
      method: 'get',
      url: '/agents?fields=publicId,name,deviceId',
      headers: {
        'Api-Application': applicationId,
        Authorization: `Bearer ${token}`,
        'Api-Company': companyId,
        'Content-Type': 'application/json',
      },
    });
    return res.data.data;
  }

  async function requestTags(companyId, agentId) {
    const res = await instance({
      method: 'get',
      url: `agents/${agentId}/data-tags?fields=publicId,name,tagId,source,variable.type`,
      headers: {
        'Api-Application': applicationId,
        Authorization: `Bearer ${token}`,
        'Api-Company': companyId,
        'Content-Type': 'application/json',
      },
    });
    return res.data.data;
  }

  /**
   * Fetching the agents (and their tags) by company
   *
   * @returns
   */
  async function requestCompaniesWithAgents() {
    const fetchedCompanies = await requestCompanies();

    let fetchedAgents = [];

    const companyAgentsList = await Promise.all(
      fetchedCompanies.map((company) => requestAgents(company.publicId))
    );
    companyAgentsList
      .map((companyAgents, i) =>
        companyAgents.map((agent) => ({
          ...agent,
          companyId: fetchedCompanies[i].publicId,
        }))
      )
      .forEach(
        (companyAgent) => (fetchedAgents = fetchedAgents.concat(companyAgent))
      );

    const agentTagsList = await Promise.all(
      fetchedAgents.map((agent) => requestTags(agent.companyId, agent.publicId))
    );
    agentTagsList.forEach(
      (agentTags, i) =>
        (fetchedAgents[i].tags = agentTags
          .filter((tag) => ['float', 'int'].includes(tag.variable.type))
          .map((tag) => ({
            name: tag.name,
            tagId: tag.tagId,
            publicId: tag.publicId,
            sourceId: tag.source.publicId,
          })))
    );

    return [fetchedCompanies, fetchedAgents];
  }

  /**
   * @param {*} agent
   * @param {*} views - the views belonging to the agent
   * @returns
   */
  async function requestAgentData(agent, views) {
    if (!views.length) return {};

    const currentTime = moment();
    let dataRequests = [];
    let refsByBatch = [];

    const sourcesIds = [
      ...agent.tags.reduce((acc, tag) => acc.add(tag.sourceId), new Set()),
    ];

    ['5*m', '15*m', '1*h', '4*h', '1*d', '1*w', '1*M'].forEach((timeBin) => {
      const [timeUnitPoints, timeUnit] = timeBin.split('*');

      // Pick all the views having the specific timeBin
      let viewsForTimeTick = views.filter((view) => view.timeUnit === timeBin);
      if (!viewsForTimeTick.length) return;

      // Start with the current time
      let i = 0;
      let endTime = currentTime.clone();
      let startTime = endTime
        .clone()
        .subtract(parseInt(timeUnitPoints), timeUnit);

      // Subtract the necessary number of ticks for the bin and add for each to the dataRequests array
      while (viewsForTimeTick.length) {
        sourcesIds.forEach((sourceId) => {
          const tagsForSource = agent.tags.filter(
            (tag) =>
              tag.sourceId === sourceId &&
              viewsForTimeTick.find((view) => {
                return view.tagIdsList.includes(tag.publicId);
              })
          );
          if (!tagsForSource.length) return;

          const refList = [];
          dataRequests.push({
            start: startTime.format(),
            end: endTime.format(),
            timezone: 'UTC',
            source: {
              publicId: sourceId,
            },
            tags: tagsForSource.map((tag) => {
              refList.push({
                tagId: tag.publicId,
                timeTick: timeBin,
                refIndex: i,
              });
              return {
                id: tag.tagId,
                preAggr: 'raw',
                queries: [
                  {
                    ref: `${tag.publicId}/${timeBin}/${i}`,
                    limit: 1,
                    offset: 0,
                  },
                ],
              };
            }),
          });
          refsByBatch.push(refList);
        });

        startTime.subtract(parseInt(timeUnitPoints), timeUnit);
        endTime.subtract(parseInt(timeUnitPoints), timeUnit);
        i++;
        viewsForTimeTick = viewsForTimeTick.filter(
          (view) => view.timeTicks > i
        );
      }
    });

    const res = await instance({
      method: 'post',
      url: `/data`,
      headers: {
        'Api-Application': applicationId,
        Authorization: `Bearer ${token}`,
        'Api-Company': agent.companyId,
        'Content-Type': 'application/json',
      },
      data: dataRequests,
    });

    let data = {};

    /**
     * Convert the data to a more useful format
     *   {
     *     [tagId]:
     *      [timeBin]: [{
     *                   val
     *                   time
     *                 }]
     *   }
     */
    res.data.data.forEach((dataBatch, i) => {
      const batchRef = refsByBatch[i];
      const { timeTick, refIndex } = batchRef[0];
      const [, timeBin] = timeTick.split('*');

      let formattedTime = moment(dataBatch.end);
      switch (timeBin) {
        case 'm':
          formattedTime = formattedTime.format('HH:mm');
          break;
        case 'h':
          formattedTime = formattedTime.format('DD/MM HH:mm');
          break;
        case 'd':
          formattedTime = formattedTime.format('DD/MM');
          break;
        case 'w':
          formattedTime = formattedTime.format('DD/MM');
          break;
        default:
          formattedTime = formattedTime.format('MM/YYYY');
      }

      batchRef.forEach(({ tagId }) => {
        if (refIndex === 0) {
          data[tagId] = {};
          data[tagId][timeTick] = [];
        }

        const ref = `${tagId}/${timeTick}/${refIndex}`;

        const point = dataBatch.points.find(
          (point) => point.values && point.values.hasOwnProperty(ref)
        );
        if (!point) return data[tagId][timeTick].push({ time: formattedTime });

        data[tagId][timeTick].push({
          time: formattedTime,
          value: formatFloat(point.values[ref]),
        });
      });
    });

    return data;
  }

  const convertLastValueTagQuery = (tag) => ({
    id: tag.tagId,
    preAggr: 'raw',
    queries: [
      {
        ref: tag.publicId,
        limit: 1,
        offset: 0,
      },
    ],
  });

  const requestsFromTags = (tags) =>
    tags.reduce(
      (acc, tag) =>
        acc.find((dr) => dr.source.publicId === tag.sourceId)
          ? acc.map(({ source, tags }) => ({
              source,
              tags:
                source.publicId === tag.sourceId
                  ? [...tags, convertLastValueTagQuery(tag)]
                  : tags,
            }))
          : [
              ...acc,
              {
                source: {
                  publicId: tag.sourceId,
                },
                tags: [convertLastValueTagQuery(tag)],
              },
            ],
      []
    );

  /**
   * Convert the data to a more useful format
   *   {
   *     tagId: [{
   *       val
   *       time
   *     }]
   *   }
   */
  const formatDataByTag = (fetchedData, tags) => {
    let data = {};
    tags.forEach((tag) => (data[tag.publicId] = []));
    fetchedData.forEach((dataBatch) =>
      dataBatch.points.forEach((point) =>
        Object.keys(point.values).forEach((tagId) =>
          data[tagId].push({
            // time: formatDate(point.time),
            value: formatFloat(point.values[tagId]),
          })
        )
      )
    );
    return data;
  };

  /**
   *
   * @param {*} companyId
   * @param {*} tags - used by agents of the company
   * @returns
   */
  async function requestDashboardData(companyId, tags) {
    if (!tags.length) return {};

    const res = await instance({
      method: 'post',
      url: `/data`,
      headers: {
        'Api-Application': applicationId,
        Authorization: `Bearer ${token}`,
        'Api-Company': companyId,
        'Content-Type': 'application/json',
      },
      data: requestsFromTags(tags),
    });

    // log(res.data.data);

    return formatDataByTag(res.data.data, tags);
  }

  return {
    requestCompaniesWithAgents,
    requestAgentData,
    requestDashboardData,
  };
}
