const routes = require('express').Router();
const SubscriptionsController = require('../../controller/PaymentsControllers/SubscriptionsController');

routes.post('/beAPro', SubscriptionsController.beAProUser);
routes.post('/beAPremium', SubscriptionsController.beAPremiumUser);

module.exports = routes;