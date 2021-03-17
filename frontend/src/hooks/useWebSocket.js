export default function useWebSocket() {
  function initializeWS(agentIds, wsToken) {
    const wsUri = `wss://wse.mdr.ams.dkn.ayayot.com/agents/${agentIds.map(
      (id) => id
    )},/data-realtime`;

    // console.log('CONNECTING TO WEBSOCKET', { agentIds, wsToken });

    const ws = new WebSocket(wsUri);

    ws.onopen = (e) => {
      console.log('WEBSOCKET CONNECTED', e);
      ws.send(`Authorization: ${wsToken}`);
    };
    ws.onclose = (e) => console.log('WEBSOCKET DISCONNECTED', e);
    ws.onerror = (e) => console.log('WEBSOCKET ERROR', e);
    ws.onmessage = (e) => console.log('WEBSOCKET DATA', e.data);

    setTimeout(function () {
      ws.close();
    }, 10000);

    return ws;
  }

  return {
    initializeWS,
  };
}
