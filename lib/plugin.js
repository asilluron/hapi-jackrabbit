'use strict';

const Hoek = require('hoek');
var JackrabbitConnector = require('./JackrabbitConnector');

const internals = {};

internals.defaults = {
  uri: 'amqp://localhost:5672',
  default: true // create a default exchange
};

exports.register = (server, options, next) => {
  const settings = Hoek.applyToDefaults(internals.defaults, options);
  let connector = new JackrabbitConnector(settings, server);

  connector.on('ready', () => {
    server.expose('connection', connector.rabbit);
    server.expose('exchange', connector.exchange); // can be a mapped object or a single exchange depeding on default option
    next();
  });

  connector.on('error', err => next(err));
};

exports.register.attributes = {
  pkg: require('../package.json')
};
