import React, { useState, useEffect } from 'react';
import './BidAskCup.css';

const generateRandomDataBid = (currentPrice) => {
  const data = [];
  for (let i = 0; i < 11; i++) {
    const price = (currentPrice - (i / 700 * currentPrice + (currentPrice / 100))).toFixed(2);
    const size = (Math.random() * (20000 - 1000) + 1000).toFixed(1);
    data.push({ price, size });
  }
  return data;
};

const generateRandomDataAsk = (currentPrice) => {
  const data = [];
  for (let i = 0; i < 11; i++) {
    const price = ((i / 100 * currentPrice + (currentPrice / 100)) + currentPrice).toFixed(2);
    const size = (Math.random() * (20000 - 1000) + 1000).toFixed(1);
    data.push({ price, size });
  }
  return data.reverse();
};

const BidAskCup = ({ currentPrice }) => {
  const [bidData, setBidData] = useState(generateRandomDataBid(currentPrice));
  const [askData, setAskData] = useState(generateRandomDataAsk(currentPrice));

  useEffect(() => {
    const interval = setInterval(() => {
      setBidData(generateRandomDataBid(currentPrice));
      setAskData(generateRandomDataAsk(currentPrice));
    }, 900);

    return () => clearInterval(interval);
  }, [currentPrice]);

  const getFillWidth = (size) => {
    const maxSize = 20000;
    const minSize = 1000;
    return `${((size - minSize) / (maxSize - minSize)) * 100}%`;
  };

  return (
    <div className="bid-ask-cup">
      <div className="orderBook">Order Book</div>
      <div className="ask-cup">

        {askData.map((item, index) => (
          <div key={index} className="ask-row">
            <div className="fill" style={{ width: getFillWidth(item.size) }}></div>
            <div className="text">
              <span>{item.price}</span>
              <span>{item.size}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="current-price">{currentPrice}</div>
      <div className="bid-cup">
        {bidData.map((item, index) => (
          <div key={index} className="bid-row">
            <div className="fill" style={{ width: getFillWidth(item.size) }}></div>
            <div className="text">
              <span>{item.price}</span>
              <span>{item.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidAskCup;
