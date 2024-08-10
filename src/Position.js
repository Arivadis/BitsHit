import React, { useEffect, useRef } from 'react';
import './Position.css';

function Position({ side, entryPrice, currentPrice, onClose, isClosed, seriesRef }) {
  const entryPriceLineRef = useRef(null);
  const currentPriceLineRef = useRef(null);

  // Calculate profit based on whether the trade is open or closed
  const profit = (side === 'Buy')
    ? (currentPrice - entryPrice).toFixed(3)
    : (entryPrice - currentPrice).toFixed(3);

  // Set background color based on profitability for closed positions, and dark blue for open positions
  const backgroundColor = isClosed
    ? (profit >= 0 ? 'rgba(0,255,0,0.5)' : 'rgba(255,40,60,0.5)')
    : 'darkblue';

  useEffect(() => {
    if (seriesRef && !isClosed) {
      // Create entry price line
      const entryPriceLine = {
        price: entryPrice,
        color: '#3179F5',
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'Entry Price',
      };

      // Create current price line with dynamic PLN and conditional color
      const currentPriceLine = {
        price: currentPrice,
        color: profit >= 0 ? 'green' : 'red',
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: `PLN: ${profit}`,
      };

      entryPriceLineRef.current = seriesRef.createPriceLine(entryPriceLine);
      currentPriceLineRef.current = seriesRef.createPriceLine(currentPriceLine);
    }

    return () => {
      // Remove price lines when the component unmounts or the position is closed
      if (entryPriceLineRef.current) {
        seriesRef.removePriceLine(entryPriceLineRef.current);
        entryPriceLineRef.current = null;
      }
      if (currentPriceLineRef.current) {
        seriesRef.removePriceLine(currentPriceLineRef.current);
        currentPriceLineRef.current = null;
      }
    };
  }, [seriesRef, entryPrice, currentPrice, isClosed, profit]);

  useEffect(() => {
    // Update the current price line position and title as the price changes
    if (currentPriceLineRef.current) {
      currentPriceLineRef.current.applyOptions({
        price: currentPrice,
        color: profit >= 0 ? 'green' : 'red',
        title: `PLN: ${profit}`,
      });
    }
  }, [currentPrice, profit]);

  // Set text color based on the trade state and PLN value
  const textColor = isClosed ? 'black' : 'white';
  const plnColor = isClosed
    ? 'black'
    : profit >= 0 ? 'green' : 'red';

  return (
    <div
      className={`position ${isClosed ? 'closed' : 'open'}`}
      style={{ backgroundColor }}
    >
      <div className="position-row">
        <div className="position-item" style={{ color: textColor, fontWeight: 'bold' }}>
          Side: {side}
        </div>
        <div className="position-item" style={{ color: textColor, fontWeight: 'bold' }}>
          Entry Price: ${entryPrice}
        </div>
        <div className="position-item" style={{ color: textColor, fontWeight: 'bold' }}>
          Current Price: ${currentPrice}
        </div>
      </div>
      <div className="position-row">
        <div className="position-item" style={{ color: plnColor, fontWeight: 'bold', fontSize: '15px' }}>
          PLN: ${profit}
        </div>
        {!isClosed && (
          <button onClick={onClose}>Close Position</button>
        )}
      </div>
    </div>
  );
}

export default Position;
