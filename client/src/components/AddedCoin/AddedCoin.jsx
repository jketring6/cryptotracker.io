import React from 'react';
import fetch from 'isomorphic-fetch';

import reactstrap, { Row, Col } from 'reactstrap';

import UserSharesInput from '../UserSharesInput/UserSharesInput';

import './AddedCoin.css'

class AddedCoin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.name,
      // symbol: props.symbol,
      // logo: props.logo,
      // price: 0,
      nameLower: this.props.name.toLowerCase(),
      // marketCap: 0,
      // dayChange: 0,
      // weekChange: 0,
      shares: this.props.shares,
      // netValue: 0,
      // showInput: false
    }

    this.getValues = this.getValues.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.calcNetValue = this.calcNetValue.bind(this)
  }

  componentDidMount() {
    this.getValues()
    // setInterval(this.getValues, 15000)
  }

  handleChange(event) {
    console.log(event.target)
    const newState = { ...this.state }
    newState.shares = event.target.value
    this.setState(newState)
  }

  handleClick() {
    const newState = { ...this.state }
    newState.showInput = !newState.showInput
    // let shares = newState.shares != undefined ? parseInt(newState.shares) : 0
    if (newState.shares) {
      console.log('truthy', newState.shares)
    } else {
      newState.shares = 0
      console.log('falsy', newState.shares)
    }
    console.log('testing', newState.shares == true)
    newState.price = this.numberWithCommas(parseFloat(newState.price).toFixed(2))
    newState.netValue = this.calcNetValue(newState.shares, newState.price)
    this.setState(newState)
  }

  formatNum(num) {
    return this.numberWithCommas(parseFloat(num).toFixed(2))
  }

  getValues() {
    console.log('Polling for new values!')
    const { name } = this.state
    fetch(`https://api.coinmarketcap.com/v1/ticker/${name}/`)
      .then(resp => resp.json())
      .then(json => {
        var fetchedResults = json;
        let state = { ...this.state }

        // name: fetchedResults[0].name,
        state.symbol = fetchedResults[0].symbol,
          state.price = this.formatNum(fetchedResults[0].price_usd),
          state.marketCap = fetchedResults[0].market_cap_usd,
          state.hourChange = fetchedResults[0].percent_change_1h,
          state.dayChange = fetchedResults[0].percent_change_24h,
          state.weekChange = fetchedResults[0].percent_change_7d,
          state.rank = fetchedResults[0].rank,
          state.priceBTC = fetchedResults[0].price_btc,
          state.netValue = this.calcNetValue(this.state.share, this.formatNum(fetchedResults[0].price_usd))

        this.setState(state)
        // console.log(test[0])
        console.log(this.state.name)
        console.log(this.state.dayChange)
        console.log(this.state.weekChange)
      })
  }

  calcNetValue(shares, price) {
    return (
      parseFloat(shares) * parseFloat(price)
    )
  }


  numberWithCommas(x) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    const { name, symbol, price, marketCap, hourChange, dayChange, weekChange, rank, priceBTC, nameLower, netValue, shares } = this.state

    let calcValue = netValue ? netValue.toFixed(2) : '0'
    calcValue = this.numberWithCommas(calcValue)
    console.log('hi', calcValue)

    return (
      <div className='main-container'>
        <Row>

          <div className='logo'>
            <img src={`https://coincheckup.com/images/coins/${this.state.nameLower}.png`} height="64" width="64" />
          </div>

          <Col md={2}>
            <Row>
              <Col md={12} id='coinName'>
                {name}
              </Col>
            </Row>
            <Row>
              <Col md={12} id='coinSymbol'>
                ({this.state.symbol})
            </Col>
            </Row>
          </Col>

          <Col md={4}>
            <Row>
              <div id='currentPrice'>
                ${price}
              </div>
            </Row>
            <Row>
              <div className='percentages'>
                HOUR: {hourChange}%
        DAY: {dayChange}%
        WEEK: {weekChange}%
        </div>
            </Row>
          </Col>
          <Col md={3}>
            <div className="userHoldings">
              <UserSharesInput handleChange={this.handleChange} handleClick={this.handleClick} showInput={this.state.showInput} shares={shares} />
            </div>

          </Col>
          <Col md={2}>
            <div className="netValue">
              ${calcValue}
            </div>
          </Col>
        </Row>
      </div>


    )
  }
}

export default AddedCoin