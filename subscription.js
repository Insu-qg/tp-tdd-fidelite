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

function getRenewalReason(subscription, currentDate) {
  if (!subscription || typeof subscription !== 'object') {
    return 'invalidSubscription';
  }

  if (subscription.status !== 'active') {
    return 'inactiveSubscription';
  }

  if (!subscription.endDate || isNaN(new Date(subscription.endDate))) {
    return 'invalidDate';
  }

  if (new Date(subscription.endDate) > new Date(currentDate)) {
    return 'futureEndDate';
  }

  if (subscription.hasBeenRenewed) {
    return 'alreadyRenewed';
  }

  if (subscription.unpaidDebt) {
    return 'unpaidDebt';
  }

  if (subscription.isTrial) {
    return 'trial';
  }

  return 'OK';
}

module.exports = { 
  canRenewSubscription,
  getRenewalReason
};