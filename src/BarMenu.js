import React, { Component } from "react";
import './BarMenu.css';
import Position from './Position';

class BarMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentProfit: 0,
      currentCapital: 10000,
      positions: [],
      closedPositions: []
    };

    this.handleBuy = this.handleBuy.bind(this);
    this.handleSell = this.handleSell.bind(this);
    this.handleClosePosition = this.handleClosePosition.bind(this);
  }
  hasOpenPositions() {
    return this.state.positions.length > 0;
  }

  handleBuy() {
    const entryPrice = this.props.currentPrice;

    setTimeout(() => {
      this.setState((prevState) => ({
        currentCapital: prevState.currentCapital,
        currentProfit: prevState.currentProfit,
        positions: [
          ...prevState.positions,
          { side: 'Buy', entryPrice, id: Date.now() }
        ]
      }), () => {
        const newPosition = this.state.positions[this.state.positions.length - 1];
        this.createPriceLines(newPosition);
      });
    }, 1000); // 1 second delay
  }

  handleSell() {
    const entryPrice = this.props.currentPrice;

    setTimeout(() => {
      this.setState((prevState) => ({
        currentCapital: prevState.currentCapital,
        currentProfit: prevState.currentProfit,
        positions: [
          ...prevState.positions,
          { side: 'Sell', entryPrice, id: Date.now() }
        ]
      }), () => {
        const newPosition = this.state.positions[this.state.positions.length - 1];
        this.createPriceLines(newPosition);
      });
    }, 1000); // 1 second delay
  }

  createPriceLines(position) {
    const { seriesRef } = this.props;

    if (seriesRef) {
      const entryPriceLine = {
        price: position.entryPrice,
        color: '#3179F5',
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'Entry Price',
      };

      const currentPriceLine = {
        price: this.props.currentPrice,
        color: '#F53131',
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'Current Price',
      };


    }
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
          ? this.props.currentPrice - position.entryPrice
          : position.entryPrice - this.props.currentPrice;

        const updatedCapital = parseFloat((prevState.currentCapital + profitOrLoss).toFixed(2));

        // Pass the updated capital back to the parent component
        this.props.onCapitalUpdate(updatedCapital);

        return {
          currentCapital: updatedCapital,
          positions: prevState.positions.filter(p => p.id !== id),
          closedPositions: [closedPosition, ...prevState.closedPositions]
        };
      });
    }, 1000); // 1 second delay
  }

  render() {
    const { currentCapital, currentProfit, positions, closedPositions } = this.state;
    const { currentPrice } = this.props;

    return (
      <div className="trading-panel-wrapper">
        <div className="trading-panel">
          <div className="info-section">
            <p className="info-text" style={{ marginRight: '10px' }}>Pair: LUC/USDT</p>

            <p className="info-text" style={{ marginLeft: '80px', marginRight: '10px' }}>Timeframe: 1D</p>
          </div>
          <div className="button-section">
            <button className="trade-button buy-button" onClick={this.handleBuy}> LONG </button>
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
