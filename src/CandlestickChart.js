import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const mult_up = 100; // Multiplier for growing values (percent)
const mult_down = 100; // Multiplier for falling values (percent)

// Function to generate a random interval between 200ms and 1500ms
const getRandomInterval = () => {
  return Math.floor(Math.random() * (1500 - 200 + 1)) + 200; // <-- This line computes the interval
};

const roundToThreeDecimals = (value) => {
  return parseFloat(value.toFixed(3));
};

const CandlestickChart = ({ data }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef(); // Reference for the chart instance
  const candlestickSeriesRef = useRef(); // Reference for the candlestick series
  const [chartData, setChartData] = useState(data);
  const intervalRef = useRef(); // Reference for the interval ID

  useEffect(() => {
    if (!chartRef.current) {
      // Initialize chart only if not already initialized
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
      chartRef.current = chart;
    }

    if (!candlestickSeriesRef.current) {
      // Add candlestick series only if not already added
      const candlestickSeries = chartRef.current.addCandlestickSeries();
      candlestickSeriesRef.current = candlestickSeries;

      // Apply price format to candlestick series
      candlestickSeriesRef.current.applyOptions({
        priceFormat: {
          type: 'price',
          precision: 3,
          minMove: 0.001,
        },
      });
    }

    // Set initial data
    candlestickSeriesRef.current.setData(chartData);

    return () => {
      // Clean up chart instance if necessary
      // (No need to remove the chart instance in this use case)
    };
  }, [chartData]);

  // Function to update the last candle
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
    // Update the series data without resetting the chart
    candlestickSeriesRef.current.setData(updatedData);
  };

  useEffect(() => {
    const updateChart = () => {
      const lastCandle = chartData[chartData.length - 1];
      let randomFactor = Math.random() - 0.5; // Random factor between -0.5 and 0.5

      let updated_close;
      if (randomFactor >= 0) {
        // Growth
        updated_close = 1 + (randomFactor / 250) * (mult_up / 100);
      } else {
        // Fall
        updated_close = 1 + (randomFactor / 250) * (mult_down / 100);
      }

      const newClose = lastCandle.close * updated_close;

      updateLastCandle({
        ...lastCandle,
        close: roundToThreeDecimals(newClose),
      });

      // Set a new interval with a random duration
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(updateChart, getRandomInterval()); // <-- This line uses the computed interval
    };

    // Initialize the interval with a random duration
    intervalRef.current = setInterval(updateChart, getRandomInterval()); // <-- This line sets the initial interval

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [chartData]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default CandlestickChart;
