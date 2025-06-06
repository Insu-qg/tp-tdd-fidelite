function calculateLoyaltyPoints(cart) {
  if (!Array.isArray(cart)) return 0;

  let total = 0;
  let amount = 0;

  for (const item of cart) {
    if (!item || typeof item.price !== 'number') continue;

    amount += item.price;

    if (item.type === 'standard') {
      total += Math.floor(item.price / 10);
    }
  }

  if (amount > 200) {
    total += 10;
  }

  return total;
}

module.exports = { calculateLoyaltyPoints };
