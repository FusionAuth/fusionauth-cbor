const Decimal = require('decimal.js');

/**
 * Parse an integer value from the given bytes
 * 
 * @param {Uint8Array} buf A buffer containing CBOR-encoded data
 * @param {number} start The start index in the buffer for the integer to be parsed
 */
exports.parseInteger = function(buf, start = 0) {
    const ib = buf.at(start);
    const mt = ib >> 5;
    if (mt !== 0 && mt !== 1) {
        throw new Error('Expected major type 0 or 1 but got ' + mt);
    }

    const ai = ib & 0x1f;
    // 28-30 are reserved, 31 is not valid for this type
    if (ai >= 28) {
        throw new Error('Malformed additional information for integer ' + ai);
    }

    // The additional information contains the value
    if (ai < 24) {
        if (mt === 0) {
            return new Decimal(ai);
        } else {
            return new Decimal(-1 - ai);
        }
    }

    const len = Math.pow(2, ai - 24);
    let val = new Decimal(0);
    for (let i = 0; i < len; i++) {
        val = val.mul(256).add(buf.at(start + i + 1));
    }

    // Adjust for signed value
    if (mt === 1) {
        return new Decimal(-1).sub(val);
    }

    return val;
}