// @ts-check

/**
 * A transmission and its forward gear ratios.
 * @typedef {object} Transmission
 * @property {string} name Transmission designation; unique across the list.
 * @property {'automatic' | 'manual' | 'dct'} type
 * @property {number[]} ratios Forward gear ratios, first gear first.
 * @property {string} examples Example vehicles; may be empty.
 */

/** @type {Transmission[]} */
const transmissions = [
    { name: "Aisin AW4 / Jeep ('87-'90)", type: "automatic", ratios: [2.80, 1.53, 1.00, 0.705], examples: "Cherokee XJ, Comanche MJ" },
    { name: "Aisin AW4 / Jeep ('91-'01)", type: "automatic", ratios: [2.80, 1.53, 1.00, 0.75], examples: "Cherokee XJ, Comanche MJ" },
    { name: "Chrysler 45RFE", type: "automatic", ratios: [3.00, 1.67, 1.00, 0.75], examples: "Grand Cherokee WJ, Dakota" },
    { name: "Chrysler 518 / A518 / 46RE", type: "automatic", ratios: [2.45, 1.45, 1.00, 0.69], examples: "Ram, Dakota, Durango" },
    { name: "Chrysler 545RFE", type: "automatic", ratios: [3.00, 1.67, 1.00, 0.75, 0.67], examples: "Ram 1500, Grand Cherokee WK" },
    { name: "Chrysler 65RFE", type: "automatic", ratios: [3.00, 1.67, 1.50, 1.00, 0.75, 0.67], examples: "Ram 1500 Hemi" },
    { name: "Chrysler 66RFE / 68RFE", type: "automatic", ratios: [3.23, 1.84, 1.41, 1.00, 0.82, 0.63], examples: "Ram 2500/3500 Hemi and Cummins" },
    { name: "Chrysler A618 / 47RE", type: "automatic", ratios: [2.45, 1.45, 1.00, 0.69], examples: "Ram 2500/3500 Cummins" },
    { name: "Ford AODE", type: "automatic", ratios: [2.40, 1.47, 1.00, 0.67], examples: "Mustang, Crown Victoria '92-'94" },
    { name: "Ford E4OD", type: "automatic", ratios: [2.71, 1.54, 1.00, 0.71], examples: "F-Series, Bronco '90-'96" },
    { name: "Ford 4R100", type: "automatic", ratios: [2.71, 1.54, 1.00, 0.71], examples: "F-250/350 Super Duty, Excursion" },
    { name: "Ford 4R70W", type: "automatic", ratios: [2.84, 1.55, 1.00, 0.70], examples: "F-150, Mustang, Crown Victoria" },
    { name: "Ford 6R80", type: "automatic", ratios: [4.17, 2.34, 1.52, 1.14, 0.87, 0.69], examples: "F-150, Mustang V6/EcoBoost" },
    { name: "Ford 10R80", type: "automatic", ratios: [4.696, 2.985, 2.146, 1.769, 1.520, 1.275, 1.000, 0.854, 0.689, 0.636], examples: "F-150, Mustang GT" },
    { name: "GM TH350", type: "automatic", ratios: [2.52, 1.52, 1.00], examples: "" },
    { name: "GM TH400", type: "automatic", ratios: [2.48, 1.48, 1.00], examples: "" },
    { name: "GM 700R4 / 4L60", type: "automatic", ratios: [3.06, 1.63, 1.00, 0.70], examples: "C4 Corvette, Camaro/Firebird '82-'92" },
    { name: "GM 4L60E", type: "automatic", ratios: [3.059, 1.625, 1.000, 0.696], examples: "Silverado 1500, Tahoe, Camaro '94+" },
    { name: "GM 4L80E", type: "automatic", ratios: [2.482, 1.482, 1.000, 0.750], examples: "Silverado 2500/3500, Express" },
    { name: "GM 6L80", type: "automatic", ratios: [4.03, 2.36, 1.53, 1.15, 0.85, 0.67], examples: "Silverado, Tahoe" },
    { name: "GM 8L90", type: "automatic", ratios: [4.56, 2.97, 2.08, 1.69, 1.27, 1.00, 0.85, 0.65], examples: "Corvette C7, Silverado" },
    { name: "GM 10L90", type: "automatic", ratios: [4.70, 2.99, 2.15, 1.77, 1.52, 1.28, 1.00, 0.85, 0.69, 0.64], examples: "Camaro ZL1" },
    { name: "Mercedes 722.3", type: "automatic", ratios: [3.68, 2.41, 1.44, 1.00], examples: "W124, W126, W201" },
    { name: "Mercedes 722.4", type: "automatic", ratios: [4.25, 2.40, 1.48, 1.00], examples: "" },
    { name: "Mercedes 722.5", type: "automatic", ratios: [3.87, 2.25, 1.44, 1.00, 0.75], examples: "W140, R129" },
    { name: "Mercedes 722.6 / 5G-Tronic (W5A330)", type: "automatic", ratios: [3.951, 2.423, 1.486, 1.000, 0.833], examples: "Sprinter 2500, some C/E-Class" },
    { name: "Mercedes 722.6 / 5G-Tronic (W5A580/NAG1)", type: "automatic", ratios: [3.59, 2.19, 1.41, 1.00, 0.83], examples: "Chrysler V8, AMG models" },
    { name: "Mercedes 7G-Tronic (722.9)", type: "automatic", ratios: [4.38, 2.86, 1.92, 1.37, 1.00, 0.82, 0.73], examples: "" },
    { name: "Mercedes 9G-Tronic (725.0)", type: "automatic", ratios: [5.50, 3.33, 2.31, 1.66, 1.21, 1.00, 0.865, 0.717, 0.60], examples: "" },
    { name: "Nissan RE4R01A / RE4R03A", type: "automatic", ratios: [2.785, 1.545, 1.000, 0.694], examples: "300ZX, Pathfinder" },
    { name: "Nissan RE5R05A", type: "automatic", ratios: [3.842, 2.353, 1.529, 1.000, 0.839], examples: "Frontier, 350Z '07+" },
    { name: "Nissan RE5R05A (350Z '03-'06)", type: "automatic", ratios: [3.540, 2.264, 1.417, 1.000, 0.834], examples: "" },
    { name: "Nissan RE5R05A (Titan)", type: "automatic", ratios: [3.827, 2.368, 1.519, 1.000, 0.834], examples: "" },
    { name: "Toyota/Aisin AA80E", type: "automatic", ratios: [4.596, 2.724, 1.863, 1.464, 1.231, 1.000, 0.824, 0.685], examples: "Lexus IS F, RC F" },
    { name: "Toyota A340E/F", type: "automatic", ratios: [2.804, 1.531, 1.000, 0.705], examples: "Tacoma, 4Runner, LC 80/100" },
    { name: "Toyota A442F", type: "automatic", ratios: [2.95, 1.54, 1.00, 0.765], examples: "Land Cruiser 80" },
    { name: "Toyota A750E/F", type: "automatic", ratios: [3.520, 2.042, 1.400, 1.000, 0.716], examples: "4Runner, Tacoma, LC 100 V8" },
    { name: "Toyota AB60E/F", type: "automatic", ratios: [3.333, 1.960, 1.353, 1.000, 0.728, 0.588], examples: "Tundra, Sequoia, LC 200" },
    { name: "Toyota AE80F / AB80F", type: "automatic", ratios: [4.795, 2.811, 1.844, 1.429, 1.213, 1.000, 0.817, 0.672], examples: "Land Cruiser 200 '16-'21, Lexus LX 570" },
    { name: "ZF 4HP22", type: "automatic", ratios: [2.48, 1.48, 1.00, 0.73], examples: "BMW E30/E34, Land Rover Discovery" },
    { name: "ZF 4HP24", type: "automatic", ratios: [2.48, 1.48, 1.00, 0.73], examples: "BMW V8/V12, Range Rover" },
    { name: "ZF 5HP24", type: "automatic", ratios: [3.57, 2.20, 1.51, 1.00, 0.80], examples: "BMW E38 740i, E39 540i" },
    { name: "ZF 5HP30", type: "automatic", ratios: [3.55, 2.24, 1.54, 1.00, 0.79], examples: "BMW E38 750iL" },
    { name: "ZF 6HP26", type: "automatic", ratios: [4.17, 2.34, 1.52, 1.14, 0.87, 0.69], examples: "BMW E60/E65, Jaguar XJ, Ford Falcon" },
    { name: "ZF 8HP, 4.71 first", type: "automatic", ratios: [4.714, 3.143, 2.106, 1.667, 1.285, 1.000, 0.839, 0.667], examples: "Dodge Charger, Ram 1500" },
    { name: "ZF 8HP, 5.00 first", type: "automatic", ratios: [5.000, 3.200, 2.143, 1.720, 1.313, 1.000, 0.823, 0.640], examples: "BMW M3 G80, Alfa Romeo Giulia QV" },
    { name: "ZF 8HP, 5.25 first", type: "automatic", ratios: [5.250, 3.360, 2.172, 1.720, 1.316, 1.000, 0.822, 0.640], examples: "BMW M340i, Toyota GR Supra" },

    { name: "ZF S5D 310Z / 320Z", type: "manual", ratios: [4.21, 2.49, 1.67, 1.24, 1.00], examples: "BMW E36 325i/328i" },
    { name: "Getrag 420G", type: "manual", ratios: [4.227, 2.528, 1.669, 1.226, 1.000, 0.828], examples: "BMW E46 M3 / E39 M5" },
    { name: "Honda S2000 AP1 6MT (F20C)", type: "manual", ratios: [3.634, 2.372, 1.718, 1.347, 1.125, 0.940], examples: "" },
    { name: "Honda S2000 AP2 6MT (F22C)", type: "manual", ratios: [3.785, 2.470, 1.789, 1.402, 1.139, 0.922], examples: "" },
    { name: "Mazda Miata NA/NB 5MT (1.8L '94-'05)", type: "manual", ratios: [3.136, 1.888, 1.330, 1.000, 0.814], examples: "" },
    { name: "Mazda Miata NB 6MT ('99-'05, Optional)", type: "manual", ratios: [3.760, 2.269, 1.645, 1.257, 1.000, 0.843], examples: "" },
    { name: "Mazda Miata NC 5MT ('06-'15)", type: "manual", ratios: [3.136, 1.888, 1.330, 1.000, 0.814], examples: "" },
    { name: "Mazda Miata NC 6MT ('06-'08)", type: "manual", ratios: [3.815, 2.260, 1.640, 1.18, 1.000, 0.832], examples: "" },
    { name: "Mazda Miata ND SkyActiv-MT 6MT (2.0L '16+)", type: "manual", ratios: [5.087, 2.991, 2.035, 1.594, 1.286, 1.000], examples: "" },
    { name: "Nissan CD009", type: "manual", ratios: [3.794, 2.324, 1.624, 1.271, 1.000, 0.794], examples: "350Z '05+, 370Z" },
    { name: "Toyota W58", type: "manual", ratios: [3.285, 1.894, 1.275, 1.00, 0.783], examples: "Supra MKIV NA, Lexus SC300" },
    { name: "Toyota R154", type: "manual", ratios: [3.251, 1.955, 1.310, 1.00, 0.753], examples: "Supra MKIII Turbo, Chaser Tourer V" },
    { name: "Tremec T5 ('World Class' variant)", type: "manual", ratios: [2.95, 1.94, 1.34, 1.00, 0.63], examples: "Ford Mustang Cobra '93" },
    { name: "Tremec T5", type: "manual", ratios: [3.35, 1.93, 1.29, 1.00, 0.68], examples: "Ford Mustang 5.0 '87-'93" },
    { name: "Tremec T56 (C5 Corvette Base MM6)", type: "manual", ratios: [2.66, 1.78, 1.30, 1.00, 0.74, 0.50], examples: "" },
    { name: "Tremec T56 (C5 Corvette Z06 M12)", type: "manual", ratios: [2.97, 2.07, 1.43, 1.00, 0.84, 0.56], examples: "" },
    { name: "Tremec TR-6060", type: "manual", ratios: [3.01, 2.07, 1.43, 1.00, 0.84, 0.57], examples: "Camaro SS Gen 5" },
    { name: "Tremec TR-6060 (C6 Corvette Z51/Grand Sport MZ6)", type: "manual", ratios: [2.97, 2.07, 1.43, 1.00, 0.71, 0.562], examples: "" },
    { name: "Tremec TR-6060 (C6 Corvette ZR1 MH3)", type: "manual", ratios: [2.289, 1.611, 1.208, 1.000, 0.818, 0.675], examples: "" },

    { name: "BMW M-DCT GS7D36SG", type: "dct", ratios: [4.780, 3.056, 2.153, 1.678, 1.390, 1.203, 1.000], examples: "E92 M3 GTS" },
];
