/**
 * Slantapp code and properties {www.slantapp.io}
 */
class CoreError extends Error {
    constructor(msg, code) {
        super(msg);
        this.statusCode = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.CoreError = CoreError;
//json parser function
exports.JParser = (m, s, d) => ({ message: m, status: s, data: d });
//ascii code generator
exports.AsciiCodes = function generateChar(length) {
    //populate and store ascii codes
    let charArray = [];
    let code = [];
    for (let i = 33; i <= 126; i++) charArray.push(String.fromCharCode(i));
    //do range random here
    for (let i = 0; i <= length; i++) {
        code.push(charArray[Math.floor(Math.random() * charArray.length - 1)]);
    }
    return code.join("");
}

exports.generateUniqueID = (location) => {
    let prefix = location.substring(0, 3).toUpperCase();
    const randomString = Math.random().toString(36).substring(2, 5);
    const uniqueNumber = Date.now().toString().slice(-5);
    const uniqueID = `${prefix}${randomString}${uniqueNumber}`;

    return uniqueID;
}
