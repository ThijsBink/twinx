exports = (params, resParams, apiVersion = '2') => {
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
