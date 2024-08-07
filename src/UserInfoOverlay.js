// UserInfoOverlay.js
import React from 'react';
import './UserInfoOverlay.css';

function UserInfoOverlay({ username, capital }) {
  return (
    <div className="user-info-overlay">
      <div>User: {username}</div>
      <div className='bold-big-number'>Cap: {capital}$</div>
    </div>
  );
}

export default UserInfoOverlay;
