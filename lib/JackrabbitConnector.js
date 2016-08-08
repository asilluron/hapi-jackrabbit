'use strict';

let jackrabbit = require('jackrabbit');
let EventEmitter = require('events').EventEmitter;

class JackrabbitConnector extends EventEmitter {

  constructor (options, plugin) {
    super();

    this.rabbit = jackrabbit(options.uri);
    this.defaultExchange = this.rabbit.default();
    options.queues.forEach(queue => {
      this.defaultExchange.queue(queue);
    });

    plugin.ext('onPostStop', (request, reply) => {
      this.rabbit.close();
      return reply.continue();
    });

    this.rabbit.on('connected', () => {
      plugin.log(['info', 'plugin', 'jackrabbit'], 'Connected');
      this.emit('ready');
    })
      .on('error', err => {
        plugin.log(['error', 'plugin', 'jackrabbit'], `Unable to connect to broker: ${err.message}`);
        this.emit('error', err);
      })
      .on('disconnected', () => {
        plugin.log(['warn', 'plugin', 'jackrabbit'], 'hapi-jackrabbit plugin disconnected');
        this.emit('disconnected');
      });
  }
}

module.exports = JackrabbitConnector;
