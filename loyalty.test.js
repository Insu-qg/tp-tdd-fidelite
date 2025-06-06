const { calculateLoyaltyPoints } = require("./loyalty");

describe("Loyalty Points", () => {
  test("should return 0 for an empty cart", () => {
    expect(calculateLoyaltyPoints([])).toBe(0);
  });

  test("should return 1 point per 10€ for standard products", () => {
    const cart = [{ type: "standard", price: 25 }];
    expect(calculateLoyaltyPoints(cart)).toBe(2);
  });

    test("should return 2 point per 10€ for premium products", () => {
    const cart = [{ type: "standard", price: 25 }];
    expect(calculateLoyaltyPoints(cart)).toBe(2);
  });
});
