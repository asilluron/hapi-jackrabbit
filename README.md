# hapi-jackrabbit
Jackrabbit connection plugin for Hapi.

## Install
```
npm install --save hapi-jackrabbit
```
## Requirements
* Node 4+

## Usage
```
var options = {
    default: true, //Creates a single default exchange
    uri: 'amqp://localhost:5672'
};

var server = new Hapi.Server();

server.register({
    register: require('hapi-jackrabbit'),
    options: options
}, function (err) { });

var rabbit = server.plugins['hapi-jackrabbit'].connection;

var exchange = server.plugins['hapi-jackrabbit'].exchange;
```

### Example as a plugin
```
var exchange = server.plugins['hapi-jackrabbit'].exchange;

exchange.publish(...);

```

## Options
* default - setting this option to true will create a single default exchange. If you need to setup multiple exchanges, set this to false and server.plugins['hapi-jackrabbit'].exchange will be created as a mapped object ```<exchange-name, exchange>```.
* uri
[AMQP uri](https://www.rabbitmq.com/uri-spec.html)
