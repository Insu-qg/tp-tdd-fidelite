import { canRenewSubscription, getRenewalReason } from './subscription';

describe('Subscription Renewal Validation', () => {
  describe('Basic Renewal Rules', () => {
    test('should allow renewal for active subscription with passed end date', () => {
      const subscription = {
        status: 'active',
        endDate: '2024-01-01',
        hasBeenRenewed: false,
        unpaidDebt: false,
        isTrial: false
      };
      const currentDate = '2024-06-01';
      
      expect(canRenewSubscription(subscription, currentDate)).toBe(true);
    });
    test('should allow renewal exactly on end date', () => {
      const subscription = {
        status: 'active',
        endDate: '2024-06-01',
        hasBeenRenewed: false,
        unpaidDebt: false,
        isTrial: false
      };
      const currentDate = '2024-06-01';
      
      expect(canRenewSubscription(subscription, currentDate)).toBe(true);
    });
  });

  describe('Renewal Blockers', () => {
    test('should deny renewal for already renewed subscription', () => {
      const subscription = {
        status: 'active',
        endDate: '2024-01-01',
        hasBeenRenewed: true,
        unpaidDebt: false,
        isTrial: false
      };
      const currentDate = '2024-06-01';
      
      expect(canRenewSubscription(subscription, currentDate)).toBe(false);
    });
    test('should deny renewal when end date has not passed', () => {
      const subscription = {
        status: 'active',
        endDate: '2024-12-01',
        hasBeenRenewed: false,
        unpaidDebt: false,
        isTrial: false
      };
      const currentDate = '2024-06-01';
      
      expect(canRenewSubscription(subscription, currentDate)).toBe(false);
    });
    test('should deny renewal when unpaid debt exists', () => {
      const subscription = {
        status: 'active',
        endDate: '2024-01-01',
        hasBeenRenewed: false,
        unpaidDebt: true,
        isTrial: false
      };
      const currentDate = '2024-06-01';
      
      expect(canRenewSubscription(subscription, currentDate)).toBe(false);
    });
    test('should deny renewal for trial subscriptions', () => {
      const subscription = {
        status: 'active',
        endDate: '2024-01-01',
        hasBeenRenewed: false,
        unpaidDebt: false,
        isTrial: true
      };
      const currentDate = '2024-06-01';
      
      expect(canRenewSubscription(subscription, currentDate)).toBe(false);
    });
  });

  describe('Status Checks', () => {
    test('should deny renewal for non-active subscriptions', () => {
      const statuses = ['canceled', 'paused', 'suspended'];
      
      statuses.forEach(status => {
        const subscription = {
          status,
          endDate: '2024-01-01',
          hasBeenRenewed: false,
          unpaidDebt: false,
          isTrial: false
        };
        const currentDate = '2024-06-01';
        
        expect(canRenewSubscription(subscription, currentDate)).toBe(false);
      });
    });
  });
});

describe('Error Handling', () => {
  describe('Input Validation', () => {
    test('should handle missing fields gracefully', () => {
      const incompleteSubscriptions = [
        {},
        { status: 'active' },
        { status: 'active', endDate: '2024-01-01' }
      ];
      
      incompleteSubscriptions.forEach(subscription => {
        expect(canRenewSubscription(subscription, '2024-06-01')).toBe(false);
      });
    });

    test('should handle invalid date formats', () => {
      const subscription = {
        status: 'active',
        endDate: 'invalid-date',
        hasBeenRenewed: false,
        unpaidDebt: false,
        isTrial: false
      };
      
      expect(canRenewSubscription(subscription, '2024-06-01')).toBe(false);
    });
  });

  describe('Invalid Parameters', () => {
    test('should handle invalid subscription parameter', () => {
      const invalidCases = [
        null,
        undefined,
        'not an object',
        42,
        true,
        []
      ];

      invalidCases.forEach(invalidSubscription => {
        expect(getRenewalReason(invalidSubscription, '2024-06-01')).toBe('invalidSubscription');
      });
    });

    test('should handle invalid date formats and values', () => {
      const invalidDateCases = [
        { subscription: { status: 'active', endDate: null }, expected: 'invalidDate' },
        { subscription: { status: 'active', endDate: undefined }, expected: 'invalidDate' },
        { subscription: { status: 'active', endDate: 'not a date' }, expected: 'invalidDate' },
        { subscription: { status: 'active', endDate: '2024-13-45' }, expected: 'invalidDate' },
        { subscription: { status: 'active', endDate: '' }, expected: 'invalidDate' },
        { subscription: { status: 'active' }, expected: 'invalidDate' }
      ];

      invalidDateCases.forEach(({ subscription, expected }) => {
        expect(getRenewalReason(subscription, '2024-06-01')).toBe(expected);
      });
    });
  });
});

describe('Renewal Reason Messages', () => {
  describe('Success Cases', () => {
    test('should return OK for valid renewal', () => {
      const subscription = {
        status: 'active',
        endDate: '2024-01-01',
        hasBeenRenewed: false,
        unpaidDebt: false,
        isTrial: false
      };
      
      expect(getRenewalReason(subscription, '2024-06-01')).toBe('OK');
    });
  });

  describe('Error Messages', () => {
    test('should return correct reasons for invalid cases', () => {
      const testCases = [
        {
          subscription: { status: 'canceled', endDate: '2024-01-01' },
          expected: 'inactiveSubscription'
        },
        {
          subscription: { status: 'active', endDate: '2024-12-01' },
          expected: 'futureEndDate'
        },
        {
          subscription: { status: 'active', endDate: '2024-01-01', hasBeenRenewed: true },
          expected: 'alreadyRenewed'
        },
        {
          subscription: { status: 'active', endDate: '2024-01-01', unpaidDebt: true },
          expected: 'unpaidDebt'
        },
        {
          subscription: { status: 'active', endDate: '2024-01-01', isTrial: true },
          expected: 'trial'
        }
      ];

      testCases.forEach(({ subscription, expected }) => {
        expect(getRenewalReason(subscription, '2024-06-01')).toBe(expected);
      });
    });
  });
});

describe('Performance', () => {
  test('should handle 1000 subscriptions efficiently', () => {
    const subscriptions = Array.from({ length: 1000 }, (_, i) => ({
      status: i % 2 === 0 ? 'active' : 'canceled',
      endDate: '2024-01-01',
      hasBeenRenewed: i % 3 === 0,
      unpaidDebt: i % 4 === 0,
      isTrial: i % 5 === 0
    }));

    const startTime = performance.now();
    
    subscriptions.forEach(sub => {
      canRenewSubscription(sub, '2024-06-01');
      getRenewalReason(sub, '2024-06-01');
    });

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    console.log(`Performance test results:
      - Number of subscriptions: 1000
      - Total execution time: ${executionTime.toFixed(2)}ms
      - Average time per subscription: ${(executionTime / 1000).toFixed(2)}ms
    `);

    expect(executionTime).toBeLessThan(100); // Should complete in under 100ms
  });
});