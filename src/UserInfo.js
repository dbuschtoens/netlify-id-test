import React from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import ReactJson from 'react-json-view'

export default function UserInfo() {
  const user = netlifyIdentity.currentUser();
  console.log({ user });
  return (
    <div>
      <h3>UserInfo Page</h3>
      <ReactJson src={user} />
    </div>
  );
}
