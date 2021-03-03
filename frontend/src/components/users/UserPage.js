import React from 'react';

const UserPage = (props) => (
  <>
    <h2>{props.user.name}</h2>
    <p>OMG USER SETTINGS</p>
    <button onClick={props.onReturn}>Return</button>
  </>
);

export default UserPage;
