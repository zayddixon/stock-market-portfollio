import utilities from './utilities';

function StockListItem(props) {
  
  let { stock } = props;
  let info = [];
  for (let i = 0; i < stock.length; i++) {
    let profitClass = stock[i].profit < 0 ? 'loss' : 'profit';
    info.push(<tr>
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
