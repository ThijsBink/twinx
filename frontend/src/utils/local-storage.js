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

exports.deleteCustomFormula = (row) => {
  console.log(row.agent)
  let list = this.getCustomFormulas(row.agent);
  console.log(list);
  let newList = [];
  list.forEach(index => {
    let same = true;
    if (index.source === row.source) {
      for (let i = 0; i < index.values.length; i++) {
        if (index.values[i] !== row.values[i]) {
          same = false;
          break;
        }
      }

      if (!same) {
        newList.push(index);
      }
      // do nothing as we want to remove this index
    } else {
      newList.push(index);
    }
  })
  console.log(newList);

  this.saveCustomFormulas(row.agent, newList);
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
