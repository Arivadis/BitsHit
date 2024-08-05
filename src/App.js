import React, { useState, useEffect } from 'react';
import CandlestickChart from './CandlestickChart';
import BarMenu from './BarMenu';
import BidAskCup from './BidAskCup';
import banner from './BT-1.png';
import banner2 from './BT-2.png';
import Modal from './Modal';
import './App.css';

function generateRandomPrice(base, percentage) {
  const randomPercentage = (Math.random() * 2 * percentage) - percentage;
  return base + (base * randomPercentage);
}

function roundToThreeDecimals(value) {
  return parseFloat(value.toFixed(3));
}

function generateCandleData(startDate) {
  const startDateObj = new Date(startDate);
  const currentDate = new Date();
  const numCandles = Math.ceil((currentDate - startDateObj) / (1000 * 60 * 60 * 24)); // Number of days between startDate and current date
  const candles = [];
  let previousClose = Math.floor(Math.random() * 31) + 70; // Initial open price between 70 and 100

  for (let i = 0; i < numCandles; i++) {
    const time = new Date(startDateObj);
    time.setDate(startDateObj.getDate() + i);

    const open = i === 0 ? previousClose : candles[i - 1].close;
    const close = roundToThreeDecimals(generateRandomPrice(open, 0.1)); // Close within ±10% of open
    const high = roundToThreeDecimals(Math.max(open, close) + (Math.random() * 0.05 * Math.max(open, close))); // High 1-4% above max(open, close)
    const low = roundToThreeDecimals(Math.min(open, close) - (Math.random() * 0.05 * Math.min(open, close))); // Low 1-4% below min(open, close)

    const candle = {
      time: time.toISOString().split('T')[0], // Ensure the date is formatted correctly
      open: roundToThreeDecimals(open),
      high: high,
      low: low,
      close: close,
    };

    candles.push(candle);
  }

  return candles;
}

const startDate = '2023-04-01';
const initialData = generateCandleData(startDate);

function App() {
  const [showModal, setShowModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(initialData[initialData.length - 1].close);

  useEffect(() => {
    // Check local storage for username and capital
    const storedUsername = localStorage.getItem('username');
    const storedCapital = localStorage.getItem('capital');

    if (storedUsername && storedCapital) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleContinue = () => {
    setShowModal(false);
  };

  const handlePriceUpdate = (newPrice) => {
    setCurrentPrice(newPrice);
  };

  return (
    <div className="App">
      {showModal && <Modal onContinue={handleContinue} />}
      <img src={banner} alt="Banner" className="banner" />
      <div className="content">
        <div className="chart-container">
          <CandlestickChart data={initialData} onPriceUpdate={handlePriceUpdate} />
        </div>
        <div className="menu-container">
          <BarMenu />
        </div>
        <div className="bid-ask-cup-container">
          <BidAskCup currentPrice={currentPrice} />
        </div>
      </div>
      <img src={banner2} alt="Banner" className="banner" />
    </div>
  );
}

export default App;
