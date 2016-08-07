'use strict';

const Code = require('code');
const Lab = require('lab');
const rewire = require('rewire');
const sinon = require('sinon');
const EventEmitter = require('events').EventEmitter;
var JackrabbitConnector = rewire('../lib/JackrabbitConnector');
// This is required to trick lab coverage
var JackrabbitConnector2 = require('../lib/JackrabbitConnector'); //eslint-disable-line
JackrabbitConnector2 = JackrabbitConnector;

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const beforeEach = lab.beforeEach;
const expect = Code.expect;

describe('Default Options', () => {
  let jackrabbitConnector, jackrabbitEmitter, logSpy, pluginStub;
  let JackrabbitEmitter = require('./artifacts/JackrabbitEmitter');

  beforeEach(done => {
    jackrabbitEmitter = new JackrabbitEmitter('connected');
    pluginStub = {
      log: log => log
    };
    logSpy = sinon.spy(pluginStub, 'log');
    JackrabbitConnector.__set__('jackrabbit', jackrabbitEmitter);
    jackrabbitConnector = new JackrabbitConnector({default: false}, pluginStub);
    done();
  });

  it('is an instance of EventEmitter', done => {
    expect(jackrabbitConnector instanceof EventEmitter).to.equal(true);

    done();
  });

  it('s connection property is an instance of EventEmitter', done => {
    expect(jackrabbitConnector.connection instanceof EventEmitter).to.equal(true);

    done();
  });

  it('logs a connection event', done => {
    setTimeout(() => {
      const args = logSpy.getCall(0).args;

      expect(args[0][0]).to.equal('info');
      expect(args[1]).to.equal('Connected');

      done();
    }, 2);
  });
});

describe('With default exchange', () => {
  let jackrabbitConnector, jackrabbitEmitter, pluginStub; //eslint-disable-line
  let JackrabbitEmitter = require('./artifacts/JackrabbitEmitter');

  beforeEach(done => {
    jackrabbitEmitter = new JackrabbitEmitter('connected');
    pluginStub = {
      log: log => log
    };
    JackrabbitConnector.__set__('jackrabbit', jackrabbitEmitter);
    jackrabbitConnector = new JackrabbitConnector({default: true}, pluginStub);
    done();
  });
});

describe('Default Options with failed connection', () => {
  let jackrabbitConnector, jackrabbitEmitter, logSpy, pluginStub;
  let JackrabbitEmitter = require('./artifacts/JackrabbitEmitter');

  beforeEach(done => {
    jackrabbitEmitter = new JackrabbitEmitter('error', {message: 'test'});
    pluginStub = {
      log: log => log
    };
    logSpy = sinon.spy(pluginStub, 'log');
    JackrabbitConnector.__set__('jackrabbit', jackrabbitEmitter);
    jackrabbitConnector = new JackrabbitConnector({default: false}, pluginStub);
    jackrabbitConnector.on('error', err => err);
    done();
  });

  it('emits an error event from Connector', done => {
    jackrabbitConnector.on('error', err => {
      expect(err.message).to.equal('test');

      done();
    });
  });

  it('logs a connection event', done => {
    setTimeout(() => {
      const args = logSpy.getCall(0).args;

      expect(args[0][0]).to.equal('error');
      expect(args[1]).to.equal('Unable to connect to broker: test');

      done();
    }, 10); // TODO : Avoid using a timeout for events
  });
});

describe('Default Options with closed connection', () => {
  let jackrabbitConnector, jackrabbitEmitter, logSpy, pluginStub;
  let JackrabbitEmitter = require('./artifacts/JackrabbitEmitter');

  beforeEach(done => {
    jackrabbitEmitter = new JackrabbitEmitter('close');
    pluginStub = {
      log: log => log
    };
    logSpy = sinon.spy(pluginStub, 'log');
    JackrabbitConnector.__set__('jackrabbit', jackrabbitEmitter);
    jackrabbitConnector = new JackrabbitConnector({default: true}, pluginStub);
    jackrabbitConnector.on('error', err => err);
    done();
  });

  it('logs a connection event', done => {
    setTimeout(() => {
      const args = logSpy.getCall(0).args;

      expect(args[0][0]).to.equal('info');
      expect(args[1]).to.equal('Connection to database closed');

      done();
    }, 10);
  });
});

describe('Default Options with disconnected connection', () => {
  let jackrabbitConnector, jackrabbitEmitter, logSpy, pluginStub;
  let JackrabbitEmitter = require('./artifacts/JackrabbitEmitter');

  beforeEach(done => {
    jackrabbitEmitter = new JackrabbitEmitter('disconnected');
    pluginStub = {
      log: log => log
    };
    logSpy = sinon.spy(pluginStub, 'log');
    JackrabbitConnector.__set__('jackrabbit', jackrabbitEmitter);
    jackrabbitConnector = new JackrabbitConnector({default: false}, pluginStub);
    jackrabbitConnector.on('error', err => err);
    done();
  });

  it('logs a connection event', done => {
    setTimeout(() => {
      const args = logSpy.getCall(0).args;

      expect(args[0][0]).to.equal('warn');
      expect(args[1]).to.equal('Connection to database disconnected');

      done();
    }, 10);
  });
});
