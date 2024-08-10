import React, { useEffect, useRef } from 'react';
import './Position.css';

function Position({ side, entryPrice, currentPrice, onClose, isClosed, positionSize, leverage, seriesRef }) {
  const entryPriceLineRef = useRef(null);
  const currentPriceLineRef = useRef(null);

  // Correct profit calculation for Buy and Sell positions
  const profit = (side === 'Buy')
    ? ((currentPrice - entryPrice) * positionSize / entryPrice * leverage).toFixed(2)
    : ((entryPrice - currentPrice) * positionSize / entryPrice * leverage).toFixed(2);

  const backgroundColor = isClosed
    ? (profit >= 0 ? 'rgba(0,255,0,0.5)' : 'rgba(255,40,60,0.5)')
    : 'darkblue';

  useEffect(() => {
    if (seriesRef && !isClosed) {
      const entryPriceLine = {
        price: entryPrice,
        color: '#3179F5',
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'Entry Price',
      };

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
    if (currentPriceLineRef.current) {
      currentPriceLineRef.current.applyOptions({
        price: currentPrice,
        color: profit >= 0 ? 'green' : 'red',
        title: `PLN: ${profit}`,
        axisLabelVisible: true,
      });
    }
  }, [currentPrice, profit]);

  const textColor = isClosed ? 'black' : 'white';
  const plnColor = isClosed
    ? 'black'
    : profit >= 0 ? '#0ced5b' : 'red';

  const plnFontSize = isClosed ? '15px' : '35px';

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
          Close Price: ${currentPrice}
        </div>
      </div>
      <div className="position-row">
        <div className="position-item" style={{ color: plnColor, fontWeight: 'bold', fontSize: plnFontSize }}>
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
