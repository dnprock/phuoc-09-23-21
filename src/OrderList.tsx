import React from 'react'
import { OrderListProps, OrderListState } from './interfaces'
import { formatNumber, formatPrice } from './utilities'

class OrderList extends React.Component<OrderListProps, OrderListState> {
  constructor(props: OrderListProps) {
    super(props)

    this.state = {
      scrollPosition: 0,
      pricePoints: props.pricePoints
    }
  }

  trimPricesForScreen(prices: string[]) {
    const rowHeight = 26
    const orderListHeight = window.innerHeight - 100 - 36 // subtract page headers and footers and list headers
    const numRows = orderListHeight / rowHeight
    return prices.slice(0, numRows)
  }

  render() {
    let total = 0
    let prices = Object.keys(this.props.pricePoints)
    if (this.props.listType === 'sell') {
      // sell side, lowest price first
      prices.sort()
    } else {
      // buy side, highest price first
      prices.sort().reverse()
    }
    prices = this.trimPricesForScreen(prices)
    return (
      <div className='order-list col-1'>
        <div className='order-list-container'>
          <div className='price-row'>
            {this.props.listType === 'buy' &&
              <div className='order-list-header'>
                <div className='order-col-1'>TOTAL</div>
                <div className='order-col-1'>SIZE</div>
                <div className='order-col-2'>PRICE</div>
              </div>
            }
            {this.props.listType === 'sell' &&
              <div className='order-list-header'>
                <div className='order-col-2'>PRICE</div>
                <div className='order-col-1'>SIZE</div>
                <div className='order-col-1'>TOTAL</div>
              </div>
            }
          </div>
          {prices.map((price, index) => {
            total += this.props.pricePoints[price]
            const divTotal = <div key={'price-total-' + index} className='order-col-1 order-total'>{formatNumber(total)}</div>
            const divSize = <div key={'price-size-' + index} className='order-col-1 order-size'>{formatNumber(this.props.pricePoints[price])}</div>
            const divPrice = <div key={'price-point-' + index}
              className='order-col-2 order-price'
              style={{color: this.props.listType === 'buy' ? 'limegreen' : 'red'}} >{formatPrice(price)}</div>
            if (this.props.listType === 'buy') {
              return (
                <div key={'price-row-' + index} className='price-row'>
                  {divTotal}
                  {divSize}
                  {divPrice}
                </div>
              )
            } else {
              return (
                <div key={'price-row-' + index} className='price-row'>
                  {divPrice}
                  {divSize}
                  {divTotal}
                </div>
              )
            }
          })}
        </div>
      </div>
    )
  }
}

export default OrderList