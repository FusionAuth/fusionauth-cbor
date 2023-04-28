/**
 * Parse an unsigned integer value from the given bytes
 * 
 * @param {Uint8Array} buf A buffer containing CBOR-encoded data
 * @param {number} start The start index in the buffer for the unsigned integer to be parsed
 */
exports.parseUnsignedInteger = function(buf, start = 0) {
    const ib = buf.at(start);
    const mt = ib >> 5;
    if (mt !== 0) {
        throw new Error('Expected major type 0 but got ' + mt);
    }

    const ai = ib & 0x1f;
    // 28-30 are reserved, 31 is not valid for this type
    if (ai >= 28) {
        throw new Error('Malformed additional information for unsigned int ' + ai);
    }

    // The additional information contains the value
    if (ai < 24) {
        return ai;
    }

    const len = Math.pow(2, ai - 24);
    let val = 0;
    for (let i = 0; i < len; i++) {
        val <<= 8;
        val += buf.at(start + i + 1);
        console.log(val.toString(16));
    }

    return val;
}