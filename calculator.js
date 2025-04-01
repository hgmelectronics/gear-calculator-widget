// --- Constants ---
const INCHES_PER_MM = 1 / 25.4;
const MM_PER_INCH = 25.4;
const INCHES_PER_MILE = 63360;
const MM_PER_KM = 1000000;
const RPM_START = 1000;
const RPM_END = 7000; // Adjust max RPM if needed
const RPM_STEP = 500;

// --- DOM Elements ---
const transmissionSelect = document.getElementById('transmissionSelect');
const finalDriveInput = document.getElementById('finalDrive');
const tireSizeInput = document.getElementById('tireSize');
const resultsTable = document.getElementById('resultsTable');
const resultsTableHead = resultsTable.querySelector('thead');
const resultsTableBody = resultsTable.querySelector('tbody');
const tireInfoDisplay = document.getElementById('tireInfo');
const errorMessageDisplay = document.getElementById('errorMessage');
const unitSelect = document.getElementById('unitSelect'); // Reference the select dropdown
const speedUnitLabel = document.getElementById('speedUnitLabel');
const driveshaftTurnsDisplay = document.getElementById('driveshaftTurnsInfo'); // Reference for driveshaft turns output

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
    const circumferenceMm = diameterMm * Math.PI;

    const sidewallHeightInches = sidewallHeightMm * INCHES_PER_MM;
    const diameterInches = (sidewallHeightInches * 2) + rimDiameter;
    const circumferenceInches = diameterInches * Math.PI;

    // Check if calculations resulted in valid, positive, finite numbers
    if (isNaN(diameterInches) || !isFinite(diameterInches) || diameterInches <= 0 ||
        isNaN(circumferenceInches) || !isFinite(circumferenceInches) || circumferenceInches <= 0 ||
        isNaN(diameterMm) || !isFinite(diameterMm) || diameterMm <= 0 ||
        isNaN(circumferenceMm) || !isFinite(circumferenceMm) || circumferenceMm <= 0) {
        console.error("Tire dimension calculation resulted in invalid value:", {diameterInches, circumferenceInches, diameterMm, circumferenceMm});
        return null;
    }
    return { diameterInches, circumferenceInches, diameterMm, circumferenceMm };
}

function updateUnitSystem() {
    // Updates the global unit system state based on the select dropdown and triggers recalculation.
    currentUnitSystem = unitSelect.value; // Read value directly from select
    calculateAndDisplaySpeeds(); // Trigger recalculation
}

function calculateAndDisplaySpeeds() {
    // Main function: validates inputs, calculates results, and updates the UI.

    // --- 1. Clear previous output state ---
    resultsTableHead.innerHTML = '';
    resultsTableBody.innerHTML = '';
    tireInfoDisplay.textContent = '';
    errorMessageDisplay.textContent = '';
    driveshaftTurnsDisplay.textContent = ''; // Clear driveshaft info
    speedUnitLabel.textContent = currentUnitSystem === 'metric' ? 'KPH' : 'MPH'; // Update speed unit label

    // --- 2. Get current input values ---
    const selectedTransmissionName = transmissionSelect.value;
    const finalDriveRatio = parseFloat(finalDriveInput.value);
    const tireSizeStr = tireSizeInput.value;

    // --- 3. Validate core inputs (Final Drive, Tire Size) ---
    let errorMessages = [];
    let isFinalDriveValid = false;
    if (isNaN(finalDriveRatio) || finalDriveRatio <= 0 || !isFinite(finalDriveRatio)) {
         errorMessages.push("Invalid Final Drive Ratio.");
    } else {
         isFinalDriveValid = true; // Mark final drive as valid for later calcs
    }

    const tireComponents = parseTireSize(tireSizeStr);
    if (!tireComponents) {
        if (!errorMessages.includes("Invalid Tire Size format (e.g., 225/60R16).")) {
             errorMessages.push("Invalid Tire Size format (e.g., 225/60R16).");
        }
    }

    // --- 4. Calculate & Display Tire Dimensions (if possible) ---
    let tireDimensions = null;
    let areTireDimensionsValid = false;
    if (tireComponents) { // Only proceed if tire size string was parsed successfully
        tireDimensions = calculateTireDimensions(tireComponents);
        if (!tireDimensions) {
             if (!errorMessages.includes("Invalid tire dimensions resulted from calculation.")) {
                errorMessages.push("Invalid tire dimensions resulted from calculation.");
             }
        } else {
            areTireDimensionsValid = true; // Mark dimensions as valid
            // Display tire dimensions info
            if (currentUnitSystem === 'metric') {
                tireInfoDisplay.textContent = `Tire Diameter: ${tireDimensions.diameterMm.toFixed(1)} mm, Circumference: ${tireDimensions.circumferenceMm.toFixed(1)} mm.`;
            } else {
                tireInfoDisplay.textContent = `Tire Diameter: ${tireDimensions.diameterInches.toFixed(2)} inches, Circumference: ${tireDimensions.circumferenceInches.toFixed(2)} inches.`;
            }
        }
    }

    // --- 5. Calculate & Display Driveshaft Turns per Mile/KM (if possible) --- <<< RESTORED BLOCK >>>
    if (isFinalDriveValid && areTireDimensionsValid) { // Requires valid FD and tire dimensions
        try {
            let turnsResultText = '';
            if (currentUnitSystem === 'metric') {
                const turnsPerKm = (MM_PER_KM / tireDimensions.circumferenceMm) * finalDriveRatio;
                if(!isNaN(turnsPerKm) && isFinite(turnsPerKm)){
                   turnsResultText = `Driveshaft Turns per Kilometer: ${turnsPerKm.toFixed(0)}`;
                } else { throw new Error("Metric turns calculation invalid"); }
            } else { // Imperial
                const turnsPerMile = (INCHES_PER_MILE / tireDimensions.circumferenceInches) * finalDriveRatio;
                 if(!isNaN(turnsPerMile) && isFinite(turnsPerMile)){
                    turnsResultText = `Driveshaft Turns per Mile: ${turnsPerMile.toFixed(0)}`;
                 } else { throw new Error("Imperial turns calculation invalid"); }
            }
            driveshaftTurnsDisplay.textContent = turnsResultText; // Update display
        } catch (e) {
            console.error("Error calculating driveshaft turns:", e);
             if (!errorMessages.includes("Could not calculate driveshaft turns.")) {
                errorMessages.push("Could not calculate driveshaft turns.");
             }
            driveshaftTurnsDisplay.textContent = ''; // Ensure clear on error
        }
    }
    // <<< END RESTORED BLOCK >>>


    // --- 6. Validate Transmission Selection ---
    const gearRatios = transmissions[selectedTransmissionName];
    if (!selectedTransmissionName) {
         if (!errorMessages.includes("Please select a transmission.")){
            errorMessages.push("Please select a transmission.");
         }
    } else if (!gearRatios || gearRatios.length === 0) {
         if (!errorMessages.includes("Selected transmission data is missing or invalid.")){
            errorMessages.push("Selected transmission data is missing or invalid.");
         }
    }

    // --- 7. Display Errors and Stop if any validation failed ---
    // Checks all accumulated errors before attempting table build
    if (errorMessages.length > 0) {
        errorMessageDisplay.textContent = errorMessages.join(' ');
        // Clear potentially partially built headers if errors occurred late
        resultsTableHead.innerHTML = '';
        resultsTableBody.innerHTML = '';
        return; // Stop processing
    }

    // --- 8. Build Table Header (thead) ---
    // Assumes all necessary inputs (FD, Tire, Trans) are valid if we reached here
    const headerRow = resultsTableHead.insertRow();
    headerRow.insertCell().outerHTML = '<th>Gear</th>';    // Col 1
    headerRow.insertCell().outerHTML = '<th>Ratio</th>';   // Col 2
    for (let rpm = RPM_START; rpm <= RPM_END; rpm += RPM_STEP) { // Col 3+
        headerRow.insertCell().outerHTML = `<th>${rpm} RPM</th>`;
    }

    // --- 9. Build Table Body (tbody) ---
    gearRatios.forEach((gearRatio, gearIndex) => {
        const bodyRow = resultsTableBody.insertRow();
        // Col 1: Gear Number
        bodyRow.insertCell().textContent = `${gearIndex + 1}`;

        // Col 2: Gear Ratio
        const ratioCell = bodyRow.insertCell();
        ratioCell.textContent = (gearRatio > 0 && isFinite(gearRatio)) ? gearRatio.toFixed(3) : '-';

        // Col 3+: Speeds for each RPM step
        for (let currentRpm = RPM_START; currentRpm <= RPM_END; currentRpm += RPM_STEP) {
            const speedCell = bodyRow.insertCell();

            // Final check for valid calculation inputs for this specific cell
            if (gearRatio <= 0 || !isFinite(gearRatio) || !isFinalDriveValid || !areTireDimensionsValid) {
                speedCell.textContent = '-';
                speedCell.style.textAlign = 'center';
            } else {
                const wheelRpm = currentRpm / gearRatio / finalDriveRatio;
                let displaySpeed;

                if (currentUnitSystem === 'metric') {
                    const speedKph = (wheelRpm * tireDimensions.circumferenceMm * 60) / MM_PER_KM;
                    // Ensure result is a valid number before formatting
                    displaySpeed = (isNaN(speedKph) || !isFinite(speedKph)) ? '-' : speedKph.toFixed(1);
                } else { // Imperial
                    const speedMph = (wheelRpm * tireDimensions.circumferenceInches * 60) / INCHES_PER_MILE;
                    // Ensure result is a valid number before formatting
                    displaySpeed = (isNaN(speedMph) || !isFinite(speedMph)) ? '-' : speedMph.toFixed(1);
                }

                if(displaySpeed === '-'){
                   speedCell.style.textAlign = 'center';
                 }
                speedCell.textContent = displaySpeed;
            }
        } // End RPM loop for columns
    }); // End Gear loop for rows
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // This code runs once the HTML document is fully loaded and parsed.
    populateTransmissionDropdown(); // Fill the dropdown list

    // Attach listener to the unit select dropdown
    unitSelect.addEventListener('change', updateUnitSystem);

    // Other listeners for automatic recalculation
    transmissionSelect.addEventListener('change', calculateAndDisplaySpeeds);
    finalDriveInput.addEventListener('change', calculateAndDisplaySpeeds);
    tireSizeInput.addEventListener('blur', calculateAndDisplaySpeeds); // Recalc when user leaves the field

    // Optional: Recalculate on Enter key press in text/number fields
    [finalDriveInput, tireSizeInput].forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                calculateAndDisplaySpeeds(); // Recalculate immediately
                e.preventDefault(); // Prevent default Enter behavior (like form submit)
            }
        });
    });

    // Perform initial calculation based on default values
    updateUnitSystem(); // Reads initial value from the select element and triggers calculation
});