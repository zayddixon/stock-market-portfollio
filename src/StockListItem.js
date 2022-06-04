import { BsFillTrashFill } from "react-icons/bs";

function StockListItem(props) {
  
  const { stock } = props;
  let info = [];
  const AWS_API_GATEWAY = 'https://dsam16axa9.execute-api.us-east-1.amazonaws.com/prod';
  const AWS_API_GATEWAY_DELETE_STOCK = AWS_API_GATEWAY + "/delete-stock";
  
  const deleteStock = (evt) => {
    let ticker = evt.currentTarget.getAttribute('data-ticker');
    const fetchOptions = {
        method: 'POST',
        cache: 'default',
        body: JSON.stringify({ticker: ticker})
      }
      
      fetch(AWS_API_GATEWAY_DELETE_STOCK, fetchOptions) /*global fetch */
        .then(function(response) {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(function(response) {
          props.portfolio()
        })
        .catch(function(error) {
          console.log('fetch-error');
        })
  }
  
  for (let i = 0; i < stock.length; i++) {
    let profitClass = stock[i].profit < 0 ? 'loss' : 'profit';
    info.push(<tr>
          <td><div onClick={deleteStock} data-ticker={stock[i].ticker}>
            <BsFillTrashFill />
          </div></td>
          <td>{stock[i].ticker}</td>
          <td>{stock[i].name}</td>
          <td>{stock[i].shares}</td>
          <td className="money">{stock[i].purchasePrice}</td>
          <td className="money">{stock[i].formattedPurchaseValue}</td>
          <td className="money">{stock[i].currentPrice}</td>
          <td className="money">{stock[i].formattedCurrentValue}</td>
          <td className={"money "+profitClass}>{stock[i].formattedProfit}</td>
        </tr>
      );
  }
  return (info)
}

export default StockListItem;
