function canRenewSubscription(subscription, currentDate) {
  // Vérification des champs requis
  if (!subscription || 
      !subscription.status ||
      !subscription.endDate ||
      typeof subscription.hasBeenRenewed === 'undefined' ||
      typeof subscription.unpaidDebt === 'undefined' ||
      typeof subscription.isTrial === 'undefined') {
    return false;
  }

  return subscription.status === 'active' && 
         new Date(subscription.endDate) <= new Date(currentDate) &&
         !subscription.hasBeenRenewed &&
         !subscription.unpaidDebt &&
         !subscription.isTrial;
}

module.exports = { canRenewSubscription };