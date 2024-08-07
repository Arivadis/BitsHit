import React, { Component } from "react";
import './BarMenu.css';
import BidAskCup from'./BidAskCup.js';

class BarMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentProfit: 0,
      currentCapital: 10000,
    };

    this.handleBuy = this.handleBuy.bind(this);
    this.handleSell = this.handleSell.bind(this);
  }

  handleBuy() {
    this.setState((prevState) => ({
      currentCapital: prevState.currentCapital - 100,
      currentProfit: prevState.currentProfit + 10,
    }));
  }

  handleSell() {
    this.setState((prevState) => ({
      currentCapital: prevState.currentCapital + 100,
      currentProfit: prevState.currentProfit - 10,
    }));
  }

  render() {
    return (
        <div className="trading-panel">
          <div className="info-section">
            <p className="info-text"><strong>Current Profit:</strong> ${this.state.currentProfit}</p>
            <p className="info-text"><strong>Current Capital:</strong> ${this.state.currentCapital}</p>
          </div>
          <div className="button-section">
            <button className="trade-button buy-button" onClick={this.handleBuy}>Buy</button>
            <button className="trade-button sell-button" onClick={this.handleSell}>Sell</button>
          </div>

        </div>
    );
  }
}

export default BarMenu;
