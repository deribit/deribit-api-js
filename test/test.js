var assert = require('assert');
let RestClient = require('../src/index').RestClient;

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var newClient;

beforeEach(function() {
    newClient = new RestClient('faulty', 'creds');
});


describe('REST Client', function() {
    describe('Initialize REST Client', function() {
        it('should instantiate new REST Client', function() {
            assert.equal("RestClient", newClient.constructor.name);
        });
    });

    describe('Test Connection', function() {
        it('Fetch instruments', function() {
            return newClient.getinstruments((response) => {
                assert.equal(true, response.success);
                assert.equal(true, response.result.length > 0);
            });
        });
        it('Auth error on private endpoints (dummy credentials)', function() {
            return newClient.account((response) => {
                assert.equal(false, response.success);
                assert.equal(10000, response.error);
            });
        });
    });
});
