import { useState, useEffect } from 'react';
import './App.css';
import { Col, Button, FormGroup, Label, Input } from 'reactstrap';

function AddStockForm(props) {
  const AWS_API_GATEWAY = 'https://dsam16axa9.execute-api.us-east-1.amazonaws.com/prod';
  const AWS_API_GATEWAY_ADD_STOCK = AWS_API_GATEWAY + "/add-stock";
  
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [addStockError, setAddStockError] = useState(false);
  
  const addStock = (evt) => {
    setAddStockError(false);
    
    const fetchOptions = {
      method: "POST",
      cache: "default",
      body: JSON.stringify({ticker: ticker, shares: shares, purchasePrice: purchasePrice})
    }
    
    fetch(AWS_API_GATEWAY_ADD_STOCK, fetchOptions)
      .then(function(response){
        if(!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(function(response) {
        props.portfolio();
        props.closeAddStockForm(false);
      })
      .catch(function(error){
        setAddStockError(true);
        console.log(error);
      })
  };
  const onChange = function(setFcn) {
    return function(evt) {
      setFcn(evt.currentTarget.value.toUpperCase());
    }
  }
  
  useEffect(() => {
    let isValid = (ticker.length > 0);
    isValid = isValid && (shares.length > 0);
    isValid = isValid && (purchasePrice.length > 0);
    isValid = isValid && !/[^A-Z]/.test(ticker);
    setIsValid(isValid);
  }, [ticker, shares, purchasePrice])

  if (addStockError == true) {
    return(
      <div className="add-stock-error">There was an error adding the stock</div>
    )
  } else {
    return(
      <div>
        <FormGroup row>
          <Label for="ticker" sm={4}>Ticker</Label>
          <Col sm={10}>
            <Input name="ticker" id="ticker" value={ticker} onChange={onChange(setTicker)} placeholder="Ticker Name" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="shares" sm={4}>Shares</Label>
          <Col sm={10}>
            <Input name="shares" id="shares" value={shares} onChange={onChange(setShares)} placeholder="Share Count" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="purchasePrice" sm={4}>Purchase Price</Label>
          <Col sm={10}>
            <Input  name="purchasePrice" id="purchasePrice" value={purchasePrice} onChange={onChange(setPurchasePrice)} placeholder="Purchased Price" />
          </Col>
        </FormGroup>
        <Button size="sm" onClick={addStock} disabled={!isValid}>Add Stock</Button>
        <Button size="sm" onClick={props.closeAddStockForm}>Cancel</Button>
      </div>
    )
  }
}

export default AddStockForm;
