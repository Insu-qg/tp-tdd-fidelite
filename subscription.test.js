import { canRenewSubscription } from './subscription';

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
});