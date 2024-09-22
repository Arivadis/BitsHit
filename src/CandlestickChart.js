import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

let mult_up = 100; // Multiplier for growing values (percent)
let mult_down = 100; // Multiplier for falling values (percent)
let after_entry_up = 100;
let after_entry_down = 100;

const getRandomInterval = () => {
  return Math.floor(Math.random() * (1500 - 200 + 1)) + 200;
};

const roundToThreeDecimals = (value) => {
  return parseFloat(value.toFixed(3));
};

const CandlestickChart = ({ data, onPriceUpdate, onSeriesRefReady, hasOpenPositions, currency = 'USD' }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candlestickSeriesRef = useRef();
  const [chartData, setChartData] = useState(data);
  const intervalRef = useRef();
  const [showHiddenWindow, setShowHiddenWindow] = useState(false);
  const [localMultUp, setLocalMultUp] = useState(mult_up);
  const [localMultDown, setLocalMultDown] = useState(mult_down);
  const [localAfterEntryUp, setLocalAfterEntryUp] = useState(after_entry_up);
  const [localAfterEntryDown, setLocalAfterEntryDown] = useState(after_entry_down);
  const currentLocale = window.navigator.languages[0];
  const myPriceFormatter = Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency: currency, // Currency for data points
  }).format;

  useEffect(() => {
    if (!chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: '#000' },
          textColor: '#DDD',
        },
        watermark: {
          visible: true,
          fontSize: 54,
          horzAlign: 'center',
          vertAlign: 'center',
          color: 'rgba(225,214,194,0.49)',
          text: 'BitsHit.pro ',
        },
        grid: {
          vertLines: { color: '#444' },
          horzLines: { color: '#444' },
        },
        priceScale: {
          borderColor: '#71649C'
        },
        timeScale: {
          borderColor: '#71649C',
          barSpacing: 15
        },
        localization: {
          priceFormatter: myPriceFormatter, // Apply the custom price formatter here
        }
      });

      chartRef.current = chart;
    }

    if (!candlestickSeriesRef.current) {
      const candlestickSeries = chartRef.current.addCandlestickSeries();
      candlestickSeriesRef.current = candlestickSeries;

      candlestickSeriesRef.current.applyOptions({
        priceFormat: {
          type: 'price',
          precision: 3,
          minMove: 0.001,
        },
      });

      // Notify parent component about the series reference
      if (onSeriesRefReady) {
        onSeriesRefReady(candlestickSeriesRef.current);
      }
    }

    candlestickSeriesRef.current.setData(chartData);

    return () => {};
  }, [chartData, onSeriesRefReady, myPriceFormatter]);

  const updateLastCandle = (newCandle) => {
    const updatedData = [...chartData];
    const lastCandleIndex = updatedData.length - 1;
    const lastCandle = updatedData[lastCandleIndex];
    const updatedCandle = {
      ...lastCandle,
      close: roundToThreeDecimals(newCandle.close),
      low: roundToThreeDecimals(Math.min(lastCandle.low, newCandle.close)),
      high: roundToThreeDecimals(Math.max(lastCandle.high, newCandle.close)),
    };
    updatedData[lastCandleIndex] = updatedCandle;
    setChartData(updatedData);
    candlestickSeriesRef.current.setData(updatedData);
    onPriceUpdate(roundToThreeDecimals(newCandle.close));
  };

  useEffect(() => {
    const updateChart = () => {
      const lastCandle = chartData[chartData.length - 1];
      let randomFactor = Math.random() - 0.5;

      console.log('Has open positions:', hasOpenPositions()); // Log the result of hasOpenPositions

      let updated_close;
      if (randomFactor >= 0) {
        if (hasOpenPositions()) {
          updated_close = 1 + (randomFactor / 250) * ((mult_up + after_entry_up) / 100);
        } else {
          updated_close = 1 + (randomFactor / 250) * (mult_up / 100);
        }
      } else {
        if (hasOpenPositions()) {
          updated_close = 1 + (randomFactor / 250) * ((mult_down + after_entry_down) / 100);
        } else {
          updated_close = 1 + (randomFactor / 250) * (mult_down / 100);
        }
      }

      const newClose = lastCandle.close * updated_close;

      updateLastCandle({
        ...lastCandle,
        close: roundToThreeDecimals(newClose),
      });

      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(updateChart, getRandomInterval());
    };

    intervalRef.current = setInterval(updateChart, getRandomInterval());

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [chartData, hasOpenPositions]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'i') {
        setShowHiddenWindow((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSave = () => {
    mult_up = localMultUp;
    mult_down = localMultDown;
    after_entry_up = localAfterEntryUp;
    after_entry_down = localAfterEntryDown;
    setShowHiddenWindow(false);
  };

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {showHiddenWindow && (
        <div
          style={{
            position: 'absolute',
            top: '10px', // Stick to the top of the container
            left: '10px', // Stick to the left of the container
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            zIndex: 1000,
          }}
        >
          <h2>Adjust Multipliers</h2>
          <label>
            Multiplier Up:
            <input
              type="number"
              value={localMultUp}
              onChange={(e) => setLocalMultUp(Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            Multiplier Down:
            <input
              type="number"
              value={localMultDown}
              onChange={(e) => setLocalMultDown(Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            After Entry Up:
            <input
              type="number"
              value={localAfterEntryUp}
              onChange={(e) => setLocalAfterEntryUp(Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            After Entry Down:
            <input
              type="number"
              value={localAfterEntryDown}
              onChange={(e) => setLocalAfterEntryDown(Number(e.target.value))}
            />
          </label>
          <br />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setShowHiddenWindow(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default CandlestickChart;
