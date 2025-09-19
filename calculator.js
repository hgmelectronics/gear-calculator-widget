// --- Constants ---
const INCHES_PER_MM = 1 / 25.4;
const MM_PER_INCH = 25.4;
const INCHES_PER_MILE = 63360;
const MM_PER_KM = 1000000;
const RPM_START = 500;
const RPM_END = 7000; // Adjust max RPM if needed
const RPM_STEP = 250;

// --- DOM Elements ---
const transmissionSelect = document.getElementById('transmissionSelect');
const finalDriveInput = document.getElementById('finalDrive');
const tireSizeInput = document.getElementById('tireSize');
const resultsTable = document.getElementById('resultsTable');
const resultsTableHead = resultsTable.querySelector('thead');
const resultsTableBody = resultsTable.querySelector('tbody');
const gearRatioTable = document.getElementById('gearRatioTable');
const gearRatioTableHead = gearRatioTable.querySelector('thead');
const gearRatioTableBody = gearRatioTable.querySelector('tbody');
const gearRatioTableCaption = document.getElementById('gearRatioTableCaption');
const errorMessageDisplay = document.getElementById('errorMessage');
const unitSelect = document.getElementById('unitSelect');
const speedUnitLabel = document.getElementById('speedUnitLabel');

// Display Elements
const displayTireDiameter = document.getElementById('displayTireDiameter');
const displayTireCircumference = document.getElementById('displayTireCircumference');
const displayDriveshaftTurns = document.getElementById('displayDriveshaftTurns');


// --- Global State ---
let currentUnitSystem = 'imperial';

// --- Functions ---

function populateTransmissionDropdown() {
    // Clears existing options (except placeholder) and populates with sorted keys from transmissions object.
    while (transmissionSelect.options.length > 1) {
        transmissionSelect.remove(1);
    }
    const sortedKeys = Object.keys(transmissions).sort();
    sortedKeys.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        transmissionSelect.appendChild(option);
    });
}

function parseTireSize(tireString) {
    // Parses standard tire size string (e.g., "225/60R16") into components.
    const match = tireString.match(/^P?(\d{3})\/?(\d{2})\s?R(\d{2})$/i);
    if (match) {
        return {
            width: parseInt(match[1], 10),         // mm
            aspectRatio: parseInt(match[2], 10) / 100, // decimal
            rimDiameter: parseInt(match[3], 10)    // inches
        };
    }
    return null; // Invalid format
}

function calculateTireDimensions(tireComponents) {
    // Calculates tire diameter and circumference in both inches and mm from parsed components.
    if (!tireComponents) return null;
    const { width, aspectRatio, rimDiameter } = tireComponents;
    // Basic validation for tire component values
    if (isNaN(width) || isNaN(aspectRatio) || isNaN(rimDiameter) || width <= 0 || aspectRatio < 0 || rimDiameter <= 0) {
      console.error("Invalid tire component values:", tireComponents);
      return null;
    }
    const sidewallHeightMm = width * aspectRatio;
    const diameterMm = (sidewallHeightMm * 2) + (rimDiameter * MM_PER_INCH);

    const sidewallHeightInches = sidewallHeightMm * INCHES_PER_MM;
    const diameterInches = (sidewallHeightInches * 2) + rimDiameter;

    // Check if calculations resulted in valid, positive, finite numbers
    if (isNaN(diameterInches) || !isFinite(diameterInches) || diameterInches <= 0 ||
        isNaN(diameterMm) || !isFinite(diameterMm) || diameterMm <= 0) {
        console.error("Tire dimension calculation resulted in invalid value:", {diameterInches, diameterMm});
        return null;
    }
    return { diameterInches, diameterMm };
}

function updateTireInfoFromTireSize() {
    const tireSizeStr = tireSizeInput.value;
    const tireComponents = parseTireSize(tireSizeStr);
    if (tireComponents) {
        const dims = calculateTireDimensions(tireComponents);
        if (dims) {
            if (currentUnitSystem === 'metric') {
                displayTireDiameter.value = dims.diameterMm.toFixed(1);
            } else {
                displayTireDiameter.value = dims.diameterInches.toFixed(2);
            }
        }
    }
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
    const finalDriveRatio = parseFloat(finalDriveInput.value);
    const tireDiameterValue = parseFloat(displayTireDiameter.value);

    gearRatioTableCaption.textContent = 'Gear Ratios';

    // --- 3. Validate core inputs ---
    let errorMessages = [];
    let isFinalDriveValid = !isNaN(finalDriveRatio) && finalDriveRatio > 0 && isFinite(finalDriveRatio);
    if (!isFinalDriveValid) {
        errorMessages.push("Invalid Final Drive Ratio.");
    }

    let isTireDiameterValid = !isNaN(tireDiameterValue) && tireDiameterValue > 0 && isFinite(tireDiameterValue);
    if (!isTireDiameterValid) {
        errorMessages.push("Invalid Tire Diameter.");
    }

    // --- 4. Calculate & Display Tire Circumference and Driveshaft Turns ---
    let circumferenceInches, circumferenceMm;
    if (isTireDiameterValid) {
        if (currentUnitSystem === 'metric') {
            circumferenceMm = tireDiameterValue * Math.PI;
            circumferenceInches = (tireDiameterValue * INCHES_PER_MM) * Math.PI;
            displayTireCircumference.value = `${circumferenceMm.toFixed(1)} mm`;
        } else { // Imperial
            circumferenceInches = tireDiameterValue * Math.PI;
            circumferenceMm = (tireDiameterValue * MM_PER_INCH) * Math.PI;
            displayTireCircumference.value = `${circumferenceInches.toFixed(2)} in`;
        }

        if (isFinalDriveValid) {
            try {
                if (currentUnitSystem === 'metric') {
                    const turnsPerKm = (MM_PER_KM / circumferenceMm) * finalDriveRatio;
                    displayDriveshaftTurns.value = isNaN(turnsPerKm) || !isFinite(turnsPerKm) ? '-' : `${turnsPerKm.toFixed(0)} per km`;
                } else { // Imperial
                    const turnsPerMile = (INCHES_PER_MILE / circumferenceInches) * finalDriveRatio;
                    displayDriveshaftTurns.value = isNaN(turnsPerMile) || !isFinite(turnsPerMile) ? '-' : `${turnsPerMile.toFixed(0)} per mile`;
                }
            } catch (e) {
                displayDriveshaftTurns.value = '-';
                errorMessages.push("Could not calculate driveshaft turns.");
            }
        } else {
            displayDriveshaftTurns.value = '-';
        }
    } else {
        displayTireCircumference.value = '-';
        displayDriveshaftTurns.value = '-';
    }

    // --- 6. Validate Transmission Selection ---
    const gearRatios = transmissions[selectedTransmissionName];
    if (!selectedTransmissionName || !gearRatios || gearRatios.length === 0) {
        if (!errorMessages.includes("Please select a transmission.")){
           errorMessages.push("Please select a transmission.");
        }
    }

    // --- 7. Display Errors and Stop if any validation failed ---
    if (errorMessages.length > 0) {
        errorMessageDisplay.textContent = errorMessages.join(' ');
        resultsTableHead.innerHTML = '';
        resultsTableBody.innerHTML = '';
        gearRatioTableHead.innerHTML = '';
        gearRatioTableBody.innerHTML = '';
        return;
    }

    // --- 8. Build Gear Ratio Table ---
    const ratioHeaderRow = gearRatioTableHead.insertRow();
    ratioHeaderRow.insertCell().outerHTML = '<th></th>'; // Blank top-left cell
    gearRatios.forEach((_, gearIndex) => {
        ratioHeaderRow.insertCell().outerHTML = `<th>Gear ${gearIndex + 1}</th>`;
    });

    const ratioBodyRow = gearRatioTableBody.insertRow();
    ratioBodyRow.insertCell().outerHTML = '<th>Ratio</th>';
    gearRatios.forEach(gearRatio => {
        const ratioCell = ratioBodyRow.insertCell();
        ratioCell.textContent = (gearRatio > 0 && isFinite(gearRatio)) ? gearRatio.toFixed(3) : '-';
    });

    // --- 9. Build Speed Table Header (thead) ---
    const headerRow = resultsTableHead.insertRow();
    headerRow.insertCell().outerHTML = '<th>RPM</th>';
    gearRatios.forEach((_, gearIndex) => {
      headerRow.insertCell().outerHTML = `<th>Gear ${gearIndex + 1}</th>`;
    });

    // --- 10. Build Speed Table Body (tbody) ---
    for (let currentRpm = RPM_START; currentRpm <= RPM_END; currentRpm += RPM_STEP) {
      const speedRow = resultsTableBody.insertRow();
      speedRow.insertCell().outerHTML = `<th>${currentRpm}</th>`;

      gearRatios.forEach(gearRatio => {
        const speedCell = speedRow.insertCell();

        if (gearRatio <= 0 || !isFinite(gearRatio) || !isFinalDriveValid || !isTireDiameterValid) {
          speedCell.textContent = '-';
          speedCell.style.textAlign = 'center';
        } else {
          const wheelRpm = currentRpm / gearRatio / finalDriveRatio;
          let displaySpeed;

          if (currentUnitSystem === 'metric') {
            const speedKph = (wheelRpm * circumferenceMm * 60) / MM_PER_KM;
            displaySpeed = (isNaN(speedKph) || !isFinite(speedKph)) ? '-' : speedKph.toFixed(1);
          } else { // Imperial
            const speedMph = (wheelRpm * circumferenceInches * 60) / INCHES_PER_MILE;
            displaySpeed = (isNaN(speedMph) || !isFinite(speedMph)) ? '-' : speedMph.toFixed(1);
          }

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
            // When units change, we need to convert the diameter
            let currentDiameter = parseFloat(displayTireDiameter.value);
            if (!isNaN(currentDiameter) && currentDiameter > 0) {
                if (unitSelect.value === 'metric') {
                    displayTireDiameter.value = (currentDiameter * MM_PER_INCH).toFixed(1);
                } else {
                    displayTireDiameter.value = (currentDiameter * INCHES_PER_MM).toFixed(2);
                }
            }
            currentUnitSystem = unitSelect.value;
            calculateAndDisplaySpeeds();
        });

        transmissionSelect.addEventListener('change', calculateAndDisplaySpeeds);
        finalDriveInput.addEventListener('change', calculateAndDisplaySpeeds);
        displayTireDiameter.addEventListener('change', calculateAndDisplaySpeeds);

        tireSizeInput.addEventListener('blur', () => {
            updateTireInfoFromTireSize();
            calculateAndDisplaySpeeds();
        });

        // Recalculate on Enter key press
        [finalDriveInput, tireSizeInput, displayTireDiameter].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (input === tireSizeInput) { // Special handling for tire size
                        updateTireInfoFromTireSize();
                    }
                    calculateAndDisplaySpeeds();
                    e.preventDefault();
                }
            });
        });
    }

    setupEventListeners();
    updateTireInfoFromTireSize(); // Populate diameter from default tire size
    calculateAndDisplaySpeeds(); // Initial calculation
});