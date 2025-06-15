const RegisterController = require('../controller/RegisterController');
const routes = require('express').Router();

routes.post('/registerForPersonal', RegisterController.RegisterForPersonal);
routes.post('/registerForGymMember', RegisterController.RegisterForGymMember);

module.exports = routes;
