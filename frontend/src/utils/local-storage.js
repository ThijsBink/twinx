exports.getGrid = (id) => {
  let ls = {};
  try {
    ls = JSON.parse(global.localStorage?.getItem(`aquasol:${id}`)) || {};
  } catch (e) {}
  return ls;
};

exports.saveGrid = (id, value) => {
  global.localStorage?.setItem(`aquasol:${id}`, JSON.stringify(value));
};

exports.getCustomFormulas = (id) => {
  let ls = {};
  try {
    ls = JSON.parse(global.localStorage?.getItem(`aquasolFormulas:${id}`)) || {};
  } catch (e) {}
  return ls;
}

exports.saveCustomFormulas = (id, formulaList) => {
  global.localStorage?.setItem(`aquasolFormulas:${id}`, JSON.stringify(formulaList));
}

// exports.getGrid = (id) => {
//   let ls = {};
//   try {
//     ls = JSON.parse(global.localStorage?.getItem(`aquasol:${id}`)) || {};
//   } catch (e) {}
//   return ls['layout'];
// };

// exports.saveGrid = (id, value) => {
//   global.localStorage?.setItem(
//     `aquasol:${id}`,
//     JSON.stringify({
//       ['layout']: value,
//     })
//   );
// };
