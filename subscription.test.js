const { canRenewSubscription } = require('./subscription');

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
});