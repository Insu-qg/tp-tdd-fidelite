const { calculateLoyaltyPoints } = require("./loyalty");

describe("Loyalty Points", () => {
  test("should return 0 for an empty cart", () => {
    expect(calculateLoyaltyPoints([])).toBe(0);
  });

  test("should return 1 point per 10€ for standard products", () => {
    const cart = [{ type: "standard", price: 25 }];
    expect(calculateLoyaltyPoints(cart)).toBe(2);
  });

  test("should return 2 points per 10€ for premium products", () => {
    const cart = [{ type: "premium", price: 25 }];
    expect(calculateLoyaltyPoints(cart)).toBe(4);
  });

  // test supplémentaire aux 2 précédents
  test("shouldn't return 1 point for 2 standard products at 5€", () => {
    const cart = [{ type: "standard", price: 5 }, { type: "standard", price: 5 }];
    expect(calculateLoyaltyPoints(cart)).toBe(0);
  });

  test("should return 10 points for an amout higher than 200€ in total", () => {
    // soit 100 => 10 points, 120 => 12 points, total = 22 points + 10 points car total > 200€
    const cart = [{ type: "standard", price: 100 }, { type: "standard", price: 120 }];
    expect(calculateLoyaltyPoints(cart)).toBe(32);
  });

  test("should return 0 points for an invalid cart", () => {
    expect(calculateLoyaltyPoints("invalid")).toBe(0);
    expect(calculateLoyaltyPoints(null)).toBe(0);
    expect(calculateLoyaltyPoints(undefined)).toBe(0);
  });

  test('should return 0 for an empty cart', () => {
    expect(calculateLoyaltyPoints([])).toBe(0);
  });

});
