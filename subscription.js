function canRenewSubscription(subscription, currentDate) {
  return subscription.status === 'active' && 
         new Date(subscription.endDate) <= new Date(currentDate) &&
         !subscription.hasBeenRenewed &&
         !subscription.unpaidDebt
}

module.exports = { canRenewSubscription };