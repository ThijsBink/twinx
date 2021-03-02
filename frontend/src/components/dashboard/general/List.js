import React from 'react';

import DashboardItem from './Item';

const List = (props) => (
  <ul>
    {props.items.map((item) => (
      <DashboardItem
        key={item.id}
        id={item.id}
        name={item.name}
        onSelect={props.onSelectItem}
      />
    ))}
  </ul>
);

export default List;
