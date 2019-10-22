// @flow

export function rangeByStep(
  minValue: number, maxValue: number, stepSize: number) {
  const values: Array<number> = [];
  for (let value = minValue; value < maxValue; value += stepSize) {
    values.push(value);
  }
  values.push(values[values.length - 1] + stepSize);
  return values;
}

export function rangeByStepFromOrigin(
  originValue: number, minValue: number, maxValue: number, stepSize: number) {
  // Update minValues so we can reach originValue using steps.
  minValue = Math.round((minValue - originValue) / stepSize) * stepSize;
  const values: Array<number> = [];
  for (let value = minValue; value < maxValue; value += stepSize) {
    values.push(value);
  }
  values.push(values[values.length - 1] + stepSize);
  return values;
}
