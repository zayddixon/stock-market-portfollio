import numeral from 'numeral';

const utilities = {
    formatNumber: m => (m === "undefined") ? "----" : numeral(m).format('0,0.00')
}

export default utilities;