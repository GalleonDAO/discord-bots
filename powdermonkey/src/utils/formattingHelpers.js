module.exports.getPercentageChange = (originalValue, newValue) => {
    originalValue = Number(originalValue);
    newValue = Number(newValue);
  
    return (((newValue-originalValue)/originalValue)*100);
  }
  
  module.exports.numberWithCommas = (num) => num.toLocaleString();