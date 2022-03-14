const crypto = require('crypto')

//Auth vars
exports.code_verifier = crypto.randomBytes(43).toString('hex'); //Get 86 char-long string
let hash = crypto.createHash('sha256');
hash.update(code_verifier);
exports.code_challenge  = hash.digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');