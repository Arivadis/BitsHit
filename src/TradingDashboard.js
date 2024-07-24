import React from 'react';
import CandlestickChart from './CandlestickChart';
import BarMenu from './BarMenu';
import './TradingDashboard.css';

const TradingDashboard = ({ data }) => {
  return (
    <div className="trading-dashboard">
      <div className="chart-container">
        <CandlestickChart data={data} />
      </div>
      <div className="menu-container">
        <BarMenu />
      </div>
    </div>
  );
};

export default TradingDashboard;
