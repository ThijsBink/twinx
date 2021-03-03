exports.getGrid = (key) => {
  let ls = {};
  try {
    ls = JSON.parse(global.localStorage?.getItem('aquasol-grid')) || {};
  } catch (e) {}
  return ls[key];
};

exports.saveGrid = (key, value) => {
  global.localStorage?.setItem(
    'aquasol-grid',
    JSON.stringify({
      [key]: value,
    })
  );
};
