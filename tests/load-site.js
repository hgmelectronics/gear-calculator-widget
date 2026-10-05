const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

/**
 * Runs gearmath.js and transmissions.js the way the page loads them: as plain scripts sharing one global scope.
 * Top-level `const` declarations live in that shared scope but do not become properties of the context
 * object (only `function` and `var` declarations do), so a final expression run in the same context
 * collects the bindings the tests need.
 */
function loadSite() {
    const context = vm.createContext({});
    ['gearmath.js', 'transmissions.js'].forEach(file => {
        const filePath = path.join(__dirname, '..', file);
        vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
    });
    return vm.runInContext(`({
        INCHES_PER_MM,
        MM_PER_INCH,
        INCHES_PER_MILE,
        MM_PER_KM,
        unloadedDiameterInches,
        isTireSizePrefix,
        TIRE_SIZE_TRANSITIONS,
        speedForGear,
        driveshaftTurns,
        outputTurns,
        transmissions,
    })`, context);
}

module.exports = { loadSite };
