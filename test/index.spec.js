/**
 * @file Tests for lib/index.js
 */


const chai = require('chai');


const should = chai.should();


const request = require('../lib/index.js');


describe('request', () => {
  let origReg;

  beforeEach(() => {
    origReq = {};
  });

  it('should export a function', () => {
    request.should.be.a('Function');
  });

  it('should return an object', () => {
    request(origReq).should.be.an('Object');
  });

  describe('`.headers`', () => {
    it('should return an object', () => {
      origReq.headers = {};
      request(origReq).headers.should.be.an('Object');
    });

    it('should return the HTTP headers used by the original request', () => {
      origReq.headers = {
        test: true
      };
      request(origReq).headers.should.equal(origReq.headers);
    });
  });

  describe('`.method`', () => {
    it('should return a string', () => {
      origReq.method = 'test';
      request(origReq).method.should.be.a('String');
    });

    it('should return the HTTP method used by the original request', () => {
      origReq.method = 'test';
      request(origReq).method.should.equal(origReq.method);
    });
  });
});
