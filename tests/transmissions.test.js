const test = require('node:test');
const assert = require('node:assert/strict');
const { transmissions } = require('./load-site.js').loadSite();

test('every transmission record has sane data', () => {
    assert.ok(Array.isArray(transmissions) && transmissions.length > 0);
    const names = new Set();
    transmissions.forEach((record, index) => {
        const { name, type, ratios, examples } = record;
        assert.deepEqual(Object.keys(record).sort(), ['examples', 'name', 'ratios', 'type'], `record ${index}: fields`);
        assert.ok(typeof name === 'string' && name.trim().length > 0, `record ${index}: name`);
        assert.ok(!names.has(name), `${name}: duplicate name`);
        names.add(name);
        assert.ok(['automatic', 'manual', 'dct'].includes(type), `${name}: type ${type}`);
        assert.ok(Array.isArray(ratios) && ratios.length > 0, `${name}: ratios`);
        ratios.forEach((ratio, i) => {
            assert.ok(typeof ratio === 'number' && Number.isFinite(ratio) && ratio > 0, `${name}: gear ${i + 1} ratio ${ratio}`);
        });
        assert.equal(typeof examples, 'string', `${name}: examples`);
    });
});

test('the removed transmissions are not listed', () => {
    const removed = [
        'TF-80SC',
        'TG-81SC',
        'B7XA',
        'BAYA',
        'SkyActiv-Drive',
        'K-Series',
        'DQ200',
        'DQ250',
        'DQ500',
        'TY75',
        'TY85',
        'Subaru',
        'PDK',
    ];
    transmissions.forEach(({ name }) => {
        removed.forEach(designation => assert.ok(!name.includes(designation), `${name} contains ${designation}`));
    });
});
