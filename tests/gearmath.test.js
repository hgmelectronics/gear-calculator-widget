const test = require('node:test');
const assert = require('node:assert/strict');
const {
    unloadedDiameterInches,
    isTireSizePrefix,
    TIRE_SIZE_TRANSITIONS,
    speedForGear,
    driveshaftTurns,
    outputTurns,
    MM_PER_INCH,
} = require('./load-site.js').loadSite();

function assertClose(actual, expected, tolerance, message) {
    assert.ok(Math.abs(actual - expected) <= tolerance, `${message || ''} expected ${expected}, got ${actual}`);
}

test('metric tire sizes parse to the unloaded diameter', () => {
    const expected225_60_16 = 225 * 0.60 * 2 / 25.4 + 16;
    const sizes = [
        '225/60R16',
        'P225/60R16',
        'p225/60r16',
        '225/60ZR16',
        '225/60D16',
        '225/60B16',
        '225/60-16',
        '225/60 R 16',
        '225/60R16 98H',
        '  225/60R16  ',
    ];
    sizes.forEach(size => assertClose(unloadedDiameterInches(size), expected225_60_16, 1e-9, size));
    assertClose(unloadedDiameterInches('LT265/75R16 121S'), 265 * 0.75 * 2 / 25.4 + 16, 1e-9, 'LT');
    assertClose(unloadedDiameterInches('ST225/75R15'), 225 * 0.75 * 2 / 25.4 + 15, 1e-9, 'ST');
    assertClose(unloadedDiameterInches('T135/70R16'), 135 * 0.70 * 2 / 25.4 + 16, 1e-9, 'T');
    assertClose(unloadedDiameterInches('225/70R19.5'), 225 * 0.70 * 2 / 25.4 + 19.5, 1e-9, 'decimal rim');
    assertClose(unloadedDiameterInches('205/55R9'), 205 * 0.55 * 2 / 25.4 + 9, 1e-9, 'one-digit rim');
});

test('225/60R16 is 26.63 in', () => {
    assert.equal(unloadedDiameterInches('225/60R16').toFixed(2), '26.63');
});

test('flotation tire sizes parse to the first number in inches', () => {
    assert.equal(unloadedDiameterInches('33x12.50R15'), 33);
    assert.equal(unloadedDiameterInches('35x12.50-17'), 35);
    assert.equal(unloadedDiameterInches('33X12.50 R 15 LT'), 33);
    assert.equal(unloadedDiameterInches('37x13.50R20 LT'), 37);
    assert.equal(unloadedDiameterInches('31.5x10.50R15'), 31.5);
});

test('a bare number is the diameter in inches', () => {
    assert.equal(unloadedDiameterInches('35'), 35);
    assert.equal(unloadedDiameterInches('27.8'), 27.8);
});

test('load and speed codes after the rim are accepted', () => {
    assertClose(unloadedDiameterInches('LT265/75R16 121/118S'), 265 * 0.75 * 2 / 25.4 + 16, 1e-9, 'dual load index');
    assertClose(unloadedDiameterInches('lt265/75r16 123S'), 265 * 0.75 * 2 / 25.4 + 16, 1e-9, 'lower case');
    assertClose(unloadedDiameterInches('215/75R17.5'), 215 * 0.75 * 2 / 25.4 + 17.5, 1e-9, 'decimal rim');
});

test('bad tire sizes are rejected', () => {
    ['', 'abc', '225/60', '0', '-5', '225/60R', '27.8 in', '706 mm', '27.8"', '225/60X16', '0x12.50R15',
        '225/60R16 98H!', '33x12.50R15 LT#']
        .forEach(size => assert.equal(unloadedDiameterInches(size), null, `"${size}"`));
});

const VALID_TIRE_SIZES = [
    '225/60R16',
    'P225/60 R 16',
    'LT265/75R16 121S',
    'lt265/75r16 123S',
    'ST225/75R15',
    'T135/70R16',
    '225/60-16',
    '225/60D16',
    '225/60B16',
    '245/40ZR18 94Y',
    '215/75R17.5',
    '225/60R16 98H',
    '33x12.50R15',
    '35x12.50-17',
    '33X12.50 R 15 LT',
    '35',
    '27.8',
    '.5',
    'LT265/75R16 121/118S',
];

test('every prefix of a valid tire size can still be completed', () => {
    VALID_TIRE_SIZES.forEach(size => {
        assert.notEqual(unloadedDiameterInches(size), null, `"${size}" parses`);
        for (let length = 0; length <= size.length; length++) {
            const prefix = size.slice(0, length);
            assert.ok(isTireSizePrefix(prefix), `"${prefix}" (from "${size}")`);
        }
        assert.ok(isTireSizePrefix(`${size}  `), `"${size}" with trailing spaces`);
    });
});

test('text that cannot become a valid tire size is not a prefix', () => {
    ['225a', '225/6x', '#', '2#', '225//', '225/600', 'LT2a', 'P2/', '33xx', '225/60R16 98H!', ' 225', '225/60Q', '2256', '33x125', '123x12.50R15']
        .forEach(text => assert.equal(isTireSizePrefix(text), false, `"${text}"`));
});

test('every state named in the tire size state machine exists', () => {
    Object.values(TIRE_SIZE_TRANSITIONS).forEach(transitions => {
        transitions.forEach(([, nextState]) => assert.ok(nextState in TIRE_SIZE_TRANSITIONS, nextState));
    });
});

test('the mask accepts every prefix of every size the parser accepts', () => {
    // Mutates the valid examples with a fixed seed; whatever the parser still accepts must pass the mask
    // at every length. Strings starting with whitespace are left out: the parser trims them, the mask does not.
    let seed = 12345;
    const random = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
    };
    const alphabet = '0123456789/.xXzZrRdDbBlLtTsSpP- ';
    let accepted = 0;
    for (let i = 0; i < 20000; i++) {
        let text = VALID_TIRE_SIZES[Math.floor(random() * VALID_TIRE_SIZES.length)];
        const edits = 1 + Math.floor(random() * 3);
        for (let e = 0; e < edits; e++) {
            const at = Math.floor(random() * (text.length + 1));
            const ch = alphabet[Math.floor(random() * alphabet.length)];
            const kind = random();
            if (kind < 0.4) {
                text = text.slice(0, at) + ch + text.slice(at);
            } else if (kind < 0.7) {
                text = text.slice(0, at) + text.slice(at + 1);
            } else {
                text = text.slice(0, at) + ch + text.slice(at + 1);
            }
        }
        if (/^\s/.test(text) || unloadedDiameterInches(text) === null) continue;
        accepted++;
        for (let length = 0; length <= text.length; length++) {
            assert.ok(isTireSizePrefix(text.slice(0, length)), `"${text.slice(0, length)}" (from "${text}")`);
        }
    }
    assert.ok(accepted > 1000, `only ${accepted} mutated sizes parsed`);
});

test('speed for a gear, imperial and metric', () => {
    // 3000 rpm, 1:1 gear, 3.73 final drive, 26.63 in tire
    const diameter = unloadedDiameterInches('225/60R16');
    const expectedMph = (3000 / 3.73) * diameter * Math.PI * 60 / 63360;
    assertClose(speedForGear(3000, 1.0, 1.0, 3.73, diameter, 'imperial'), expectedMph, 1e-9);
    assertClose(speedForGear(3000, 1.0, 1.0, 3.73, diameter, 'metric'), expectedMph * 1.609344, 1e-9);
    assertClose(speedForGear(3000, 1.0, 1.0, 3.73, diameter, 'imperial'), 63.72, 0.01);
});

test('speed includes the transfer case ratio', () => {
    const plain = speedForGear(2000, 2.84, 1.0, 4.10, 33, 'imperial');
    const lowRange = speedForGear(2000, 2.84, 2.72, 4.10, 33, 'imperial');
    assertClose(lowRange, plain / 2.72, 1e-9);
});

test('driveshaft and output turns', () => {
    const diameter = 26.63;
    const perMile = driveshaftTurns(3.73, diameter, 'imperial');
    assertClose(perMile, 63360 / (diameter * Math.PI) * 3.73, 1e-9);
    const perKm = driveshaftTurns(3.73, diameter, 'metric');
    assertClose(perKm, 1000000 / (diameter * MM_PER_INCH * Math.PI) * 3.73, 1e-9);
    assertClose(outputTurns(3.73, 2.72, diameter, 'imperial'), perMile * 2.72, 1e-9);
    assertClose(outputTurns(3.73, 1.0, diameter, 'imperial'), perMile, 1e-9);
});
