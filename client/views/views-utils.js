export function rangeByStep(minValue, maxValue, stepSize) {
  const values = [];
  for (let value = minValue; value < maxValue; value += stepSize) {
    values.push(value);
  }
  return values;
}
