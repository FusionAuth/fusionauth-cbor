const { test } = require('uvu');
const assert = require('uvu/assert');
const decode = require('../lib/decode');
const Decimal = require('decimal.js');

test('parseUnsignedInteger_valueInAdditionalInfo', () => {
    // Values 0-23 should return the same value
    for (let i = 0; i < 24; i++) {
        assert.ok(decode.parseUnsignedInteger(new Uint8Array([i]), 0).equals(i));
    }
});

test('parseUnsignedInteger_additionalBytes', () => {
    assert.ok(decode.parseUnsignedInteger(new Uint8Array([24, 237]), 0).equals('237'));
    assert.ok(decode.parseUnsignedInteger(new Uint8Array([25, 0x01, 0xf4]), 0).equals('500'));
    assert.ok(decode.parseUnsignedInteger(new Uint8Array([26, 0xfc, 0xba, 0x03, 0xbb]), 0).equals('4240049083'));
    assert.ok(decode.parseUnsignedInteger(new Uint8Array([27, 0xb6, 0x93, 0x4d, 0xc3, 0xf7, 0x04, 0x80, 0x3f]), 0).equals('13155944440537579583'));
});

test.run();