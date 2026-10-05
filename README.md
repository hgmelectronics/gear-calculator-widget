# Gear and Speed Calculator

## What it is

A gear and vehicle-speed calculator for rear-drive and four-wheel-drive vehicles. Pick a transmission, then enter the transfer case ratio, the final drive ratio, and either a tire size or a rolling diameter. The page shows vehicle speed in every gear across the engine speed range, along with tire diameter, tire circumference, driveshaft turns and transmission output turns.

## How the inputs behave

- The transmission list covers rear-drive and four-wheel-drive transmissions only, sorted by name with numbers in numeric order. Until one is picked, the page shows "Select a transmission to see speeds." under the list.
- Speeds use gear ratio × transfer case ratio × final drive ratio. The transfer case ratio defaults to 1.00.
- Driveshaft Turns leave out the transfer case. Transmission Output Turns include it, so the two match at 1.00.
- Tire Size accepts a metric size (`225/60R16`, `LT265/75R16 121S`, `245/40ZR18`), a flotation size (`33x12.50R15`), or a bare number, which is the diameter in inches (`35`). Bare and flotation numbers have at most two whole digits. The page shows the unloaded diameter worked out from the size.
- Tire Size refuses, as you type or paste, any character that cannot lead to a valid size. Pasted text is trimmed first, and a paste that does not fit is refused whole. Deleting is always allowed.
- Rolling Diameter is in the selected units.
- Only one of Tire Size and Rolling Diameter is active. Entering a valid value in one clears the other. A mistyped tire size does not clear the rolling diameter.
- An empty Tire Size is not an error while a Rolling Diameter is entered.
- Every field holding an invalid value gets a red outline, and the messages under the tables list the problems in page order. Tire Size is outlined as you type; the messages and speeds update when you leave a field or press Enter.
- With no usable diameter, the readouts show "-" and the speed table is empty.
- Switching units changes only the display; the values are held in inches, so switching back and forth never drifts.

## Running locally

Serve the folder with any static server. The VS Code launch configuration expects http://localhost:8080, for example:

```
npx http-server -p 8080
```

or

```
python -m http.server 8080
```

Opening `index.html` directly in a browser also works.

## Tests

```
node --test tests/*.test.js
```

The tests need Node 20 or later. CI runs them before deploying to GitHub Pages.

## Ratio sources

These entries are checked against a manufacturer document, or a word-for-word reproduction of one:

- BMW M-DCT GS7D36SG (E92 M3 GTS): [BMW Media Information 5/2010](https://www.bimmerfile.com/wp-content/uploads/2010/05/Specifications_BMW_M3_GTS_05_2010.pdf)
- Chrysler 45RFE: [SAE 1999-01-0755, DaimlerChrysler](https://saemobilus.sae.org/papers/chrysler-45rfe-a-new-generation-real-time-electronic-control-rwd-automatic-transmission-1999-01-0755)
- Chrysler 545RFE, A618 / 47RE: [DaimlerChrysler 2003 Ram 2500/3500 preliminary specifications (reproduction)](https://rockcrawler.com/features/newsshorts/02may/dodge_25003500specs.asp)
- Chrysler 65RFE: [2013 Ram 1500 specifications](https://cdn.base.parameter1.com/files/base/acbm/fcp/document/2012/04/2013_ram_1500_specs_10689309.pdf)
- Chrysler 66RFE / 68RFE: [2013 Ram 2500/3500 preliminary specifications](https://cdn.base.parameter1.com/files/base/acbm/fcp/document/2012/10/2013-ram-hd-specs_10810539.pdf)
- Ford 4R100: [Ford 2003 Super Duty specifications (reproduction)](https://www.ford-trucks.com/specs/2003-2/2003-ford-superduty-specifications/)
- Ford 6R80: [Ford 2014 Mustang workshop manual, section 307-01](https://www.reichwein.it/manuals/Mustang_2014/Workshop_Manual_Wiring_Diagrams/Resources/Service_Manual/seb71002.htm)
- Ford 10R80: [Ford 2026 Mustang technical specifications](https://www.fromtheroad.ford.com/content/dam/fordmediasite/us/en/library/2026/specs/2026_Mustang_Technical_Specs.pdf)
- GM 4L60E: [Chevrolet Performance transmissions (4L65-E family)](https://www.chevrolet.com/performance-parts/transmissions/10l90-e)
- GM 4L80E: [GM Powertrain Hydra-matic 4L80-E technician's guide](https://pdfcoffee.com/4l80e-hydraulic-book-3-pdf-free.html)
- GM 6L80, 10L90: [Chevrolet Performance transmissions](https://www.chevrolet.com/performance-parts/transmissions/10l90-e)
- GM 8L90: [GM PoweredSolutions 8L90](https://poweredsolutions.gm.com/products/8l90-8-speed-transmission/)
- Mercedes 722.3, 722.4: [Mercedes-Benz 722.3 & 722.4 technical overview](https://archive.org/download/mb7223/trans_722.3_722.4_Technical_Overview.pdf)
- Mercedes 9G-Tronic (725.0): [Daimler 9G-TRONIC system description](https://documents.epfl.ch/users/f/fr/froulet/www/Mechanics/2013_09_002_002_en.pdf)
- Nissan RE4R01A / RE4R03A: [Nissan 1990 300ZX service manual, AT section](https://www.nicoclub.com/service-manual?fsm_download=300zx/1990/AT.pdf)
- Nissan RE5R05A: [Nissan 2005 Frontier service manual, AT section](https://www.nicoclub.com/service-manual?fsm_download=Frontier/2005/at.pdf)
- Nissan RE5R05A (350Z '03-'06): [Nissan 2003 350Z service manual, AT section](https://www.nicoclub.com/service-manual?fsm_download=350Z/Coupe/2003/at.pdf)
- Nissan RE5R05A (Titan): [Nissan 2004 Titan service manual, AT section](https://www.nicoclub.com/service-manual?fsm_download=Titan/2004/at.pdf)
- Toyota/Aisin AA80E: [Lexus UK RC F technical specifications](https://media.lexus.co.uk/wp-content/uploads/sites/3/pdf/220201M-RC-F-Tech-Spec.pdf)
- Toyota A750E/F: [Toyota 2021 4Runner product information](https://toyota-cms-media.s3.amazonaws.com/wp-content/uploads/2020/02/2021_Toyota_4Runner_Product_Information.pdf)
- Toyota AB60E/F: [Toyota 2021 Sequoia product information](https://toyota-cms-media.s3.amazonaws.com/wp-content/uploads/2020/02/2021_Toyota_Sequoia_Product_Information_FINAL.pdf)
- Toyota AE80F / AB80F: [Toyota 2021 Land Cruiser product information](https://toyota-cms-media.s3.amazonaws.com/wp-content/uploads/2020/07/2021_Toyota_Land_Cruiser_Product_Information.pdf)
- ZF 4HP22, 4HP24: [Jaguar ZF automatic transmissions service manual](https://jl-discourse-uploads.s3.dualstack.us-east-1.amazonaws.com/original/3X/c/6/c66e9b70286f0afea66184cb3cbb399a42804fbf.pdf)
- ZF 5HP24: [BMW NA 2001 5 Series V-8 specifications](https://www.press.bmwgroup.com/usa/article/attachment/T0021989EN_US/41286)
- ZF 5HP30: [BMW NA 2001 7 Series specifications](https://press.bmwgroup.com/usa/article/attachment/T0021954EN_US/41250)
- ZF 6HP26: [BMW NA 2002 7 Series technical specifications](https://www.press.bmwgroup.com/usa/article/attachment/T0022133EN_US/41418)
- ZF 8HP, 4.71 first: [Stellantis 2018 Dodge Charger specifications](https://s3.amazonaws.com/chryslermedia.iconicweb.com/mediasite/specs/2018_DG_Charger_ChargerSRT_SP.pdf); [Stellantis 2027 Ram 1500 specifications](https://s3.amazonaws.com/chryslermedia.iconicweb.com/mediasite/specs/2027_Ram_1500_SPt3aa1219tvbcrqeo4a6f8igd6s.pdf)
- ZF 8HP, 5.00 first: [BMW M3 G80 Competition press kit](https://www.press.bmwgroup.com/global/article/attachment/T0316649EN/476823); [Stellantis 2023 Alfa Romeo Giulia specifications](https://s3.amazonaws.com/chryslermedia.iconicweb.com/mediasite/specs/2023_AR_Giulia_SP4r7eo4kokg4lc6av3dhsmf918q.pdf)
- ZF 8HP, 5.25 first: [BMW M340i xDrive press kit](https://www.press.bmwgroup.com/global/article/attachment/T0302031EN/440594); [Toyota GR Supra technical specification](https://media.toyota.co.uk/wp-content/uploads/sites/5/pdf/220605M-GR-Supra-Tech-Spec.pdf)
- Getrag 420G: [BMW NA 2002 M3 specifications](https://www.press.bmwgroup.com/usa/article/attachment/T0022127EN_US/41385)
- Honda S2000 AP1, AP2: [Honda 2004 S2000 powertrain](https://hondanews.com/releases/2004-honda-s2000-powertrain). The listed ratios include the gearbox's secondary reduction (1.160 AP1, 1.208 AP2), so they work with Honda's 4.100 final drive.
- Mazda Miata NC 6MT: [Mazda 2006 MX-5 specifications](https://news.mazdausa.com/download/SPECS-MX5-06.pdf)
- Mazda Miata ND 6MT: [Mazda 2016 MX-5 features and specifications](https://portal.mazdausa.com/m176/MusaWeb/musa2/pdf/specs/2016_MX-5_Features_Specs.pdf)
- Nissan CD009: [Nissan 2020 370Z coupe specifications](https://zcca.org/wp-content/uploads/2025/10/2020-Nissan-370Z-Coupe-Specifications.pdf)
- Tremec T5 ('World Class' variant): [Ford Performance M-7003-Z](https://performanceparts.ford.com/part/M-7003-Z)
- Tremec T56 (C5 Corvette Base MM6, Z06 M12): [Corvette 2001 specifications (reproduction)](https://www.corvetteactioncenter.com/specs/c5/2001/2001specs.html)
- Tremec TR-6060 (C6 Corvette Z51/Grand Sport MZ6): [GM 2008 TR6060 specifications (reproduction)](https://corvetteactioncenter.com/specs/c6/2008/2008tr6060.html)
- Tremec TR-6060 (C6 Corvette ZR1 MH3): [GM 2010 TR6060 summary (reproduction)](https://www.corvetteclub.org.uk/goto/post?id=67461)

The other entries rest on secondary sources only.
