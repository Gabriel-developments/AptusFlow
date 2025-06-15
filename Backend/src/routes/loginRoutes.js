const LoginController = require('../controller/LoginController');
const routes = require('express').Router();

routes.post('/', LoginController);

module.exports = routes;