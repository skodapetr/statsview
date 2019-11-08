export function rangeByStep(
  minValue, maxValue, stepSize) {
  const values = [];
  for (let value = minValue; value < maxValue; value += stepSize) {
    values.push(value);
  }
  values.push(values[values.length - 1] + stepSize);
  return values;
}

export function rangeByStepFromOrigin(
  originValue, minValue, maxValue, stepSize) {
  // Update minValues so we can reach originValue using steps.
  minValue = Math.round((minValue - originValue) / stepSize) * stepSize;
  const values = [];
  for (let value = minValue; value < maxValue; value += stepSize) {
    values.push(value);
  }
  values.push(values[values.length - 1] + stepSize);
  return values;
}
