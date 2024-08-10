import React from 'react';
import './UserInfoOverlay.css';

function UserInfoOverlay({ username, capital }) {
  return (
    <div className="user-info-overlay">
      <div>User: {username}</div>
      <div className="bold-big-number">
        Cap: <span className="capital-amount">{capital}$</span>
      </div>
    </div>
  );
}

export default UserInfoOverlay;
