import React from 'react';

function Header() {
  return (
    <header id="mainHeader">
      <h1>Healthy Habits</h1>
      <div id="navMenu">
        <button className="navButton">Home</button>
        <button className="navButton">Track</button>
        <button className="navButton">Stats</button>
        <button className="navButton">Settings</button>
      </div>
    </header>
  );
}

export default Header;