import utilities from './utilities';

function StockListTotals(props) {
  
  const { stocks } = props;
  
  const initial = {currentValue: 0, purchaseValue: 0, profit: 0};
  
  const totals = stocks.reduce((summary, stock) => {
      stock.forEach(item => {
        summary.currentValue += item.currentValue;
        summary.purchaseValue += item.purchaseValue;
        summary.profit += item.profit;
      });
    
      return summary;
    }, initial);
  
  // const totals = info.map(item => item);

  const profitClass = totals.profit < 0 ? 'loss' : 'profit';

  return (
    <tr>
      <td></td>
      <th>TOTALS</th>
      <th colSpan="3">&nbsp;</th>
      <th className="money">{utilities.formatNumber(totals.purchaseValue)}</th>
      <th>&nbsp;</th>
      <th className="money">{utilities.formatNumber(totals.currentValue)}</th>
      <th className={"money "+profitClass}>{utilities.formatNumber(totals.profit)}</th>
    </tr>
  );
}

export default StockListTotals;