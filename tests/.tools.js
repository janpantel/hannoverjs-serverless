const urljoin = require('url-join');
const baseApiUrl = process.env.SLS_BASE_URL;

module.exports.apiUrl = (path => urljoin(baseApiUrl, path));
