const { calculateLoyaltyPoints } = require("./loyalty");

describe("Loyalty Points Calculation", () => {
  describe('Basic Rules', () => {
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

    test("shouldn't return 1 point for 2 standard products at 5€", () => {
      const cart = [
        { type: "standard", price: 5 }, 
        { type: "standard", price: 5 }
      ];
      expect(calculateLoyaltyPoints(cart)).toBe(0);
    });
  });

  describe('Bonus Points', () => {
    test("should return 10 points for an amount higher than 200€ in total", () => {
      const cart = [
        { type: "standard", price: 100 }, 
        { type: "standard", price: 120 }
      ];
      expect(calculateLoyaltyPoints(cart)).toBe(32);
    });
  });

  describe('Error Handling', () => {
    test("should return 0 points for an invalid cart", () => {
      expect(calculateLoyaltyPoints("invalid")).toBe(0);
      expect(calculateLoyaltyPoints(null)).toBe(0);
      expect(calculateLoyaltyPoints(undefined)).toBe(0);
    });

    describe('Invalid Products', () => {
      test('should skip products with invalid price', () => {
        const cart = [
          { type: 'standard', price: 50 },
          { type: 'standard', price: 'invalid' }
        ];
        expect(calculateLoyaltyPoints(cart)).toBe(5);
      });

      test('should handle null items gracefully', () => {
        const cart = [
          null,
          { type: 'standard', price: 20 }
        ];
        expect(calculateLoyaltyPoints(cart)).toBe(2);
      });
    });
  });

  describe('Performance', () => {
    test('should handle a cart with 1000 products efficiently', () => {
      // Création d'un panier avec 1000 produits
      const cart = Array.from({ length: 1000 }, (_, index) => ({
        type: index % 2 === 0 ? 'standard' : 'premium',
        price: Math.floor(Math.random() * 100) + 1 // Prix entre 1 et 100€
      }));

      const startTime = performance.now();
      const points = calculateLoyaltyPoints(cart);
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(points).toBeGreaterThan(0);
      expect(executionTime).toBeLessThan(100);
      
      console.log(`Performance test results:
        - Number of products: 1000
        - Execution time: ${executionTime.toFixed(2)}ms
        - Total points: ${points}
      `);
    });
  });
});
