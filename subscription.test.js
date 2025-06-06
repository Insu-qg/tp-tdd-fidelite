import { canRenewSubscription, getRenewalReason } from './subscription';

describe('Subscription Renewal', () => {
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

describe('Edge Cases', () => {
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

describe('Renewal Reason', () => {
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