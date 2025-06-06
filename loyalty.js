function calculateLoyaltyPoints(cart) {
  if (!Array.isArray(cart)) return 0;

  let total = 0;
  let amount = 0;

  for (const item of cart) {
    if (typeof item?.price !== 'number' || item?.price < 0 || item === null) 
      continue; // Skip invalid price entries
    amount += item.price;

    if (item.type === 'standard') {
      total += Math.floor(item.price / 10);
    } else if (item.type === 'premium') {
      total += Math.floor(item.price / 10) * 2; 
    }
  }
  if (amount > 200) {
    total += 10;
  }


  return total;
}

module.exports = { calculateLoyaltyPoints };
