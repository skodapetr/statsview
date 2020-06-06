export function rangeByStep(minValue, maxValue, stepSize) {
  const values = [];
  for (let value = minValue; value < maxValue; value += stepSize) {
    values.push(value);
  }
  return values;
}

export function unifiedRound(num){
  return Math.round(num*1000)/1000;
}

//replaces all values with Moving average of values around
export function smoothenArray(arr){
  let result = [];
  let windowSize = 10;
  let sum = (windowSize/2 - 1) * arr[0];
  for(let i = 0; i <= windowSize/2; i++){
    sum += arr[i];
  }
  for(let i = 0; i < arr.length; i++){
    let prev = Math.max(i - windowSize/2, 0);
    let next = Math.min(i + windowSize/2, arr.length - 1);
    sum += arr[next] - arr[prev];
    result[i] = sum/windowSize;
  }
  return result;
}

export function indexOfWithAttr(arr, attr, value){
  for(let i = 0; i < arr.length; i++){
    if(arr[i][attr] === value){
      return i;
    }
  }
  return -1;
}
