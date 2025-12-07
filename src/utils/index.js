export const isSparklinePositive = (sparkline) => {
  const prices = sparkline;
  if (!prices || prices.length < 2) return null;

  const first = prices[0];
  const last = prices[prices.length - 1];

  return last > first;
};

export const currentTime = new Date().toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});
