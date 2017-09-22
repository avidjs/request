/**
 * @file Tests for lib/index.js
 */


const chai = require('chai');


const should = chai.should();


const request = require('../lib/index.js');


describe('request', () => {
  let origReg;
  let settings;

  beforeEach(() => {
    origReq = {
      headers: {},
      socket:  {}
    };
    settings = {
      proxy: false
    };
  });

  it('should export a function', () => {
    request.should.be.a('Function');
  });

  it('should return an object', () => {
    request(origReq, settings).should.be.an('Object');
  });

  describe('charset', () => {
    it('should return empty string if `Content-Type` header not set', () => {
      request(origReq, settings).charset.should.be.a('String');
      request(origReq, settings).charset.should.equal('');
    });

    it('should return empty string if `Content-Type` header is invalid', () => {
      origReq.headers['content-type'] = 'not a valid Content-Type';

      request(origReq, settings).charset.should.be.a('String');
      request(origReq, settings).charset.should.equal('');
    });

    it('should return charset if `Content-Type` header is valid', () => {
      origReq.headers['content-type'] = 'text/html; charset=utf-8';

      request(origReq, settings).charset.should.be.a('String');
      request(origReq, settings).charset.should.equal('utf-8');
    });

    it('should return empty string if `Content-Type` header is valid, but contains no charset', () => {
      origReq.headers['content-type'] = 'text/html';

      request(origReq, settings).charset.should.be.a('String');
      request(origReq, settings).charset.should.equal('');
    });
  });

  describe('#header', () => {
    it('should be a function', () => {
      request(origReq, settings).header.should.be.a('Function');
    });

    it('should return a string', () => {
      request(origReq, settings).header('test').should.be.a('String');
    });

    it('should lowercase the header field', () => {
      origReq.headers.test = 'test';
      request(origReq, settings).header('TEST').should.equal('test');
    });

    it('should return `Referer` header if set and requested with `referrer`', () => {
      origReq.headers.referer = 'referer';
      request(origReq, settings).header('referrer').should.equal('referer');
    });

    it('should return `Referrer` header if set and requested with `referer`', () => {
      origReq.headers.referrer = 'referrer';
      request(origReq, settings).header('referer').should.equal('referrer');
    });

    it('should return blank string if `Referrer` header not set and request with `referrer`', () => {
      request(origReq, settings).header('referrer').should.equal('');
    });

    it('should return blank string if `Referer` header not set and request with `referer`', () => {
      request(origReq, settings).header('referer').should.equal('');
    });

    it('should return header if set', () => {
      origReq.headers.test = 'test';
      request(origReq, settings).header('test').should.equal('test');
    });

    it('should return empty string if header not set', () => {
      request(origReq, settings).header('test').should.equal('');
    });
  });

  describe('.headers', () => {
    it('should return the HTTP headers used by the original request', () => {
      origReq.headers.test = true;

      request(origReq, settings).headers.should.be.an('Object');
      request(origReq, settings).headers.should.equal(origReq.headers);
    });
  });

  describe('.host', () => {
    it('should return `Host` header if set', () => {
      origReq.headers.host = 'set';
      request(origReq, settings).host.should.be.a('String');
      request(origReq, settings).host.should.equal('set');
    });

    it('should return `X-Forwarded-Host` header if set and `settings.proxy` is true', () => {
      origReq.headers['x-forwarded-host'] = 'set';
      settings.proxy = true;

      request(origReq, settings).host.should.be.a('String');
      request(origReq, settings).host.should.equal('set');
    });

    it('should return empty string if nothing else is set', () => {
      request(origReq, settings).host.should.be.a('String');
      request(origReq, settings).host.should.equal('');
    });
  });

  describe('.ip', () => {
    it('should return IP address from `X-Forwarded-For` if header is set and `settings.proxy` is true', () => {
      origReq.headers['x-forwarded-for'] = '203.0.113.195, 70.41.3.18, 150.172.238.178';
      settings.proxy = true;

      request(origReq, settings).ip.should.be.a('String');
      request(origReq, settings).ip.should.equal('203.0.113.195');
    });

    it('should return IP address from `socket.remoteAddress` if available', () => {
      origReq.socket.remoteAddress = '203.0.113.195';

      request(origReq, settings).ip.should.be.a('String');
      request(origReq, settings).ip.should.equal('203.0.113.195');
    });

    it('should return empty string if no IP address is available', () => {
      request(origReq, settings).ip.should.be.a('String');
      request(origReq, settings).ip.should.equal('');
    });
  });

  describe('.ips', () => {
    it('should return an empty array if `X-Forwarded-For` header not set', () => {
      request(origReq, settings).ips.should.be.an('Array');
      request(origReq, settings).ips.should.deep.equal([]);
    });

    it('should return an empty array if `settings.proxy` is false', () => {
      origReq.headers['x-forwarded-for'] = '203.0.113.195, 70.41.3.18, 150.172.238.178';
      settings.proxy = false;

      request(origReq, settings).ips.should.be.an('Array');
      request(origReq, settings).ips.should.deep.equal([]);
    });

    it('should return an array of IP addresses from `X-Forwarded-For` header if set and `settings.proxy` is true', () => {
      origReq.headers['x-forwarded-for'] = '203.0.113.195, 70.41.3.18, 150.172.238.178';
      settings.proxy = true;

      request(origReq, settings).ips.length.should.equal(3);
      request(origReq, settings).ips.should.be.an('Array');
      request(origReq, settings).ips.should.deep.equal([ '203.0.113.195', '70.41.3.18', '150.172.238.178' ]);
    });
  });

  describe('.length', () => {
    it('should return `Content-Length` header if set', () => {
      origReq.headers['content-length'] = '100'
      request(origReq, settings).length.should.be.a('Number');
      request(origReq, settings).length.should.equal(100);
    });

    it('should return `0` if `Content-Length` header is not set', () => {
      request(origReq, settings).length.should.be.a('Number');
      request(origReq, settings).length.should.equal(0);
    });
  });

  describe('.method', () => {
    it('should return the HTTP method used by the original request', () => {
      origReq.method = 'test';
      request(origReq, settings).method.should.be.a('String');
      request(origReq, settings).method.should.equal(origReq.method);
    });
  });

  describe('.origin', () => {
    it('should return a string', () => {
      request(origReq, settings).origin.should.be.a('String');
    });
  });

  describe('.originalUrl', () => {
    it('should return the URL used by the original request', () => {
      origReq.url = 'test';
      request(origReq, settings).originalUrl.should.be.a('String');
      request(origReq, settings).originalUrl.should.equal(origReq.url);
    });
  });

  describe('.protocol', () => {
    it('should return `https` if `req.socket.encrypted` is true', () => {
      origReq.socket = {
        encrypted: true
      };
      request(origReq, settings).protocol.should.be.a('String');
      request(origReq, settings).protocol.should.equal('https');
    });

    it('should return `http` if `req.socket.encrypted` is false and `settings.proxy` is false', () => {
      origReq.socket = {
        encrypted: false
      };
      settings.proxy = false;
      request(origReq, settings).protocol.should.be.a('String');
      request(origReq, settings).protocol.should.equal('http');
    });

    it('should return `https` if `req.socket.encrypted` is false but `settings.proxy` is true and `req.headers[\'x-forwarded-proto\']` contains `https`', () => {
      origReq.headers['x-forwarded-proto'] = 'https';
      origReq.socket = {
        encrypted: false
      };
      settings.proxy = true;
      request(origReq, settings).protocol.should.be.a('String');
      request(origReq, settings).protocol.should.equal('https');
    });

    it('should return `http` if `req.socket.encrypted` is false and `settings.proxy` is true and `req.headers[\'x-forwarded-proto\']` is not set', () => {
      origReq.socket = {
        encrypted: false
      };
      settings.proxy = true;
      request(origReq, settings).protocol.should.be.a('String');
      request(origReq, settings).protocol.should.equal('http');
    });
  });

  describe('.querystring', () => {
    it('should return an empty string if the request URL has no querystring', () => {
      origReq.url = '/';
      request(origReq, settings).querystring.should.be.a('String');
      request(origReq, settings).querystring.should.equal('');
    });

    it('should return the querystring if the request URL has a querystring', () => {
      origReq.url = '/index?test=true';
      request(origReq, settings).querystring.should.be.a('String');
      request(origReq, settings).querystring.should.equal('test=true');
    });
  });

  describe('.secure', () => {
    it('should return true if `req.socket.encrypted` is true', () => {
      origReq.socket = {
        encrypted: true
      };
      request(origReq, settings).secure.should.be.a('Boolean');
      request(origReq, settings).secure.should.be.true;
    });

    it('should return false if `req.socket.encrypted` is false and `settings.proxy` is false', () => {
      origReq.socket = {
        encrypted: false
      };
      settings.proxy = false;
      request(origReq, settings).secure.should.be.a('Boolean');
      request(origReq, settings).secure.should.be.false;
    });

    it('should return true if `req.socket.encrypted` is false but `settings.proxy` is true and `req.headers[\'x-forwarded-proto\']` contains `https`', () => {
      origReq.headers['x-forwarded-proto'] = 'https';
      origReq.socket = {
        encrypted: false
      };
      settings.proxy = true;
      request(origReq, settings).secure.should.be.a('Boolean');
      request(origReq, settings).secure.should.be.true;
    });

    it('should return false if `req.socket.encrypted` is false and `settings.proxy` is true and `req.headers[\'x-forwarded-proto\']` is not set', () => {
      origReq.socket = {
        encrypted: false
      };
      settings.proxy = true;
      request(origReq, settings).secure.should.be.a('Boolean');
      request(origReq, settings).secure.should.be.false;
    });
  });

  describe('.socket', () => {
    it('should return the URL used by the original request', () => {
      class Socket {};
      origReq.socket = new Socket;
      request(origReq, settings).socket.should.be.an.instanceof(Socket);
      request(origReq, settings).socket.should.deep.equal(origReq.socket);
    });
  });

  describe('.type', () => {
    it('should return an empty string if `Content-Type` header is not set', () => {
      request(origReq, settings).type.should.be.a('String');
      request(origReq, settings).type.should.equal('');
    });

    it('should return the Content-Type if `Content-Type` header is set', () => {
      origReq.headers['content-type'] = 'text/html; charset=utf-8';
      request(origReq, settings).type.should.be.a('String');
      request(origReq, settings).type.should.equal('text/html');
    })
  });

  describe('.url', () => {
    it('should return the URL used by the original request', () => {
      origReq.url = 'test';
      request(origReq, settings).url.should.be.a('String');
      request(origReq, settings).url.should.equal(origReq.url);
    });

    it('should not necessarily match the original URL used by the original request', () => {
      origReq.url = 'test';

      let req = request(origReq, settings);
      req.url = 'nope';
      req.url.should.be.a('String');
      req.url.should.not.equal(req.originalUrl);
    });
  });
});
