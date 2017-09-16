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
  return {


    /**
     * Returns the request's HTTP method.
     * @return {String}
     * @see {@link https://nodejs.org/api/http.html#http_message_method}
     */
    get method() { return req.method; }
  };
};
