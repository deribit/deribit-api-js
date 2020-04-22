var Client = require('node-rest-client').Client;
var createHash = require('create-hash');
var Q = require("q");
var Url = require('url');
var http  = require('http');
var https = require('https');
var debug = require('debug')('deribit-api');

function RestClient(key, secret, url) {
  if (url === void 0) { url = "https://www.deribit.com" };

  var parsedUrl = Url.parse(url);

  if (parsedUrl.host == null || parsedUrl.host == "" || parsedUrl.protocol == null) {
    throw new Error("Wrong url");
  }

  this.url = parsedUrl.protocol + "//" + parsedUrl.host;  
  debug("url: %s", url);

  var keepAliveAgent;
  if (parsedUrl.protocol == "https:") {
    keepAliveAgent = new https.Agent({keepAlive: true});
  } else {
    keepAliveAgent = new http.Agent({keepAlive: true});
  }

  this.client = new Client();
  this.client.connection.agent = keepAliveAgent;

  this.key = key;
  this.secret = secret;
};

RestClient.prototype.objectToString = function(obj, encode) {
  var result = [];
  Object.keys(obj).sort().forEach((key) => {
    var value = obj[key];
    if (Array.isArray(value) && !encode) {
      value = value.join('');
    } else if(encode) {
      value = encodeURIComponent(value);
    }

    if (encode) {
      key = encodeURIComponent(key);
    }

    result.push(key + "=" + value);
  });

  return result.join('&');
};

RestClient.prototype.generateSignature = function(action, data){
  var tstamp = new Date().getTime();
  var startingData = {
    "_": tstamp,
    "_ackey": this.key,
    "_acsec": this.secret,
    "_action": action
  };

  var allData = Object.assign(startingData, data);
  var paramsString = this.objectToString(allData, false);
  debug("sign base: %s", paramsString);

  var hash = createHash("sha256").update(paramsString).digest().toString("base64");
  var sig  = this.key + "." + tstamp.toString() + "." + hash;
  debug("signature: %s", sig);
  return sig;
};

RestClient.prototype.request = function(action, data, callback) {
  var args = {
    requestConfig: {
      noDelay: true,
      keepAlive: false
    },
    headers: {}
  };
  var actionFunction;

  if (action.startsWith("/api/v1/private/")) {
    if (this.key == null || this.secret == null) {
      throw new Error("key or secret empty");
    }
    
    actionFunction = this.client.post;
    debug("method: post");

    var signature = this.generateSignature(action, data);
    if (Object.keys(data).length > 0) {
      args["data"] = this.objectToString(data, true);
    }

    args["headers"]["x-deribit-sig"] = signature;
  } else {
    actionFunction = this.client.get;
    debug("method: get");

    if (Object.keys(data).length > 0) {
      args["parameters"] = data;
    }
  }

  if (typeof(callback) != "function") {
    var deferred = Q.defer();
    actionFunction(this.url + action, args, function (data, response){
      if (response.headers['content-type'] != "application/json") {
        debug("invalid response content-type %s", response.headers['content-type']);
        deferred.reject("wrong response type");
        return;
      }
      debug("response: %o", data);
      deferred.resolve(data);
    }).on('error', (err) => {
      debug("error: %o", err);
      deferred.reject(err);
    }).on('requestTimeout', (req) => {
      debug("request timeout");
      deferred.reject('requestTimeout');
      req.abort();
    }).on('responseTimeout', () => {
      debug("response timeout");
      deferred.reject('responseTimeout');
    });

    return deferred.promise;
  } else {
    actionFunction(this.url + action, args, function(result, response) {
      if (response.headers['content-type'] != "application/json") {
        debug("invalid response content-type %s", response.headers['content-type']);
        callback(null, "wrong response type");
        return;
      }
      debug("response: %o", data);
      callback(result);
    }).on('error', function(err) {
      debug("error: %o", err);
      callback(null, err);
    });
  }
  
};

RestClient.prototype.getorderbook = function(instrument, callback) {
  return this.request("/api/v1/public/getorderbook", {instrument: instrument}, callback);
};

RestClient.prototype.getinstruments = function(callback) {
  return this.request("/api/v1/public/getinstruments", {}, callback);
};

RestClient.prototype.getcurrencies = function(callback) {
  return this.request("/api/v1/public/getcurrencies", {}, callback);
}

RestClient.prototype.getlasttrades = function(instrument, count, since, callback) {
  var options = {
    instrument: instrument
  };

  if (since !== undefined) {
    options['since'] = since;
  }

  if (count !== undefined) {
    options['count'] = count;
  }

  return this.request("/api/v1/public/getlasttrades", options, callback);
};

RestClient.prototype.getsummary = function(instrument, callback) {
  return this.request("/api/v1/public/getsummary", {instrument: instrument}, callback);
};

RestClient.prototype.index = function(callback) {
  return this.request("/api/v1/public/index", {}, callback);
};

RestClient.prototype.account = function(callback) {
  return this.request("/api/v1/private/account", {}, callback);
};

RestClient.prototype.buy = function(instrument, quantity, price, postOnly, label, callback) {
  var options = {
    "instrument": instrument,
    "quantity": quantity,
    "price": price
  };

  if ( label !== undefined) { options["label"] = label; }
  if ( postOnly !== undefined) { options["postOnly"] = postOnly; }

  return this.request("/api/v1/private/buy", options, callback);
};

RestClient.prototype.sell = function(instrument, quantity, price, postOnly, label, callback) {
  var options = {
    "instrument": instrument,
    "quantity": quantity,
    "price": price
  };

  if ( label !== undefined) { options["label"] = label; }
  if ( postOnly !== undefined) { options["postOnly"] = postOnly; }

  return this.request("/api/v1/private/sell", options, callback);
};

RestClient.prototype.cancel = function(orderId, callback) {
  var options = {
    orderId: orderId
  };

  return this.request("/api/v1/private/cancel", options, callback);
};

RestClient.prototype.cancelall = function(type, callback) {
  if (type === undefined) {type = "all"};
  
  return this.request("/api/v1/private/cancelall", {type: type}, callback);
};

RestClient.prototype.edit = function(orderId, quantity, price, callback) {
  var options = {
    "orderId": orderId,
    "quantity": quantity,
    "price": price
  };

  return this.request("/api/v1/private/edit", options, callback);
};

RestClient.prototype.getopenorders = function(instrument, orderId, callback) {
  var options = {};

  if (instrument !== undefined ) { options["instrument"] = instrument };
  if (orderId    !== undefined ) { options["orderId"] = orderId};

  return this.request("/api/v1/private/getopenorders", options, callback);
};

RestClient.prototype.positions = function(callback) {
  return this.request("/api/v1/private/positions", {}, callback);
};

RestClient.prototype.orderhistory = function(count, callback) {
  var options = {};
  if (count    !== undefined ) { options["count"] = count};
  return this.request("/api/v1/private/orderhistory", options, callback);
};

RestClient.prototype.tradehistory = function(count, instrument, startTradeId, callback) {
  if (instrument === undefined ) { instrument = "all"};
  var options = {
    instrument: instrument
  };
  if (count !== undefined ) { options["count"] = count};
  if (startTradeId !== undefined ) { options["startTradeId"] = startTradeId}
  return this.request("/api/v1/private/tradehistory", options, callback);
};

module.exports = RestClient;
