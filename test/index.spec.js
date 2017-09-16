/**
 * @file Tests for lib/index.js
 */


const chai = require('chai');


const should = chai.should();


const request = require('../lib/index.js');


describe('request', () => {
  it('should export a function', () => {
    request.should.be.a('Function');
  });

  it('should return an object', () => {
    request({}).should.be.an('Object');
  });

  describe('`.method`', () => {
    it('should return the HTTP method used by the original request', () => {
      let req = request({
        method: 'test'
      });

      req.method.should.equal('test');
    });
  });
});
