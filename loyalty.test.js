const { calculateLoyaltyPoints } = require('./loyalty');

describe('Loyalty Points', () => {
  test('should return 0 for an empty cart', () => {
    expect(calculateLoyaltyPoints([])).toBe(0);
  });
});
