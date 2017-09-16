/**
 * @file lib/index.js
 */
'use strict';


/**
 * An Avid request.
 * @typedef {Object} Request
 */


/**
 * @param  {IncomingMessage} req
 * @return {Request}
 * @see {@link https://nodejs.org/api/http.html#http_class_http_incomingmessage}
 */
module.exports = function request(req) {


  /**
   * @type {Request}
   */
  const r = {


    /**
     * Returns the request's HTTP headers object.
     * @return {Object}
     * @see {@link https://nodejs.org/api/http.html#http_message_headers}
     * @public
     */
    get headers() { return req.headers; },


    /**
     * Returns the request's HTTP method.
     * @return {String}
     * @see {@link https://nodejs.org/api/http.html#http_message_method}
     * @public
     */
    get method() { return req.method; }
  };

  return r;
};
