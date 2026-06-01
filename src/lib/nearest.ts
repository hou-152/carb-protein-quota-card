export function nearestNumber(value: number, options: number[]) {
  return options.reduce((nearest, option) => {
    const currentDistance = Math.abs(value - option);
    const nearestDistance = Math.abs(value - nearest);
    return currentDistance < nearestDistance ? option : nearest;
  }, options[0]);
}

