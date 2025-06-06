function calculateLoyaltyPoints(cart) {
  if (!Array.isArray(cart)) return 0;

  let total = 0;
  let amount = 0;

  for (const item of cart) {
    amount += item.price;

    if (item.type === 'standard') {
      total += Math.floor(item.price / 10);
    } else if (item.type === 'premium') {
      total += Math.floor(item.price / 10) * 2;
    }
  }


  return total;
}

module.exports = { calculateLoyaltyPoints };
