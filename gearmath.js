// @ts-check
// Pure math for the gear calculator. No DOM access, so it also loads in Node for the tests.

// --- Constants ---
const INCHES_PER_MM = 1 / 25.4;
const MM_PER_INCH = 25.4;
const INCHES_PER_MILE = 63360;
const MM_PER_KM = 1000000;

/**
 * @param {string} tireSize Tire size as typed.
 * @returns {number | null} Unloaded diameter in inches, or null when the size cannot be read.
 */
function unloadedDiameterInches(tireSize) {
    // Parses a tire size and returns its unloaded diameter in inches, or null.
    // Metric (225/60R16, LT265/75R16 121S): sidewall height from width and aspect ratio, plus rim.
    // Flotation (33x12.50R15, 35x12.50-17): the first number is the diameter in inches.
    // A bare number (35) is flotation shorthand for the diameter in inches.
    const str = String(tireSize).trim();
    let diameterInches = null;

    // After the rim, an optional suffix of load and speed codes (98H, 121/118S, LT) follows whitespace.
    // isTireSizePrefix() below reads the same language; change both together.
    const metric = str.match(/^(?:LT|ST|P|T)?(\d{3})\/(\d{2})\s*(?:ZR|R|D|B|-)\s*(\d{1,2}(?:\.\d+)?)(?:\s[A-Z0-9\/\s]*)?$/i);
    const flotation = str.match(/^(\d{1,2}(?:\.\d+)?)\s*x\s*\d{1,2}(?:\.\d+)?\s*(?:ZR|R|D|B|-)\s*\d{1,2}(?:\.\d+)?(?:\s[A-Z0-9\/\s]*)?$/i);
    const bare = str.match(/^(\d{1,2}(?:\.\d+)?|\.\d+)$/);

    if (metric) {
        const widthMm = parseInt(metric[1], 10);
        const aspectRatio = parseInt(metric[2], 10) / 100;
        const rimDiameter = parseFloat(metric[3]); // inches
        diameterInches = (widthMm * aspectRatio * INCHES_PER_MM * 2) + rimDiameter;
    } else if (flotation) {
        diameterInches = parseFloat(flotation[1]);
    } else if (bare) {
        diameterInches = parseFloat(bare[1]);
    }

    if (diameterInches === null || isNaN(diameterInches) || !isFinite(diameterInches) || diameterInches <= 0) {
        return null;
    }
    return diameterInches;
}

// Tire size language as a state machine, read one character at a time by isTireSizePrefix().
// It accepts the same strings as the regular expressions in unloadedDiameterInches(), without the
// leading whitespace that the parser trims. Each state lists [character class, next state] pairs;
// a character may lead to more than one state (a leading digit may start a metric width or a
// flotation or bare number), so the reader tracks the set of states it could be in.
// Every state can still reach an accepting state, so a text is a prefix of a valid tire size
// exactly when that set is not empty after its last character.
/** @type {Record<string, Array<[RegExp, string]>>} */
const TIRE_SIZE_TRANSITIONS = {
    start: [[/\d/, 'width1'], [/\d/, 'firstWhole1'], [/\./, 'bareDot'], [/[LS]/i, 'typeLetter'], [/[PT]/i, 'width0']],
    // Metric: optional LT, ST, P or T, then three digits of width and two of aspect ratio
    typeLetter: [[/T/i, 'width0']],
    width0: [[/\d/, 'width1']],
    width1: [[/\d/, 'width2']],
    width2: [[/\d/, 'width3']],
    width3: [[/\//, 'aspect0']],
    aspect0: [[/\d/, 'aspect1']],
    aspect1: [[/\d/, 'beforeConstruction']],
    // Construction (ZR, R, D, B or -) and rim, shared by metric and flotation
    beforeConstruction: [[/\s/, 'beforeConstruction'], [/Z/i, 'constructionZ'], [/[RDB-]/i, 'afterConstruction']],
    constructionZ: [[/R/i, 'afterConstruction']],
    afterConstruction: [[/\s/, 'afterConstruction'], [/\d/, 'rim1']],
    rim1: [[/\d/, 'rim2'], [/\./, 'rimDot'], [/\s/, 'suffix']],
    rim2: [[/\./, 'rimDot'], [/\s/, 'suffix']],
    rimDot: [[/\d/, 'rimFraction']],
    rimFraction: [[/\d/, 'rimFraction'], [/\s/, 'suffix']],
    suffix: [[/[A-Z0-9\/\s]/i, 'suffix']],
    // Flotation (first number, x, second number) and the bare number, which share the first number.
    // Whole parts have at most two digits: no tire is 100 inches or more.
    firstWhole1: [[/\d/, 'firstWhole2'], [/\./, 'firstDot'], [/\s/, 'firstSpace'], [/x/i, 'afterX']],
    firstWhole2: [[/\./, 'firstDot'], [/\s/, 'firstSpace'], [/x/i, 'afterX']],
    firstDot: [[/\d/, 'firstFraction']],
    firstFraction: [[/\d/, 'firstFraction'], [/\s/, 'firstSpace'], [/x/i, 'afterX']],
    firstSpace: [[/\s/, 'firstSpace'], [/x/i, 'afterX']],
    afterX: [[/\s/, 'afterX'], [/\d/, 'secondWhole1']],
    secondWhole1: [
        [/\d/, 'secondWhole2'], [/\./, 'secondDot'],
        [/\s/, 'beforeConstruction'], [/Z/i, 'constructionZ'], [/[RDB-]/i, 'afterConstruction'],
    ],
    secondWhole2: [
        [/\./, 'secondDot'],
        [/\s/, 'beforeConstruction'], [/Z/i, 'constructionZ'], [/[RDB-]/i, 'afterConstruction'],
    ],
    secondDot: [[/\d/, 'secondFraction']],
    secondFraction: [
        [/\d/, 'secondFraction'],
        [/\s/, 'beforeConstruction'], [/Z/i, 'constructionZ'], [/[RDB-]/i, 'afterConstruction'],
    ],
    // Bare number in the .5 form
    bareDot: [[/\d/, 'bareFraction']],
    bareFraction: [[/\d/, 'bareFraction'], [/\s/, 'bareSpace']],
    bareSpace: [[/\s/, 'bareSpace']],
};

/**
 * @param {string} text Tire size text as typed so far.
 * @returns {boolean} Whether more typing can still make the text a valid tire size (true for '').
 */
function isTireSizePrefix(text) {
    let states = new Set(['start']);
    for (const ch of String(text)) {
        /** @type {Set<string>} */
        const next = new Set();
        states.forEach(state => {
            TIRE_SIZE_TRANSITIONS[state].forEach(([charClass, nextState]) => {
                if (charClass.test(ch)) next.add(nextState);
            });
        });
        if (next.size === 0) return false;
        states = next;
    }
    return true;
}

/**
 * @param {number} rpm Engine speed.
 * @param {number} gearRatio
 * @param {number} transferCaseRatio
 * @param {number} finalDriveRatio
 * @param {number} tireDiameterInches
 * @param {string} unitSystem 'metric' or 'imperial'.
 * @returns {number} Vehicle speed in KPH (metric) or MPH (imperial).
 */
function speedForGear(rpm, gearRatio, transferCaseRatio, finalDriveRatio, tireDiameterInches, unitSystem) {
    // Vehicle speed in MPH (imperial) or KPH (metric) at an engine speed in a gear.
    const wheelRpm = rpm / gearRatio / transferCaseRatio / finalDriveRatio;
    if (unitSystem === 'metric') {
        const circumferenceMm = tireDiameterInches * MM_PER_INCH * Math.PI;
        return (wheelRpm * circumferenceMm * 60) / MM_PER_KM;
    }
    const circumferenceInches = tireDiameterInches * Math.PI;
    return (wheelRpm * circumferenceInches * 60) / INCHES_PER_MILE;
}

/**
 * @param {number} finalDriveRatio
 * @param {number} tireDiameterInches
 * @param {string} unitSystem 'metric' or 'imperial'.
 * @returns {number} Driveshaft turns per km (metric) or per mile (imperial).
 */
function driveshaftTurns(finalDriveRatio, tireDiameterInches, unitSystem) {
    // Driveshaft turns per km (metric) or per mile (imperial); excludes the transfer case.
    if (unitSystem === 'metric') {
        return (MM_PER_KM / (tireDiameterInches * MM_PER_INCH * Math.PI)) * finalDriveRatio;
    }
    return (INCHES_PER_MILE / (tireDiameterInches * Math.PI)) * finalDriveRatio;
}

/**
 * @param {number} finalDriveRatio
 * @param {number} transferCaseRatio
 * @param {number} tireDiameterInches
 * @param {string} unitSystem 'metric' or 'imperial'.
 * @returns {number} Transmission output turns per km (metric) or per mile (imperial).
 */
function outputTurns(finalDriveRatio, transferCaseRatio, tireDiameterInches, unitSystem) {
    // Transmission output turns per km (metric) or per mile (imperial); includes the transfer case.
    return driveshaftTurns(finalDriveRatio, tireDiameterInches, unitSystem) * transferCaseRatio;
}
