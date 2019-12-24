# API Client for [Deribit API](https://docs.deribit.com/)

# !DEPRECATED!

### V1 API will be shut down beginning October in favor of the [Deribit V2 API](https://docs.deribit.com/v2/#deribit-api-v2-0-0)
### Please make sure to update your codebase to prepare for the transition.
### You can refer to the V2 API clients available [here](https://github.com/deribit/deribit-api-clients/)

# !DEPRECATED!

## Description

The [Deribit API](https://www.deribit.com) is available in this package.

### Installation

```
npm install deribit-api
```

### Example

```
var RestClient = require("deribit-api").RestClient;

var restClient = new RestClient();

restClient.getcurrencies().then((result) => {
  console.log("Currencies: ", result);
});

restClient.index((result) => {
  console.log("Index: ", result)
});
```

## API - REST Client

`new RestClient(key, secret, url)`

Constructor creates new REST client.

**Parameters**

| Name     | Type     | Decription                                                |
|----------|----------|-----------------------------------------------------------|
| `key`    | `string` | Optional, Access Key needed to access Private functions   |
| `secret` | `string` | Optional, Access Secret needed to access Private functions|
| `url`    | `string` | Optional, server URL, default: `https://www.deribit.com`  |


### Methods

* `getorderbook(instrument, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#getinstruments), public

  Retrieve the orderbook for a given instrument.

  **Parameters**
  
  | Name         | Type       | Decription                                                 |
  |--------------|------------|------------------------------------------------------------|
  | `instrument` | `string`   | Required, instrument name                                  |
  | `callback`   | `function` | Optional, callback, if not provided method returns promise |

* `index(callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#index), public

  Get price index, BTC-USD rates.

  **Parameters**
  
  | Name       | Type       | Decription                                                 |
  |------------|------------|------------------------------------------------------------|
  | `callback` | `function` | Optional, callback, if not provided method returns promise |

* `getcurrencies(callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#getcurrencies), public

  Get all supported currencies.

  **Parameters**
  
  | Name       | Type       | Decription                                                 |
  |------------|------------|------------------------------------------------------------|
  | `callback` | `function` | Optional, callback, if not provided method returns promise |

* `getorderbook(instrument, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#getorderbook), public

  Retrieve the orderbook for a given instrument.

  **Parameters**
  
  | Name         | Type       | Decription                                                 |
  |--------------|------------|------------------------------------------------------------|
  | `instrument` | `string`   | Required, instrument name                                  |
  | `callback`   | `function` | Optional, callback, if not provided method returns promise |

* `getlasttrades(instrument, count, since, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#getlasttrades), public

  Retrieve the latest trades that have occured for a specific instrument.

  **Parameters**
  
  | Name         | Type       | Decription                                                                    |
  |--------------|------------|-------------------------------------------------------------------------------|
  | `instrument` | `string`   | Required, instrument name                                                     |
  | `count`      | `integer`  | Optional, count of trades returned (limitation: max. count is 100)            |
  | `since`      | `integer`  | Optional, “since” trade id, the server returns trades newer than that “since” |
  | `callback`   | `function` | Optional, callback, if not provided method returns promise                    |

* `getsummary(instrument, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#getsummary), public

  Retrieve the summary info such as Open Interest, 24H Volume etc for a specific instrument.

  **Parameters**
  
  | Name         | Type       | Decription                                                 |
  |--------------|------------|------------------------------------------------------------|
  | `instrument` | `string`   | Required, instrument name                                  |
  | `callback`   | `function` | Optional, callback, if not provided method returns promise |

* `account(callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#account), Private

  Get user account summary.

  **Parameters**
  
  | Name         | Type       | Decription                                                 |
  |--------------|------------|------------------------------------------------------------|
  | `callback`   | `function` | Optional, callback, if not provided method returns promise |

* `buy(instrument, quantity, price, postOnly, label, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#buy), private

  Place a buy order in an instrument.

  **Parameters**
  
  | Name         | Type       | Decription                                                                        |
  |--------------|------------|-----------------------------------------------------------------------------------|
  | `instrument` | `string`   | Required, instrument name                                                         |
  | `quantity`   | `integer`  | Required, quantity, in contracts ($10 per contract for futures, ฿1 — for options) |
  | `price`      | `float`    | Required, USD for futures, BTC for options                                        |
  | `postOnly`   | `boolean`  | Optional, if true then the order will be POST ONLY                                |
  | `label`      | `string`   | Optional, user defined maximum 4-char label for the order                         |
  | `callback`   | `function` | Optional, callback, if not provided method returns promise                        |

* `sell(instrument, quantity, price, postOnly, label, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#sell), private

  Place a sell order in an instrument.

  **Parameters**
  
  | Name         | Type       | Decription                                                                        |
  |--------------|------------|-----------------------------------------------------------------------------------|
  | `instrument` | `string`   | Required, instrument name                                                         |
  | `quantity`   | `integer`  | Required, quantity, in contracts ($10 per contract for futures, ฿1 — for options) |
  | `price`      | `float`    | Required, USD for futures, BTC for options                                        |
  | `postOnly`   | `boolean`  | Optional, if true then the order will be POST ONLY                                |
  | `label`      | `string`   | Optional, user defined maximum 4-char label for the order                         |
  | `callback`   | `function` | Optional, callback, if not provided method returns promise                        |

* `edit(orderId, quantity, price, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#edit)

  Edit price and/or quantity of the own order. (Authorization is required).

  **Parameters**
  
  | Name         | Type       | Decription                                                                        |
  |--------------|------------|-----------------------------------------------------------------------------------|
  | `orderId`    | `integer`  | Required, ID of the order returned by "sell" or "buy" request                     |
  | `quantity`   | `integer`  | Required, quantity, in contracts ($10 per contract for futures, ฿1 — for options) |
  | `price`      | `float`    | Required, USD for futures, BTC for options                                        |
  | `callback`   | `function` | Optional, callback, if not provided method returns promise                        |

* `cancel(orderId, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#cancel), private

  Cancell own order by id.

  **Parameters**
  
  | Name         | Type       | Decription                                                                        |
  |--------------|------------|-----------------------------------------------------------------------------------|
  | `orderId`    | `integer`  | Required, ID of the order returned by "sell" or "buy" request                     |
  | `callback`   | `function` | Optional, callback, if not provided method returns promise                        |

* `cancelall(type, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#cancelall)

  Cancel all own futures, or all options, or all.

  **Parameters**
  
  | Name         | Type       | Decription                                                                                    |
  |--------------|------------|-----------------------------------------------------------------------------------------------|
  | `type`       | `string`   | Optional, type of instruments to cancel, allowed: "all", "futures", "options", default: "all" |
  | `callback`   | `function` | Optional, callback, if not provided method returns promise                                    |

* `getopenorders(instrument, orderId, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#getopenorders), private

  Retrieve open orders.

  **Parameters**
  
  | Name         | Type       | Description                                                           |
  |--------------|------------|-----------------------------------------------------------------------|
  | `instrument` | `string`   | Optional, instrument name, use if want orders for specific instrument |
  | `orderId`    | `integer`  | Optional, order id                                                    |
  | `callback`   | `function` | Optional, callback, if not provided method returns promise            |

* `positions(callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#positions), private

  Retreive positions.

  **Parameters**
  
  | Name         | Type       | Decription                                                 |
  |--------------|------------|------------------------------------------------------------|
  | `callback`   | `function` | Optional, callback, if not provided method returns promise |

* `orderhistory(count, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#orderhistory), private

  Get history.

  **Parameters**
  
  | Name       | Type       | Description                                                |
  |------------|------------|------------------------------------------------------------|
  | `count`    | `integer`  | Optional, number of requested records                      |
  | `callback` | `function` | Optional, callback, if not provided method returns promise |

* `tradehistory(count, instrument, startTradeId, callback)` - [Doc](https://docs.deribit.com/rpc-endpoints.html#tradehistory), private

  Get private trade history of the account. (Authorization is required). The result is ordered by trade identifiers (trade id-s).

  **Parameters**
  
  | Name           | Type       | Description                                                                                        |
  |----------------|------------|----------------------------------------------------------------------------------------------------|
  | `count`        | `integer`  | Optional, number of results to fetch. Default: 20                                                  |
  | `instrument`   | `string`   | Optional, name of instrument, also aliases “all”, “futures”, “options” are allowed. Default: "all" |
  | `startTradeId` | `integer`  | Optional, number of requested records                                                              |
  | `callback`     | `function` | Optional, callback, if not provided method returns promise                                         |
