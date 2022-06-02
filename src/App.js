import { useState, useEffect } from 'react';
import './App.css';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import StockList from './StockList';
import utilities from './utilities';

function App() {
  const AWS_API_GATEWAY = 'https://dsam16axa9.execute-api.us-east-1.amazonaws.com/prod';
  const AWS_API_GATEWAY_GET_PORTFOLIO = AWS_API_GATEWAY + "/get-portfolio";
  const AWS_API_GATEWAY_GET_STOCK_PRICE = AWS_API_GATEWAY + "/get-stock-price";
  
  // Uncomment setMyName if required, for example, if the name
  // is stored in the DynamoDB
  const [myName/*, setMyName*/] = useState('Roger');
  
  const [stocks, setStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [tickerList, setTickerList] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  
  const getPortfolio = () => {
    const options = {
      method: 'POST',
      cache: 'default'
    };
    
    fetch(AWS_API_GATEWAY_GET_PORTFOLIO, options) /*global fetch*/
      .then(function(response) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(function(response) {
        // console.log(response);
        let stockList = response.Items.map(item => {
          let ticker = item.ticker.S;
          let shares = item.shares.N;
          let purchasePrice = item.purchasePrice.N;
          let data = {ticker, shares, purchasePrice};
          
          return data;
        });
        setStocks(stockList);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  
  const createTickerList = (stks) => {
    let data = stks.map(item => item.ticker);
    setTickerList(data);
  }
  
  const getStockPrice = (ticker) => {
    return new Promise((resolve, reject) => {
      const fetchOptions = {
        method: 'POST',
        cache: 'default',
        body: JSON.stringify({ticker: ticker})
      }
      
      fetch(AWS_API_GATEWAY_GET_STOCK_PRICE, fetchOptions)
        .then(function(response) {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(function(response) {
          let ticker = response.ticker;
          let data = response.data;
          let info = {ticker, data};
          
          resolve(info);
        })
        .catch(function(error) {
          reject(error);
        })
    })
  }
  
  // Retrieve the current stock information when the page first loads
  useEffect(() => {
    getPortfolio();
  }, []);
  
  useEffect(() => {
    createTickerList(stocks);
  }, [stocks])
  
  // With the stock data add purchase value, current price
  // and current value to the stock record
  useEffect(() => {
    let promises = tickerList.map(ticker => getStockPrice(ticker));
    Promise.all(promises)
      .then(stocks => {
        //console.log(stocks);
        const stockPrices = stocks.reduce((obj, stock) => {
          const info = {
            name: stock.data ? stock.data.longName : null,
            price: stock.data ? stock.data.regularMarketPrice : null
          }
          obj[stock.ticker] = info;
          return obj;
        }, {});
        setStockPrices(stockPrices);
        // console.log(stockPrices);
      })
  }, [tickerList])
  
  useEffect(() => {
    let portfolioData = stocks.reduce(stock => stock, []);
    let array = stocks.map(stock => {
      let info = {};
      info.ticker = stock.ticker;
      info.shares = stock.shares;
      info.purchasePrice = stock.purchasePrice;
      if (stockPrices[info.ticker]?.price != null) {
        let stockTicker = stockPrices[info.ticker];
        info.name = stockTicker.name;
        info.purchaseValue = info.purchasePrice * info.shares;
        info.currentPrice = stockTicker.price;
        info.currentValue = info.currentPrice * info.shares;
        info.profit = info.currentValue - info.purchaseValue;
      }
      info.formattedPurchaseValue = utilities.formatNumber(info.purchaseValue);
      info.formattedCurrentValue = utilities.formatNumber(info.currentValue);
      info.formattedProfit = utilities.formatNumber(info.profit);
      
      return info;
    })
    portfolioData.push(array);
    
    // console.log(portfolioData);
    setPortfolioData(portfolioData);
  }, [stocks, stockPrices])
  
  const addStock = evt => {
    console.log(stocks);
  };

  return (
    <div className="App">
      <Card>
        <CardHeader className="card-header-color">
          <h4>{myName}'s Stock Portfolio</h4>
        </CardHeader>
        <CardBody>
          <StockList data={portfolioData} />
        </CardBody>
        <CardFooter>
          <Button size="sm" onClick={addStock}>Add stock</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
