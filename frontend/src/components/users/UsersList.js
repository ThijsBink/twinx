import React from 'react';

import UserItem from './UserItem';

const UsersList = (props) => (
  <ul>
    {props.users.map((user) => (
      <UserItem
        key={user.id}
        id={user.id}
        name={user.name}
        onSelect={props.onSelectUser}
      />
    ))}
  </ul>
);

export default UsersList;
