import React, { Component } from "react";
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import './BarMenu.css';
import Position from './Position';

// Custom styled Slider component with black background and light yellow text for value label
const CustomSlider = styled(Slider)({
  '& .MuiSlider-valueLabel': {
    color: 'lightyellow',
    backgroundColor: '#000',
    fontWeight: 'bold',
    borderRadius: '5px',
    padding: '5px',
  },
});

// Custom styled Input component with darkblue background and border-radius 3px
const CustomInput = styled(Input)({
  backgroundColor: 'darkblue',
  color: 'lightyellow',
  borderRadius: '3px',
  padding: '5px 10px',
  width: '180px',
  '& .MuiInputBase-input': {
    color: 'lightyellow',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'lightyellow',
    },
    '&:hover fieldset': {
      borderColor: 'lightyellow',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'lightyellow',
    },
  },
});

class BarMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentProfit: 0,
      currentCapital: 10000,
      positions: [],
      closedPositions: [],
      positionSize: 1000,
      leverage: 1
    };

    this.handleBuy = this.handleBuy.bind(this);
    this.handleSell = this.handleSell.bind(this);
    this.handleClosePosition = this.handleClosePosition.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleLeverageChange = this.handleLeverageChange.bind(this);
  }

  hasOpenPositions() {
    return this.state.positions.length > 0;
  }

  handleSizeChange(event) {
    const newSize = parseFloat(event.target.value);
    this.setState({ positionSize: newSize });
  }

  handleLeverageChange(event, newValue) {
    this.setState({ leverage: newValue });
  }

  handleBuy() {
    const { currentPrice } = this.props;
    const { positionSize, leverage } = this.state;

    setTimeout(() => {
      this.setState((prevState) => ({
        positions: [
          ...prevState.positions,
          {
            side: 'Buy',
            entryPrice: currentPrice,
            positionSize,
            leverage,
            id: Date.now()
          }
        ]
      }));
    }, 1000);
  }

  handleSell() {
    const { currentPrice } = this.props;
    const { positionSize, leverage } = this.state;

    setTimeout(() => {
      this.setState((prevState) => ({
        positions: [
          ...prevState.positions,
          {
            side: 'Sell',
            entryPrice: currentPrice,
            positionSize,
            leverage,
            id: Date.now()
          }
        ]
      }));
    }, 1000);
  }

  handleClosePosition(id) {
    setTimeout(() => {
      this.setState((prevState) => {
        const position = prevState.positions.find(p => p.id === id);
        const closedPosition = {
          ...position,
          currentPrice: this.props.currentPrice,
          isClosed: true
        };

        const profitOrLoss = (position.side === 'Buy')
          ? ((this.props.currentPrice - position.entryPrice) * position.positionSize / position.entryPrice * position.leverage)
          : ((position.entryPrice - this.props.currentPrice) * position.positionSize / position.entryPrice * position.leverage);

        const updatedCapital = parseFloat((prevState.currentCapital + profitOrLoss).toFixed(2));

        // Pass the updated capital back to the parent component
        this.props.onCapitalUpdate(updatedCapital);

        return {
          currentCapital: updatedCapital,
          positions: prevState.positions.filter(p => p.id !== id),
          closedPositions: [closedPosition, ...prevState.closedPositions]
        };
      });
    }, 1000);
  }

  render() {
    const { currentCapital, positions, closedPositions, positionSize, leverage } = this.state;
    const { currentPrice } = this.props;

    return (
      <div className="trading-panel-wrapper">
        <div className="trading-panel">
          <div className="info-section">
            <p className="info-text">Pair: LUC/USDT</p>
            <p className="info-text">Timeframe: 1D</p>
          </div>
          <div className="input-section">
            <div className="position-size-container">
              <p className="input-label">Position Size:</p>
              <CustomInput
                type="number"
                value={positionSize}
                min="1"
                max={currentCapital}
                step="1"
                onChange={this.handleSizeChange}
              />
              <p className="input-label max-label">Max: ${currentCapital}</p>
            </div>
            <div>
              <p className="input-label">Leverage: {leverage}x</p>
              <CustomSlider
                value={leverage}
                size="small"
                min={1}
                max={100}
                step={1}
                onChange={this.handleLeverageChange}
                valueLabelDisplay="on"
                style={{ width: '300px' }}
              />
            </div>
          </div>
          <div className="button-section">
            <button className="trade-button buy-button" onClick={this.handleBuy}>LONG</button>
            <button className="trade-button sell-button" onClick={this.handleSell}>SHORT</button>
          </div>
          <div className="positions-section">
            <div className="positions-scrollable">
              {positions.map((position) => (
                <Position
                  key={position.id}
                  side={position.side}
                  entryPrice={position.entryPrice}
                  currentPrice={currentPrice}
                  positionSize={position.positionSize}
                  leverage={position.leverage}
                  onClose={() => this.handleClosePosition(position.id)}
                  isClosed={false}
                  seriesRef={this.props.seriesRef}
                />
              ))}
            </div>
            <div className="closed-positions-scrollable">
              <h3>Closed Positions</h3>
              {closedPositions.map((position) => (
                <Position
                  key={position.id}
                  side={position.side}
                  entryPrice={position.entryPrice}
                  currentPrice={position.currentPrice}
                  positionSize={position.positionSize}
                  leverage={position.leverage}
                  isClosed={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BarMenu;
