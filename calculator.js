// @ts-check
/// <reference path="gearmath.js" />
/// <reference path="transmissions.js" />

// --- Constants ---
// Unit constants and the speed/turns math are in gearmath.js
const RPM_START = 500;
const RPM_END = 7000; // Adjust max RPM if needed
const RPM_STEP = 250;

// --- DOM Elements ---
const transmissionSelect = /** @type {HTMLSelectElement} */ (document.getElementById('transmissionSelect'));
const finalDriveInput = /** @type {HTMLInputElement} */ (document.getElementById('finalDrive'));
const transferCaseInput = /** @type {HTMLInputElement} */ (document.getElementById('transferCase'));
const tireSizeInput = /** @type {HTMLInputElement} */ (document.getElementById('tireSize'));
const unloadedDiameterHint = /** @type {HTMLElement} */ (document.getElementById('unloadedDiameterHint'));
const rollingDiameterInput = /** @type {HTMLInputElement} */ (document.getElementById('rollingDiameter'));
const resultsTable = /** @type {HTMLTableElement} */ (document.getElementById('resultsTable'));
const resultsTableHead = /** @type {HTMLTableSectionElement} */ (resultsTable.querySelector('thead'));
const resultsTableBody = /** @type {HTMLTableSectionElement} */ (resultsTable.querySelector('tbody'));
const gearRatioTable = /** @type {HTMLTableElement} */ (document.getElementById('gearRatioTable'));
const gearRatioTableHead = /** @type {HTMLTableSectionElement} */ (gearRatioTable.querySelector('thead'));
const gearRatioTableBody = /** @type {HTMLTableSectionElement} */ (gearRatioTable.querySelector('tbody'));
const gearRatioTableCaption = /** @type {HTMLElement} */ (document.getElementById('gearRatioTableCaption'));
const selectPrompt = /** @type {HTMLElement} */ (document.getElementById('selectPrompt'));
const errorMessageDisplay = /** @type {HTMLElement} */ (document.getElementById('errorMessage'));
const unitSelect = /** @type {HTMLSelectElement} */ (document.getElementById('unitSelect'));
const speedUnitLabel = /** @type {HTMLElement} */ (document.getElementById('speedUnitLabel'));

// Display Elements
const displayTireDiameter = /** @type {HTMLOutputElement} */ (document.getElementById('displayTireDiameter'));
const displayTireCircumference = /** @type {HTMLOutputElement} */ (document.getElementById('displayTireCircumference'));
const displayDriveshaftTurns = /** @type {HTMLOutputElement} */ (document.getElementById('displayDriveshaftTurns'));
const displayOutputTurns = /** @type {HTMLOutputElement} */ (document.getElementById('displayOutputTurns'));


// --- Global State ---
let currentUnitSystem = 'imperial';
// Rolling diameter in inches: null when the field is empty, NaN when it holds a bad value.
// Re-read only when the user edits the field, so unit switches never drift.
/** @type {number | null} */
let rollingDiameterInches = null;

// --- Functions ---

/**
 * @param {Transmission} transmission
 * @returns {string} The dropdown text for a transmission.
 */
function transmissionLabel(transmission) {
    const { name, type, ratios, examples } = transmission;
    const exampleText = examples ? `, e.g., ${examples}` : '';
    return `${name} (${ratios.length}-spd ${type}${exampleText})`;
}

function populateTransmissionDropdown() {
    // Clears existing options (except placeholder) and adds the transmissions sorted by name.
    while (transmissionSelect.options.length > 1) {
        transmissionSelect.remove(1);
    }
    const sorted = [...transmissions].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    sorted.forEach(transmission => {
        const label = transmissionLabel(transmission);
        const option = document.createElement('option');
        option.value = transmission.name;
        option.textContent = label;
        transmissionSelect.appendChild(option);
    });
}

/**
 * @param {string} name
 * @returns {Transmission | undefined}
 */
function findTransmission(name) {
    return transmissions.find(transmission => transmission.name === name);
}

/**
 * Formats a length held in inches in the current unit system.
 * @param {number} inches
 * @returns {string}
 */
function formatLength(inches) {
    if (currentUnitSystem === 'metric') {
        return `${(inches * MM_PER_INCH).toFixed(1)} mm`;
    }
    return `${inches.toFixed(2)} in`;
}

/**
 * @param {HTMLInputElement} input
 * @param {boolean} isInvalid
 */
function setInvalid(input, isInvalid) {
    if (isInvalid) {
        input.setAttribute('aria-invalid', 'true');
    } else {
        input.removeAttribute('aria-invalid');
    }
}

/**
 * @param {HTMLTableRowElement} row
 * @param {string} text
 */
function appendHeaderCell(row, text) {
    const th = document.createElement('th');
    th.textContent = text;
    row.appendChild(th);
}

/**
 * Whether the Tire Size field should show as invalid. An empty tire size is not an error while a
 * valid rolling diameter is entered: the user has bypassed the tire size. A mistyped one still is.
 * @returns {boolean}
 */
function isTireSizeFlagged() {
    if (unloadedDiameterInches(tireSizeInput.value) !== null) return false;
    const isBypassed = tireSizeInput.value.trim() === ''
        && rollingDiameterInches !== null && !isNaN(rollingDiameterInches);
    return !isBypassed;
}

// --- Tire size input mask ---
// Insertions that would leave text no tire size can start with are refused; deletions always go through.
// beforeinput refuses them before they land; the input fallback undoes any that land anyway (browsers or
// IME paths where beforeinput cannot be cancelled), restoring the last accepted value and caret.
const TIRE_SIZE_BLOCKED_INSERTS = ['insertText', 'insertFromPaste', 'insertFromDrop', 'insertReplacementText'];
let tireSizeAccepted = { value: tireSizeInput.value, start: 0, end: 0 };

function rememberTireSizeAccepted() {
    tireSizeAccepted = {
        value: tireSizeInput.value,
        start: tireSizeInput.selectionStart ?? tireSizeInput.value.length,
        end: tireSizeInput.selectionEnd ?? tireSizeInput.value.length,
    };
}

function restoreTireSizeAccepted() {
    tireSizeInput.value = tireSizeAccepted.value;
    tireSizeInput.setSelectionRange(tireSizeAccepted.start, tireSizeAccepted.end);
}

/**
 * @param {InputEvent} e
 */
function maskTireSizeBeforeInput(e) {
    // Remember the caret before the edit, so a refused edit can put it back
    if (tireSizeInput.value === tireSizeAccepted.value) rememberTireSizeAccepted();
    if (e.isComposing || !TIRE_SIZE_BLOCKED_INSERTS.includes(e.inputType)) return;
    const rawData = e.data ?? (e.dataTransfer ? e.dataTransfer.getData('text/plain') : '');
    // Pasted or dropped text is trimmed: copied sizes often carry spaces at either end
    const isPaste = e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop';
    const data = isPaste ? rawData.trim() : rawData;
    const value = tireSizeInput.value;
    const start = tireSizeInput.selectionStart ?? value.length;
    const end = tireSizeInput.selectionEnd ?? value.length;
    const candidate = value.slice(0, start) + data + value.slice(end);
    if (!isTireSizePrefix(candidate)) {
        e.preventDefault();
    } else if (data !== rawData) {
        // The browser would insert the untrimmed text, so insert the trimmed text instead
        e.preventDefault();
        tireSizeInput.setRangeText(data, start, end, 'end');
        tireSizeInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

/**
 * Undoes an insertion that landed although it leaves no possible tire size.
 * @param {Event} e An input event, or compositionend once an IME commits its text.
 */
function maskTireSizeAfterInput(e) {
    if (e instanceof InputEvent && e.isComposing) return; // checked again on compositionend
    const inputType = e instanceof InputEvent ? e.inputType : '';
    // Without an inputType (older browsers, compositionend), a longer value is taken as an insertion
    const isInsertion = inputType
        ? inputType.startsWith('insert')
        : tireSizeInput.value.length > tireSizeAccepted.value.length;
    if (isInsertion && !isTireSizePrefix(tireSizeInput.value)) {
        restoreTireSizeAccepted();
    } else {
        rememberTireSizeAccepted();
    }
}

// Only one of Tire Size and Rolling Diameter is active: committing a valid entry in one clears the other.

function commitTireSize() {
    // A valid tire size clears the rolling diameter; a mistyped one leaves it alone
    if (unloadedDiameterInches(tireSizeInput.value) !== null) {
        rollingDiameterInput.value = '';
        rollingDiameterInches = null;
    }
    calculateAndDisplaySpeeds();
}

function commitRollingDiameter() {
    // A valid rolling diameter clears the tire size
    readRollingDiameter();
    if (rollingDiameterInches !== null && !isNaN(rollingDiameterInches)) {
        tireSizeInput.value = '';
        rememberTireSizeAccepted();
    }
    calculateAndDisplaySpeeds();
}

function readRollingDiameter() {
    // Reads the Rolling Diameter field (current units) into rollingDiameterInches.
    const text = rollingDiameterInput.value.trim();
    if (text === '' && !(rollingDiameterInput.validity && rollingDiameterInput.validity.badInput)) {
        rollingDiameterInches = null;
        return;
    }
    const value = Number(text);
    if (text === '' || isNaN(value) || !isFinite(value) || value <= 0) {
        rollingDiameterInches = NaN;
        return;
    }
    rollingDiameterInches = currentUnitSystem === 'metric' ? value * INCHES_PER_MM : value;
}

function displayRollingDiameter() {
    // Re-displays the held rolling diameter in the current units (empty or bad values are left as typed).
    if (rollingDiameterInches === null || isNaN(rollingDiameterInches)) return;
    const value = currentUnitSystem === 'metric'
        ? parseFloat((rollingDiameterInches * MM_PER_INCH).toFixed(1))
        : parseFloat(rollingDiameterInches.toFixed(2));
    rollingDiameterInput.value = String(value);
}

function calculateAndDisplaySpeeds() {
    // Main function: validates inputs, calculates results, and updates the UI.

    // --- 1. Clear previous output state ---
    resultsTableHead.innerHTML = '';
    resultsTableBody.innerHTML = '';
    gearRatioTableHead.innerHTML = '';
    gearRatioTableBody.innerHTML = '';
    errorMessageDisplay.textContent = '';
    speedUnitLabel.textContent = currentUnitSystem === 'metric' ? 'KPH' : 'MPH';

    // --- 2. Get current input values ---
    const selectedTransmissionName = transmissionSelect.value;
    const transmission = findTransmission(selectedTransmissionName);
    const gearRatios = transmission ? transmission.ratios : null;
    const finalDriveRatio = parseFloat(finalDriveInput.value);
    const transferCaseRatio = parseFloat(transferCaseInput.value);
    const unloadedInches = unloadedDiameterInches(tireSizeInput.value);

    gearRatioTableCaption.textContent = 'Gear Ratios';

    // --- 3. Validate core inputs (messages in page order) ---
    let errorMessages = [];
    let isFinalDriveValid = !isNaN(finalDriveRatio) && finalDriveRatio > 0 && isFinite(finalDriveRatio);
    setInvalid(finalDriveInput, !isFinalDriveValid);
    if (!isFinalDriveValid) {
        errorMessages.push("Invalid Final Drive Ratio.");
    }

    let isTransferCaseValid = !isNaN(transferCaseRatio) && transferCaseRatio > 0 && isFinite(transferCaseRatio);
    setInvalid(transferCaseInput, !isTransferCaseValid);
    if (!isTransferCaseValid) {
        errorMessages.push("Invalid Transfer Case Ratio.");
    }

    const isTireSizeValid = unloadedInches !== null;
    const isTireSizeFlaggedNow = isTireSizeFlagged();
    setInvalid(tireSizeInput, isTireSizeFlaggedNow);
    if (isTireSizeFlaggedNow) {
        errorMessages.push("Invalid tire size.");
    }
    unloadedDiameterHint.textContent = isTireSizeValid ? `unloaded ${formatLength(unloadedInches)}` : '-';
    rollingDiameterInput.placeholder = isTireSizeValid
        ? `${formatLength(unloadedInches)} (from tire size)`
        : `Rolling diameter (${currentUnitSystem === 'metric' ? 'mm' : 'in'})`;

    let isRollingDiameterValid = rollingDiameterInches === null || !isNaN(rollingDiameterInches);
    setInvalid(rollingDiameterInput, !isRollingDiameterValid);
    if (!isRollingDiameterValid) {
        errorMessages.push("Invalid Rolling Diameter.");
    }

    // Diameter in use: the rolling diameter when filled, else the unloaded diameter from the tire size
    /** @type {number | null} */
    let tireDiameterInches = null;
    let tireDiameterSource = '';
    if (rollingDiameterInches !== null) {
        if (isRollingDiameterValid) {
            tireDiameterInches = rollingDiameterInches;
            tireDiameterSource = 'rolling';
        }
    } else if (isTireSizeValid) {
        tireDiameterInches = unloadedInches;
        tireDiameterSource = 'unloaded, from tire size';
    }

    // --- 4. Calculate & Display Tire Diameter, Circumference, Driveshaft and Output Turns ---
    if (tireDiameterInches !== null) {
        displayTireDiameter.value = `${formatLength(tireDiameterInches)} (${tireDiameterSource})`;
        displayTireCircumference.value = formatLength(tireDiameterInches * Math.PI);

        if (isFinalDriveValid) {
            const distanceUnit = currentUnitSystem === 'metric' ? 'km' : 'mile';
            const turns = driveshaftTurns(finalDriveRatio, tireDiameterInches, currentUnitSystem);
            displayDriveshaftTurns.value = isNaN(turns) || !isFinite(turns) ? '-' : `${turns.toFixed(0)} per ${distanceUnit}`;

            if (isTransferCaseValid) {
                const turnsOut = outputTurns(finalDriveRatio, transferCaseRatio, tireDiameterInches, currentUnitSystem);
                displayOutputTurns.value = isNaN(turnsOut) || !isFinite(turnsOut) ? '-' : `${turnsOut.toFixed(0)} per ${distanceUnit}`;
            } else {
                displayOutputTurns.value = '-';
            }
        } else {
            displayDriveshaftTurns.value = '-';
            displayOutputTurns.value = '-';
        }
    } else {
        displayTireDiameter.value = '-';
        displayTireCircumference.value = '-';
        displayDriveshaftTurns.value = '-';
        displayOutputTurns.value = '-';
    }

    // --- 6. Validate Transmission Selection ---
    const isTransmissionSelected = !!selectedTransmissionName && !!gearRatios && gearRatios.length > 0;
    selectPrompt.hidden = isTransmissionSelected;

    // --- 7. Display Errors and Stop if results cannot be calculated ---
    // A bad tire size does not stop the results when a valid rolling diameter is in use.
    errorMessageDisplay.textContent = errorMessages.join(' ');
    if (!isTransmissionSelected || !isFinalDriveValid || !isTransferCaseValid ||
        !isRollingDiameterValid || tireDiameterInches === null) {
        return;
    }

    // --- 8. Build Gear Ratio Table ---
    const ratioHeaderRow = gearRatioTableHead.insertRow();
    appendHeaderCell(ratioHeaderRow, ''); // Blank top-left cell
    gearRatios.forEach((_, gearIndex) => {
        appendHeaderCell(ratioHeaderRow, `Gear ${gearIndex + 1}`);
    });

    const ratioBodyRow = gearRatioTableBody.insertRow();
    appendHeaderCell(ratioBodyRow, 'Ratio');
    gearRatios.forEach(gearRatio => {
        const ratioCell = ratioBodyRow.insertCell();
        ratioCell.textContent = (gearRatio > 0 && isFinite(gearRatio)) ? gearRatio.toFixed(3) : '-';
    });

    // --- 9. Build Speed Table Header (thead) ---
    const headerRow = resultsTableHead.insertRow();
    appendHeaderCell(headerRow, 'RPM');
    gearRatios.forEach((_, gearIndex) => {
      appendHeaderCell(headerRow, `Gear ${gearIndex + 1}`);
    });

    // --- 10. Build Speed Table Body (tbody) ---
    for (let currentRpm = RPM_START; currentRpm <= RPM_END; currentRpm += RPM_STEP) {
      const speedRow = resultsTableBody.insertRow();
      appendHeaderCell(speedRow, `${currentRpm}`);

      gearRatios.forEach(gearRatio => {
        const speedCell = speedRow.insertCell();

        if (gearRatio <= 0 || !isFinite(gearRatio)) {
          speedCell.textContent = '-';
          speedCell.style.textAlign = 'center';
        } else {
          const speed = speedForGear(currentRpm, gearRatio, transferCaseRatio, finalDriveRatio, tireDiameterInches, currentUnitSystem);
          const displaySpeed = (isNaN(speed) || !isFinite(speed)) ? '-' : speed.toFixed(1);

          if (displaySpeed === '-') {
            speedCell.style.textAlign = 'center';
          }
          speedCell.textContent = displaySpeed;
        }
      });
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    populateTransmissionDropdown();

    function setupEventListeners() {
        unitSelect.addEventListener('change', () => {
            // Diameters are held in inches; only the display changes
            currentUnitSystem = unitSelect.value;
            displayRollingDiameter();
            calculateAndDisplaySpeeds();
        });

        transmissionSelect.addEventListener('change', calculateAndDisplaySpeeds);
        finalDriveInput.addEventListener('change', calculateAndDisplaySpeeds);
        transferCaseInput.addEventListener('change', calculateAndDisplaySpeeds);
        tireSizeInput.addEventListener('change', commitTireSize);
        tireSizeInput.addEventListener('beforeinput', maskTireSizeBeforeInput);
        tireSizeInput.addEventListener('compositionend', (e) => {
            maskTireSizeAfterInput(e);
            setInvalid(tireSizeInput, isTireSizeFlagged());
        });
        // Outline the tire size as invalid key by key; results still update on change or Enter
        tireSizeInput.addEventListener('input', (e) => {
            maskTireSizeAfterInput(e);
            setInvalid(tireSizeInput, isTireSizeFlagged());
        });
        rollingDiameterInput.addEventListener('change', commitRollingDiameter);

        // Recalculate on Enter (keydown, which phone keyboards send for Go/Enter too)
        [finalDriveInput, transferCaseInput, tireSizeInput, rollingDiameterInput].forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    if (input === tireSizeInput) {
                        commitTireSize();
                    } else if (input === rollingDiameterInput) {
                        commitRollingDiameter();
                    } else {
                        calculateAndDisplaySpeeds();
                    }
                    e.preventDefault();
                }
            });
        });
    }

    setupEventListeners();
    calculateAndDisplaySpeeds(); // Initial calculation
});