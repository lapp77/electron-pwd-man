const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = process.env.SECRET_KEY;

exports.encrypt = function (text) {
    let cipher = crypto.createCipher(algorithm, secretKey);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function(text) {
    let decipher = crypto.createDecipher(algorithm, secretKey);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};