import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const mult_up = 100; // Multiplier for growing values (percent)
const mult_down = 100; // Multiplier for falling values (percent)
const after_entry_up = 100;
const after_entry_down = 100;


const getRandomInterval = () => {
  return Math.floor(Math.random() * (1500 - 200 + 1)) + 200;
};

const roundToThreeDecimals = (value) => {
  return parseFloat(value.toFixed(3));
};

const CandlestickChart = ({ data, onPriceUpdate, onSeriesRefReady }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candlestickSeriesRef = useRef();
  const [chartData, setChartData] = useState(data);
  const intervalRef = useRef();

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
  }, [chartData, onSeriesRefReady]);

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

      let updated_close;
      if (randomFactor >= 0) {
        updated_close = 1 + (randomFactor / 250) * (mult_up / 100);
      } else {
        updated_close = 1 + (randomFactor / 250) * (mult_down / 100);
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
  }, [chartData]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />;

};

export default CandlestickChart;
