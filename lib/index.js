/**
 * @file lib/index.js
 */
'use strict';


const contentType = require('content-type');


/**
 * An Avid request.
 * @typedef {Object} Request
 * @property {String}   charset
 * @property {Function} header
 * @property {Object}   headers
 * @property {String}   host
 * @property {String}   ip
 * @property {Array}    ips
 * @property {Number}   length
 * @property {String}   method
 * @property {String}   origin
 * @property {String}   originalUrl
 * @property {String}   protocol
 * @property {String}   querystring
 * @property {Boolean}  secure
 * @property {Socket}   socket
 * @property {String}   type
 * @property {String}   url
 */


/**
 * @param  {IncomingMessage} req
 * @param  {Object}          settings
 * @return {Request}
 * @see {@link https://nodejs.org/api/http.html#http_class_http_incomingmessage}
 */
module.exports = function request(req, settings) {


  /**
   * The request's original URL string.
   * @type {String}
   * @see {@link https://nodejs.org/api/http.html#http_message_url}
   * @private
   */
  const originalUrl = req.url;


  /**
   * @type {Request}
   */
  const requestObj = {


    /**
     * Parses the `Content-Type` header, if it exists, for the character set
     * of the request. The content-type module throws if the string is invalid,
     * so it must be wrapped in a try/catch block.
     * @return {String}
     * @see {@link https://github.com/jshttp/content-type#contenttypeparsestring}
     * @public
     */
    get charset() {
      let type = req.headers['content-type'];

      if (!type) {
        return '';
      }

      try {
        type = contentType.parse(type);
      } catch (e) {
        return '';
      }

      return type.parameters.charset || '';
    },


    /**
     * Retrieves the specified header field from the request's headers object.
     * Must account for the misspelling of the HTTP `Referer` header.
     * @param  {String} field
     * @return {String}
     * @public
     */
    header: function getHeader(field) {


      /**
       * The canonical HTTP header name of the specified header field. Headers
       * are all lowercased in the Node.js HTTP module.
       * @type {String}
       * @see {@link https://nodejs.org/api/http.html#http_message_headers}
       */
      const canonical = field.toLowerCase();

      switch (canonical) {
        case 'referrer':
        case 'referer':
          return req.headers.referrer || req.headers.referer || '';
        default:
          return req.headers[canonical] || '';
      }
    },


    /**
     * Returns the request's HTTP headers object.
     * @return {Object}
     * @see {@link https://nodejs.org/api/http.html#http_message_headers}
     * @public
     */
    get headers() {
      return req.headers;
    },


    /**
     * Returns the contents of the HTTP `Host` header field. Must also support
     * the `X-Forwarded-Host` header.
     * @return {String}
     * @public
     */
    get host() {
      const host = (settings.proxy && req.headers['x-forwarded-host']) || req.headers.host;
      return (host) ? host.split(/\s*,\s*/)[0] : '';
    },


    /**
     * Returns the IP address responsible for the request.
     * @return {String}
     * @public
     */
    get ip() {
      return requestObj.ips[0] || req.socket.remoteAddress || '';
    },


    /**
     * Returns an array of IP addresses from the `X-Forwarded-For` header if
     * the `settings.proxy` is enabled.
     * @return {Array}
     * @public
     */
    get ips() {
      const forwarded = req.headers['x-forwarded-for'];
      return (settings.proxy && forwarded) ? forwarded.split(/\s*,\s*/) : [];
    },


    /**
     * Returns the `Content-Length` header if it exists and `0` otherwise.
     * @return {Number}
     * @public
     */
    get length() {
      const length = req.headers['content-length'];
      return (length) ? ~~length : 0;
    },


    /**
     * Returns the request's HTTP method.
     * @return {String}
     * @see {@link https://nodejs.org/api/http.html#http_message_method}
     * @public
     */
    get method() {
      return req.method;
    },


    /**
     * Returns the origin of the request.
     * @return {String}
     * @public
     */
    get origin() {
      return `${requestObj.protocol}://${requestObj.host}`;
    },


    /**
     * Returns the request's original URL string.
     * @return {String}
     * @see {@link https://nodejs.org/api/http.html#http_message_url}
     * @public
     */
    get originalUrl() {
      return originalUrl;
    },


    /**
     * Returns the HTTP protocol that the request was made with.
     * @return {String}
     * @public
     */
    get protocol() {
      if (req.socket.encrypted) {
        return 'https';
      } else if (!settings.proxy) {
        return 'http';
      }

      const proto = req.headers['x-forwarded-proto'];
      return (proto) ? proto.split(/\s*,\s*/)[0] : 'http';
    },


    /**
     * Returns the query string from the request url, sans `?` character.
     * @return {String}
     * @public
     */
    get querystring() {
      const index = req.url.indexOf('?');
      return (index >= 0) ? req.url.substring(index + 1) : '';
    },


    /**
     * Returns `true` if the request was made via HTTPS protocol.
     * @return {Boolean}
     * @public
     */
    get secure() {
      return requestObj.protocol === 'https';
    },


    /**
     * Returns the Socket object associated with the connection that made the
     * request.
     * @return {Socket}
     * @see {@link https://nodejs.org/api/http.html#http_message_socket}
     * @public
     */
    get socket() {
      return req.socket;
    },


    /**
     * Returns the request's MIME type.
     * @return {String}
     * @public
     */
    get type() {
      const type = req.headers['content-type'];
      return (type) ? type.split(/\s*;\s*/)[0] : '';
    },


    /**
     * Returns the request's URL string, which may have been modified.
     * @return {String}
     * @see {@link https://nodejs.org/api/http.html#http_message_url}
     * @public
     */
    get url() {
      return req.url;
    },


    /**
     * Sets the request's URL string, enabling URL rewriting for request
     * routing purposes.
     * @param  {String} url
     * @return {Request}
     * @public
     */
    set url(url) {
      req.url = url;
      return requestObj;
    }
  };

  return requestObj;
};
