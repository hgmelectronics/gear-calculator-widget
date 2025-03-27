// --- Transmission Data ---
// NOTE: Accuracy varies, always verify for specific vehicle/year. Data gathered from online sources & training data.
const transmissions = {

    // --- Added Automatics ---
    "Aisin AW TF-80SC (Common 6-spd Auto FWD, e.g., Volvo, Ford)": [4.148, 2.370, 1.556, 1.155, 0.859, 0.686], // Example ratios, check application
    "Aisin AW TG-81SC (Common 8-spd Auto FWD/AWD, e.g., Volvo, BMW Mini)": [5.250, 3.029, 1.950, 1.457, 1.221, 1.000, 0.809, 0.673], // Example ratios
    "Chrysler NAG1 / W5A580 (5-spd Auto, e.g., Charger, 300, GC WK)": [3.59, 2.19, 1.41, 1.00, 0.83], // Mercedes 722.6 design
    "Ford 6R80 (6-spd Auto RWD, e.g., F-150, Mustang V6/EcoBoost)": [4.17, 2.34, 1.52, 1.14, 0.87, 0.69],
    "Ford 10R80 (10-spd Auto RWD, e.g., F-150, Mustang GT)": [4.696, 2.985, 2.146, 1.769, 1.520, 1.275, 1.000, 0.854, 0.689, 0.636],
    "GM 4L60E (4-spd Auto, e.g., Silverado 1500, Tahoe, Camaro '94+)": [3.059, 1.625, 1.000, 0.696], // Very common, slight ratio variations exist
    "GM 4L80E (4-spd Auto HD, e.g., Silverado 2500/3500, Express)": [2.482, 1.482, 1.000, 0.750],
    "GM 6L80 (6-spd Auto RWD/4WD, e.g., Silverado, Tahoe)": [4.03, 2.36, 1.53, 1.15, 0.85, 0.67],
    "GM 8L90 (8-spd Auto RWD/4WD, e.g., Corvette C7, Silverado)": [4.56, 2.97, 2.08, 1.69, 1.27, 1.00, 0.85, 0.65],
    "GM 10L90 (10-spd Auto RWD/4WD, e.g., Camaro ZL1, Escalade)": [4.70, 2.99, 2.15, 1.77, 1.52, 1.28, 1.00, 0.85, 0.69, 0.64],
    "Honda B7XA/M7XA (4-spd Auto, e.g., Accord '98-'02)": [2.651, 1.516, 1.037, 0.738],
    "Honda BAYA/MAYA (5-spd Auto, e.g., Accord '03-'07 V6)": [2.697, 1.606, 1.071, 0.766, 0.566],
    "Mazda SkyActiv-Drive (6-spd Auto, Various)": [3.552, 2.022, 1.452, 1.000, 0.708, 0.599],
    "Mercedes 7G-Tronic (722.9 Auto, Various RWD)": [4.38, 2.86, 1.92, 1.37, 1.00, 0.82, 0.73],
    "Mercedes 9G-Tronic (725.0 Auto, Various RWD/AWD)": [5.50, 3.33, 2.31, 1.66, 1.21, 1.00, 0.86, 0.71, 0.60],
    "Nissan RE4R01A / RE4R03A (4-spd Auto RWD/4WD, e.g., 300ZX, Pathfinder)": [2.785, 1.545, 1.000, 0.694], // Jatco JR401E/JR403E
    "Nissan RE5R05A (5-spd Auto RWD/4WD, e.g., 350Z, Frontier, Titan, G35)": [3.842, 2.353, 1.529, 1.000, 0.839], // Jatco JR507E/JR509E
    "Toyota/Aisin AA80E (8-spd Auto RWD, e.g., Lexus IS F, RC F, LC 500)": [4.596, 2.724, 1.863, 1.464, 1.231, 1.000, 0.824, 0.685],
    "Toyota A340E/F (4-spd Auto, e.g., Tacoma, 4Runner, LC 80/100)": [2.804, 1.531, 1.000, 0.705],
    "Toyota A442F (4-spd Auto HD, e.g., LC 80 Diesel)": [2.950, 1.530, 1.000, 0.717],
    "Toyota A750E/F (5-spd Auto, e.g., 4Runner, Tacoma, LC 100 V8)": [3.520, 2.042, 1.400, 1.000, 0.716],
    "Toyota AB60E/F (6-spd Auto, e.g., Tundra, Sequoia, LC 200)": [3.333, 1.960, 1.353, 1.000, 0.728, 0.588],
    "Toyota AE80F (8-spd Auto, e.g. Toyota Land Cruiser 300)": [4.795, 2.811, 1.844, 1.429, 1.213, 1.000, 0.817, 0.672],
    "ZF 8HP70 Auto (Various, e.g., Ram 1500)": [4.71, 3.14, 2.10, 1.67, 1.29, 1.00, 0.84, 0.67], // Common variant, others exist

    // --- Added Manuals ---
    "Getrag 233 (BMW E36 325i/328i Manual)": [4.23, 2.52, 1.66, 1.22, 1.00],
    "Getrag 420G (BMW E46 M3 Manual / E39 M5 Manual)": [4.227, 2.528, 1.669, 1.226, 1.000, 0.828],
    "Honda K-Series 6MT (e.g., Civic Si '06-'11 FA5/FG2)": [3.266, 2.130, 1.517, 1.147, 0.921, 0.659],
    "Honda S2000 AP1 6MT (F20C)": [3.133, 2.045, 1.481, 1.161, 0.970, 0.810],
    "Honda S2000 AP2 6MT (F22C)": [3.133, 2.045, 1.481, 1.161, 0.943, 0.763],
    "Mazda Miata NA/NB 5MT (1.8L '94-'05)": [3.136, 1.888, 1.330, 1.000, 0.814],
    "Mazda Miata NB 6MT ('99-'05, Optional)": [3.760, 2.269, 1.645, 1.257, 1.000, 0.843],
    "Mazda Miata NC 5MT ('06-'15)": [3.136, 1.888, 1.330, 1.000, 0.814],
    "Mazda Miata NC 6MT ('06-'15)": [3.815, 2.260, 1.640, 1.231, 1.000, 0.832],
    "Mazda Miata ND SkyActiv-MT 6MT (2.0L '16+)": [3.727, 2.188, 1.536, 1.178, 1.000, 0.845],
    "Nissan CD009 (350Z '05+, 370Z Manual)": [3.794, 2.324, 1.624, 1.271, 1.000, 0.794],
    "Subaru TY75 5MT (e.g., WRX '02-'05)": [3.454, 1.947, 1.366, 0.972, 0.738],
    "Subaru TY85 6MT (e.g., WRX STI '04-'14 USDM)": [3.636, 2.375, 1.761, 1.346, 1.062, 0.842],
    "Subaru WRX 6MT (VA '15+)": [3.454, 1.947, 1.296, 0.972, 0.738, 0.666],
    "Toyota W58 (Supra MKIV NA, Lexus SC300 Manual)": [3.285, 1.894, 1.275, 1.00, 0.783],
    "Toyota R154 (Supra MKIII Turbo, Chaser Tourer V)": [3.251, 1.955, 1.310, 1.00, 0.753],
    "Tremec T5 (Ford Mustang 5.0 'World Class' variant)": [2.95, 1.94, 1.34, 1.00, 0.63],
    "Tremec T5 Manual (Ford Mustang 5.0 '87-'93)": [3.35, 1.93, 1.29, 1.00, 0.68], // Verify exact T5 variant
    "Tremec T56 (e.g., C5 Corvette Base MM6)": [2.66, 1.78, 1.30, 1.00, 0.74, 0.50],
    "Tremec T56 (e.g., C5 Corvette Z06 M12)": [2.97, 2.07, 1.43, 1.00, 0.84, 0.56],
    "Tremec TR-6060 Manual (Camaro SS Gen 5)": [3.01, 2.07, 1.43, 1.00, 0.84, 0.57],
    "Tremec TR-6060 (e.g., C6 Corvette Z06 MH3)": [2.97, 2.07, 1.43, 1.00, 0.71, 0.57],
    "Tremec TR-6060 (e.g., C6 Corvette ZR1 MG9)": [2.26, 1.58, 1.18, 1.00, 0.74, 0.50],

    // --- Added DCTs ---
    "BMW M-DCT GS7D36SG (E9X M3, F8X M3/M4 Getrag)": [4.780, 2.933, 2.153, 1.678, 1.390, 1.203, 1.000],
    "Porsche PDK 7DT (997/991/718 Base/S variants)": [3.91, 2.29, 1.58, 1.18, 0.94, 0.79, 0.62],
    "VW/Audi DSG DQ200 (7-spd Dry Clutch, Lower Torque)": [3.764, 2.272, 1.531, 1.121, 1.176, 0.951, 0.795],
    "VW/Audi DSG DQ250 (6-spd Wet Clutch, e.g., GTI Mk5/6)": [3.462, 2.150, 1.464, 1.079, 0.854, 0.722],
    "VW/Audi DSG DQ500 (7-spd Wet Clutch, High Torque, e.g., RS3, Tiguan)": [3.563, 2.526, 1.677, 1.022, 0.788, 0.761, 0.635],
};

// --- Constants ---
const INCHES_PER_MM = 1 / 25.4;
const MM_PER_INCH = 25.4;
const INCHES_PER_MILE = 63360;
const MM_PER_KM = 1000000;
const RPM_START = 1000;
const RPM_END = 8000; // Adjust max RPM if needed
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
const unitSystemRadios = document.querySelectorAll('input[name="unitSystem"]');
const speedUnitLabel = document.getElementById('speedUnitLabel');

// --- Global State ---
let currentUnitSystem = 'imperial';

// --- Functions ---

function populateTransmissionDropdown() {
    // Clear existing options except the placeholder
    while (transmissionSelect.options.length > 1) {
        transmissionSelect.remove(1);
    }
    // Sort keys alphabetically for consistent order
    const sortedKeys = Object.keys(transmissions).sort();
    sortedKeys.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        transmissionSelect.appendChild(option);
    });
}

function parseTireSize(tireString) {
    // Parses tire size string (e.g., "225/60R16") into components.
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
    // Calculates tire diameter and circumference in both inches and mm.
    if (!tireComponents) return null;
    const { width, aspectRatio, rimDiameter } = tireComponents;
    // Basic validation for tire component values
    if (isNaN(width) || isNaN(aspectRatio) || isNaN(rimDiameter) || width <= 0 || aspectRatio < 0 || rimDiameter <= 0) { // Aspect ratio can be 0 in theory, but not negative
      console.error("Invalid tire component values:", tireComponents);
      return null;
    }
    const sidewallHeightMm = width * aspectRatio;
    const diameterMm = (sidewallHeightMm * 2) + (rimDiameter * MM_PER_INCH);
    const circumferenceMm = diameterMm * Math.PI;

    const sidewallHeightInches = sidewallHeightMm * INCHES_PER_MM;
    const diameterInches = (sidewallHeightInches * 2) + rimDiameter;
    const circumferenceInches = diameterInches * Math.PI;

    // Check if calculations resulted in valid numbers
    if (isNaN(diameterInches) || isNaN(circumferenceInches) || isNaN(diameterMm) || isNaN(circumferenceMm) ||
        !isFinite(diameterInches) || !isFinite(circumferenceInches) || !isFinite(diameterMm) || !isFinite(circumferenceMm)) {
        console.error("Tire dimension calculation resulted in NaN or Infinity:", {diameterInches, circumferenceInches, diameterMm, circumferenceMm});
        return null;
    }
    return { diameterInches, circumferenceInches, diameterMm, circumferenceMm };
}

function updateUnitSystem() {
    // Updates the unit system state and triggers recalculation.
    const selectedRadio = document.querySelector('input[name="unitSystem"]:checked');
    if (selectedRadio) {
        currentUnitSystem = selectedRadio.value;
        calculateAndDisplaySpeeds();
    }
}

function calculateAndDisplaySpeeds() {
    // Main function to perform calculations and update the results table.

    // --- Clear previous state ---
    resultsTableHead.innerHTML = '';
    resultsTableBody.innerHTML = '';
    tireInfoDisplay.textContent = '';
    errorMessageDisplay.textContent = '';
    speedUnitLabel.textContent = currentUnitSystem === 'metric' ? 'KPH' : 'MPH';

    // --- Get current input values ---
    const selectedTransmissionName = transmissionSelect.value;
    const finalDriveRatio = parseFloat(finalDriveInput.value);
    const tireSizeStr = tireSizeInput.value;

    // --- Validate inputs ---
    let errorMessages = [];
    if (!selectedTransmissionName) errorMessages.push("Please select a transmission.");
    if (isNaN(finalDriveRatio) || finalDriveRatio <= 0 || !isFinite(finalDriveRatio)) {
         errorMessages.push("Invalid Final Drive Ratio.");
    }
    const tireComponents = parseTireSize(tireSizeStr);
    if (!tireComponents) {
        errorMessages.push("Invalid Tire Size format (e.g., 225/60R16).");
    }

    // --- Calculate Tire Dimensions (only if components are valid) ---
    let tireDimensions = null;
    if (tireComponents) {
        tireDimensions = calculateTireDimensions(tireComponents);
        if (!tireDimensions) {
            errorMessages.push("Invalid tire dimensions resulted from calculation.");
        } else {
            // Display tire dimensions
            if (currentUnitSystem === 'metric') {
                tireInfoDisplay.textContent = `Tire Diameter: ${tireDimensions.diameterMm.toFixed(1)} mm, Circumference: ${tireDimensions.circumferenceMm.toFixed(1)} mm.`;
            } else {
                tireInfoDisplay.textContent = `Tire Diameter: ${tireDimensions.diameterInches.toFixed(2)} inches, Circumference: ${tireDimensions.circumferenceInches.toFixed(2)} inches.`;
            }
        }
    } // If !tireComponents, the parsing error is already added

    // --- Get Gear Ratios ---
    const gearRatios = transmissions[selectedTransmissionName];
    if (!gearRatios || gearRatios.length === 0) {
        if (selectedTransmissionName) { // Only add error if selected trans is bad
            errorMessages.push("Selected transmission data is missing or invalid.");
        }
        // Display errors gathered so far and stop, preventing table build if no gears
        errorMessageDisplay.textContent = errorMessages.join(' ');
        return;
    }

    // --- Display errors and stop if any validation failed before table build ---
    if (errorMessages.length > 0) {
        errorMessageDisplay.textContent = errorMessages.join(' ');
        return; // Stop if inputs are invalid
    }

    // --- Build Table Header (thead) ---
    const headerRow = resultsTableHead.insertRow();
    headerRow.insertCell().outerHTML = '<th>Gear</th>';    // First column header
    headerRow.insertCell().outerHTML = '<th>Ratio</th>';   // Second column header
    // Add RPM steps as subsequent column headers
    for (let rpm = RPM_START; rpm <= RPM_END; rpm += RPM_STEP) {
        headerRow.insertCell().outerHTML = `<th>${rpm} RPM</th>`;
    }

    // --- Build Table Body (tbody) ---
    // Outer loop iterates through GEARS
    gearRatios.forEach((gearRatio, gearIndex) => {
        const bodyRow = resultsTableBody.insertRow();
        bodyRow.insertCell().textContent = `${gearIndex + 1}`; // Gear number cell (Col 1)

        // Add Gear Ratio cell (Col 2)
        const ratioCell = bodyRow.insertCell();
        ratioCell.textContent = (gearRatio > 0 && isFinite(gearRatio)) ? gearRatio.toFixed(3) + ":1" : '-';

        // Inner loop iterates through RPMs for this gear (Col 3+)
        for (let currentRpm = RPM_START; currentRpm <= RPM_END; currentRpm += RPM_STEP) {
            const speedCell = bodyRow.insertCell();

            // Check for valid inputs needed for speed calculation *inside the loop*
            if (gearRatio <= 0 || !isFinite(gearRatio) || finalDriveRatio <= 0 || !isFinite(finalDriveRatio) || !tireDimensions) {
                speedCell.textContent = '-';
                speedCell.style.textAlign = 'center'; // Center placeholder
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
                // Center if calculation resulted in placeholder '-'
                if(displaySpeed === '-'){
                   speedCell.style.textAlign = 'center';
                 }
                speedCell.textContent = displaySpeed;
            }
        } // End RPM loop
    }); // End Gear loop
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    populateTransmissionDropdown(); // Fill the dropdown first
    updateUnitSystem(); // Set initial units and perform initial calculation

    // Add event listeners to recalculate automatically on changes
    unitSystemRadios.forEach(radio => radio.addEventListener('change', updateUnitSystem));
    transmissionSelect.addEventListener('change', calculateAndDisplaySpeeds);
    finalDriveInput.addEventListener('change', calculateAndDisplaySpeeds);
    // Using 'input' recalculates as you type, 'blur' recalculates when leaving the field. 'Blur' is less resource intensive.
    tireSizeInput.addEventListener('blur', calculateAndDisplaySpeeds);

    // Optional: Recalculate on Enter key press in text/number fields for quicker updates
    [finalDriveInput, tireSizeInput].forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                calculateAndDisplaySpeeds(); // Recalculate immediately
                e.preventDefault(); // Prevent default Enter behavior (like form submit)
            }
        });
    });
});