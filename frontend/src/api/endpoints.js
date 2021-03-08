const GET_REQ = 'GET';
const POST_REQ = 'POST';

exports.getAccessToken = (encodedAuth) =>
  fetch(`https://api.ayayot.com:443/access-tokens?fields=secretId`, {
    method: POST_REQ,
    headers: {
      'Api-Version': '2',
      'Api-Application': 'UUdjNNsZ3Sn1',
      'Content-Type': 'application/json',
      Authorization: `Basic ${encodedAuth}`,
    },
    body: JSON.stringify({ expiresIn: 3600 }),
  })
    .then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then((resData) => {
      console.log(resData);
      console.log(resData.data.secretId);
      if (resData.status === 'success') {
        return resData.data.secretId;
      } else {
        console.log('Unauthorized');
      }
    })
    .catch((err) => console.log(err));
