/**
 * @link https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Response_fields
 */
export enum ResponseHeader {
  /**
   * Specifying which web sites can participate in cross-origin resource sharing.
   *
   * @example Access-Control-Allow-Origin: *
   */
  AccessControlAllowOrigin = 'Access-Control-Allow-Origin',

  /**
   * Specifying which web sites can participate in cross-origin resource sharing.
   *
   * @example Access-Control-Allow-Origin: *
   */
  AccessControlAllowCredentials = 'Access-Control-Allow-Credentials',

  /**
   * Specifying which web sites can participate in cross-origin resource sharing.
   *
   * @example Access-Control-Allow-Origin: *
   */
  AccessControlExposeHeaders = 'Access-Control-Expose-Headers',

  /**
   * Specifying which web sites can participate in cross-origin resource sharing.
   *
   * @example Access-Control-Allow-Origin: *
   */
  AccessControlMaxAge = 'Access-Control-Max-Age',

  /**
   * Specifying which web sites can participate in cross-origin resource sharing.
   *
   * @example Access-Control-Allow-Origin: *
   */
  AccessControlAllowMethods = 'Access-Control-Allow-Methods',

  /**
   * Specifying which web sites can participate in cross-origin resource sharing.
   *
   * @example Access-Control-Allow-Origin: *
   */
  AccessControlAllowHeaders = 'Access-Control-Allow-Headers',

  /**
   * Specifies which patch document formats this server supports.
   *
   * @example Accept-Patch: text/example;charset=utf-8
   */
  AcceptPatch = 'Accept-Patch',

  /**
   * What partial content range types this server supports via byte serving
   *
   * @example Accept-Ranges: bytes
   */
  AcceptRanges = 'Accept-Ranges',

  /**
   * The age the object has been in a proxy cache in seconds.
   *
   * @example Age: 12
   */
  Age = 'Age',

  /**
   * Valid methods for a specified resource. To be used for a 405 Method not allowed.
   *
   * @example Allow: GET, HEAD
   */
  Allow = 'Allow',

  /**
   * A server uses "Alt-Svc" header (meaning Alternative Services) to indicate that its resources
   * can also be accessed at a different network location (host or port) or using a different protocol.
   *
   * @example Alt-Svc: http/1.1="http2.example.com:8001"; ma=7200
   */
  AltSvc = 'Alt-Svc',

  /**
   * Tells all caching mechanisms from server to client whether they may cache this object. It is measured in seconds.
   *
   * @example Cache-Control: max-age=3600
   */
  CacheControl = 'Cache-Control',

  /**
   * Control options for the current connection and list of hop-by-hop response fields.
   *
   * @example Connection: close
   */
  Connection = 'Connection',

  /**
   * An opportunity to raise a "File Download" dialogue box for a known MIME type with binary format
   * or suggest a filename for dynamic content. Quotes are necessary with special characters.
   *
   * @example Content-Disposition: attachment; filename="fname.ext"
   */
  ContentDisposition = 'Content-Disposition',

  /**
   * The type of encoding used on the data. See HTTP compression.
   *
   * @example Content-Encoding: gzip
   */
  ContentEncoding = 'Content-Encoding',

  /**
   * The natural language or languages of the intended audience for the enclosed content.
   *
   * @example Content-Language: da
   */
  ContentLanguage = 'Content-Language',

  /**
   * The length of the response body in octets (8-bit bytes)
   *
   * @example Content-Length: 348
   */
  ContentLength = 'Content-Length',

  /**
   * An alternate location for the returned data.
   *
   * @example Content-Location: /index.htm
   */
  ContentLocation = 'Content-Location',

  /**
   * A Base64-encoded binary MD5 sum of the content of the response.
   *
   * @example Content-MD5: Q2hlY2sgSW50ZWdyaXR5IQ==
   *
   * @deprecated see https://tools.ietf.org/html/rfc7231#appendix-B
   */
  ContentMD5 = 'Content-MD5',

  /**
   * Where in a full body message this partial message belongs.
   *
   * @example Content-Range: bytes 21010-47021/47022
   */
  ContentRange = 'Content-Range',

  /**
   * The MIME type of this content.
   *
   * @example Content-Type: text/html; charset=utf-8
   */
  ContentType = 'Content-Type',

  /**
   * The date and time that the message was sent (in "HTTP-date" format as defined by RFC 7231).
   *
   * @example Date: Tue, 15 Nov 1994 08:12:31 GMT
   */
  Date = 'Date',

  /**
   * Specifies the delta-encoding entity tag of the response.
   *
   * @example Delta-Base: "abc"
   */
  DeltaBase = 'Delta-Base',

  /**
   * An identifier for a specific version of a resource, often a message digest.
   *
   * @example ETag: "737060cd8c284d8af7ad3082f209582d"
   */
  ETag = 'ETag',

  /**
   * Gives the date/time after which the response is considered stale (in "HTTP-date" format as defined by RFC 7231).
   *
   * @example Expires: Thu, 01 Dec 1994 16:00:00 GMT
   */
  Expires = 'Expires',

  /**
   * Instance-manipulations applied to the response.
   *
   * @example IM: feed
   */
  IM = 'IM',

  /**
   * The last modified date for the requested object (in "HTTP-date" format as defined by RFC 7231).
   *
   * @example Last-Modified: Tue, 15 Nov 1994 12:45:26 GMT
   */
  LastModified = 'Last-Modified',

  /**
   * Used to express a typed relationship with another resource, where the relation type is defined by RFC 5988.
   *
   * @example Link: </feed>; rel="alternate"
   */
  Link = 'Link',

  /**
   * Used in redirection, or when a new resource has been created.
   *
   * @example Location: http://www.w3.org/pub/WWW/People.html
   * @example Location: /pub/WWW/People.html
   */
  Location = 'Location',

  /**
   * This field is supposed to set P3P policy, in the form of P3P:CP="your_compact_policy". However,
   * P3P did not take off,[51] most browsers have never fully implemented it, a lot of websites set this field
   * with fake policy text, that was enough to fool browsers the existence of P3P policy and grant
   * permissions for third party cookies.
   *
   * @example P3P: CP="This is not a P3P policy! See https://en.wikipedia.org/wiki/Special:CentralAutoLogin/P3P for more info."
   */
  P3P = 'P3P',

  /**
   * Implementation-specific fields that may have various effects anywhere along the request-response chain.
   *
   * @example Pragma: no-cache
   */
  Pragma = 'Pragma',

  /**
   * Request authentication to access the proxy.
   *
   * @example Proxy-Authenticate: Basic
   */
  ProxyAuthenticate = 'Proxy-Authenticate',

  /**
   * HTTP Public Key Pinning, announces hash of website's authentic TLS certificate.
   *
   * @example Public-Key-Pins: max-age=2592000; pin-sha256="E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g=";
   */
  PublicKeyPins = 'Public-Key-Pins',

  /**
   * If an entity is temporarily unavailable, this instructs the client to try again later.
   * Value could be a specified period of time (in seconds) or a HTTP-date.
   *
   * @example #1. Retry-After: 120
   * @example #2. Retry-After: Fri, 07 Nov 2014 23:59:59 GMT
   */
  RetryAfter = 'Retry-After',

  /**
   * A name for the server.
   *
   * @example Server: Apache/2.4.1 (Unix)
   */
  Server = 'Server',

  /**
   * An HTTP cookie.
   *
   * @example Set-Cookie: UserID=JohnDoe; Max-Age=3600; Version=1
   */
  SetCookie = 'Set-Cookie',

  /**
   * A HSTS Policy informing the HTTP client how long to cache the HTTPS only policy and whether this applies to subdomains.
   *
   * @example Strict-Transport-Security: max-age=16070400; includeSubDomains
   */
  StrictTransportSecurity = 'Strict-Transport-Security',

  /**
   * The Trailer general field value indicates that the given set of header fields is present in the trailer
   * of a message encoded with chunked transfer coding.
   *
   * @example Trailer: Max-Forwards
   */
  Trailer = 'Trailer',

  /**
   * The form of encoding used to safely transfer the entity to the user.
   * Currently defined methods are: chunked, compress, deflate, gzip, identity.
   *
   * @example Transfer-Encoding: chunked
   */
  TransferEncoding = 'Transfer-Encoding',

  /**
   * Tracking Status header, value suggested to be sent in response to a DNT(do-not-track), possible values:
   *
   * "!" — under construction
   * "?" — dynamic
   * "G" — gateway to multiple parties
   * "N" — not tracking
   * "T" — tracking
   * "C" — tracking with consent
   * "P" — tracking only if consented
   * "D" — disregarding DNT
   * "U" — updated
   *
   * @example Tk: ?
   */
  Tk = 'Tk',

  /**
   * Ask the client to upgrade to another protocol. Must not be used in HTTP/2.
   *
   * @example Upgrade: h2c, HTTPS/1.3, IRC/6.9, RTA/x11, websocket
   */
  Upgrade = 'Upgrade',

  /**
   * Tells downstream proxies how to match future request headers to decide whether the cached response
   * can be used rather than requesting a fresh one from the origin server.
   *
   * @example Vary: *
   * @example Vary: Accept-Language
   */
  Vary = 'Vary',

  /**
   * Informs the client of proxies through which the response was sent.
   *
   * @example Via: 1.0 fred, 1.1 example.com (Apache/1.1)
   */
  Via = 'Via',

  /**
   * A general warning about possible problems with the entity body.
   *
   * @example Warning: 199 Miscellaneous warning
   */
  Warning = 'Warning',

  /**
   * Indicates the authentication scheme that should be used to access the requested entity.
   *
   * @example WWW-Authenticate: Basic
   */
  Authenticate = 'WWW-Authenticate',

  /**
   * Clickjacking protection:
   *
   * deny - no rendering within a frame,
   * sameorigin - no rendering if origin mismatch,
   * allow-from - allow from specified location,
   * allowall - non-standard, allow from any location
   *
   * @example X-Frame-Options: deny
   *
   * @deprecated See https://www.w3.org/TR/CSP11/#frame-ancestors-and-frame-options
   */
  FrameOptions = 'X-Frame-Options',

  /**
   * Content Security Policy definition.
   *
   * @example X-WebKit-CSP: default-src 'self'
   */
  ContentSecurityPolicy = 'Content-Security-Policy',

  /**
   * Used in redirection, or when a new resource has been created. This refresh redirects after 5 seconds.
   * Header extension introduced by Netscape and supported by most web browsers.
   *
   * @example Refresh: 5; url=http://www.w3.org/pub/WWW/People.html
   */
  Refresh = 'Refresh',

  /**
   * CGI header field specifying the status of the HTTP response.
   * Normal HTTP responses use a separate "Status-Line" instead, defined by RFC 7230.
   */
  Status = 'Status',

  /**
   * The Timing-Allow-Origin response header specifies origins that are allowed to see values of attributes
   * retrieved via features of the Resource Timing API, which would otherwise be reported as zero
   * due to cross-origin restrictions.
   *
   * @example #1. Timing-Allow-Origin: *
   * @example #2. Timing-Allow-Origin: <origin>[, <origin>]*
   */
  TimingAllowOrigin = 'Timing-Allow-Origin',

  /**
   * Provide the duration of the audio or video in seconds; only supported by Gecko browsers.
   *
   * @example X-Content-Duration: 42.666
   */
  ContentDuration = 'X-Content-Duration',

  /**
   * The only defined value, "nosniff", prevents Internet Explorer from MIME-sniffing a response away
   * from the declared content-type. This also applies to Google Chrome, when downloading extensions.
   *
   * @example X-Content-Type-Options: nosniff
   */
  ContentTypeOptions = 'X-Content-Type-Options',

  /**
   * Specifies the technology (e.g. ASP.NET, PHP, JBoss) supporting the
   * web application (version details are often in X-Runtime, X-Version, or X-AspNet-Version)
   *
   * @example X-Powered-By: PHP/5.4.0
   */
  PoweredBy = 'X-Powered-By',

  /**
   * Correlates HTTP requests between a client and server.
   *
   * @example X-Request-ID: f058ebd6-02f7-4d3f-942e-904344e8cde5
   */
  RequestID = 'X-Request-ID',

  /**
   * Correlates HTTP requests between a client and server.
   *
   * @example X-Correlation-ID: f058ebd6-02f7-4d3f-942e-904344e8cde5
   */
  CorrelationID = 'X-Correlation-ID',

  /**
   * Recommends the preferred rendering engine (often a backward-compatibility mode) to use to display the content.
   * Also used to activate Chrome Frame in Internet Explorer.
   *
   * @example X-UA-Compatible: IE=EmulateIE7
   * @example X-UA-Compatible: IE=edge
   * @example X-UA-Compatible: Chrome=1
   */
  UACompatible = 'X-UA-Compatible',

  /**
   * Cross-site scripting (XSS) filter.
   *
   * @example X-XSS-Protection: 1; mode=block
   */
  XSSProtection = 'X-XSS-Protection',
}
