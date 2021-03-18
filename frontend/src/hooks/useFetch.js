import { useState } from 'react';

export default function useFetch() {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function fetchData(agentId, companyId, dataSourceId) {
    const tags = interpret({
      type: INTERPRETERS.GET_AGENT_USED_TAGS,
      params: {
        agentId,
      },
    });
    const agent = interpret({
      type: INTERPRETERS.GET_AGENT,
      params: {
        agentId,
      },
    });
    const dataBatches = await client.requestData(
      agent.companyId,
      tags,
      dataSourceId,
      100,
      0
    );

    let data = {};

    tags.forEach((tag) => (data[tag.publicId] = []));
    dataBatches.forEach((dataBatch) =>
      dataBatch.points.forEach((point) =>
        Object.keys(point.values).forEach((tagId) =>
          data[tagId].push({
            time: formatDate(point.time),
            value: point.values[tagId],
          })
        )
      )
    );

    console.log(data);
    return data;
  }

  return {
    client,
    setClient,
    isLoading,
    isError,
  };
}
