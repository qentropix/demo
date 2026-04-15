// Shared seed data used by seed.js and the reset endpoint

export const BUILD_STATUSES = {
  'PE-0001': 'TESTING', 'PE-0002': 'COMPLETE', 'PE-0003': 'IN_PROGRESS',
  'PE-0004': 'IN_PROGRESS', 'PE-0005': 'COMPLETE', 'PE-0006': 'COMPLETE',
  'PE-0007': 'TESTING', 'PE-0008': 'COMPLETE', 'PE-0009': 'IN_PROGRESS',
  'PE-0010': 'TESTING', 'PE-0011': 'COMPLETE', 'PE-0012': 'ON_HOLD',
  'PE-0013': 'IN_PROGRESS', 'PE-0014': 'COMPLETE', 'PE-0015': 'IN_PROGRESS',
  'PE-0016': 'TESTING', 'PE-0017': 'IN_PROGRESS', 'PE-0018': 'COMPLETE',
  'PE-0019': 'ON_HOLD', 'PE-0020': 'COMPLETE', 'PE-0021': 'IN_PROGRESS',
  'PE-0022': 'TESTING', 'PE-0023': 'IN_PROGRESS', 'PE-0024': 'COMPLETE',
  'PE-0025': 'IN_PROGRESS', 'PE-0026': 'ON_HOLD', 'PE-0027': 'COMPLETE',
  'PE-0028': 'TESTING', 'PE-0029': 'IN_PROGRESS',
}

export function getCellLots(builds) {
  const b = builds
  return [
    // PE-0001 — 3 CATL lots (recall affected)
    { buildId: b['PE-0001'], lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-12') },
    { buildId: b['PE-0001'], lotNumber: 'CATL-2026-0318-B', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-18') },
    { buildId: b['PE-0001'], lotNumber: 'CATL-2026-0325-A', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-25') },
    // PE-0002 — EVE + CATL (recall affected — delivered)
    { buildId: b['PE-0002'], lotNumber: 'EVE-2026-0201-A', supplier: 'EVE Energy', quantity: 96, receivedAt: new Date('2026-02-01') },
    { buildId: b['PE-0002'], lotNumber: 'EVE-2026-0210-A', supplier: 'EVE Energy', quantity: 96, receivedAt: new Date('2026-02-10') },
    { buildId: b['PE-0002'], lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 48, receivedAt: new Date('2026-03-12') },
    // PE-0003 — Samsung
    { buildId: b['PE-0003'], lotNumber: 'SAMSUNG-2026-0401-A', supplier: 'Samsung SDI', quantity: 144, receivedAt: new Date('2026-04-01') },
    // PE-0004 — CATL prototype
    { buildId: b['PE-0004'], lotNumber: 'CATL-2026-0408-A', supplier: 'CATL', quantity: 20, receivedAt: new Date('2026-04-08') },
    // PE-0005 — CATL (recall affected — delivered)
    { buildId: b['PE-0005'], lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 120, receivedAt: new Date('2026-03-12') },
    { buildId: b['PE-0005'], lotNumber: 'CATL-2026-0318-B', supplier: 'CATL', quantity: 60, receivedAt: new Date('2026-03-18') },
    // PE-0006 — EVE Energy
    { buildId: b['PE-0006'], lotNumber: 'EVE-2026-0110-A', supplier: 'EVE Energy', quantity: 200, receivedAt: new Date('2026-01-10') },
    { buildId: b['PE-0006'], lotNumber: 'EVE-2026-0120-A', supplier: 'EVE Energy', quantity: 200, receivedAt: new Date('2026-01-20') },
    // PE-0007 — Samsung SDI
    { buildId: b['PE-0007'], lotNumber: 'SAMSUNG-2026-0315-A', supplier: 'Samsung SDI', quantity: 192, receivedAt: new Date('2026-03-15') },
    // PE-0008 — EVE Energy marine
    { buildId: b['PE-0008'], lotNumber: 'EVE-2026-0301-A', supplier: 'EVE Energy', quantity: 192, receivedAt: new Date('2026-03-01') },
    // PE-0009 — Panasonic NMC
    { buildId: b['PE-0009'], lotNumber: 'PAN-2026-0320-A', supplier: 'Panasonic', quantity: 240, receivedAt: new Date('2026-03-20') },
    // PE-0010 — CATL (recall affected — in testing)
    { buildId: b['PE-0010'], lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 192, receivedAt: new Date('2026-03-12') },
    { buildId: b['PE-0010'], lotNumber: 'CATL-2026-0325-A', supplier: 'CATL', quantity: 192, receivedAt: new Date('2026-03-25') },
    // PE-0011 — EVE Energy
    { buildId: b['PE-0011'], lotNumber: 'EVE-2026-0210-B', supplier: 'EVE Energy', quantity: 128, receivedAt: new Date('2026-02-10') },
    // PE-0012 — CATL (on hold)
    { buildId: b['PE-0012'], lotNumber: 'CATL-2026-0401-A', supplier: 'CATL', quantity: 96, receivedAt: new Date('2026-04-01') },
    // PE-0013 — Samsung SDI
    { buildId: b['PE-0013'], lotNumber: 'SAMSUNG-2026-0401-B', supplier: 'Samsung SDI', quantity: 192, receivedAt: new Date('2026-04-05') },
    // PE-0014 — EVE Energy (delivered)
    { buildId: b['PE-0014'], lotNumber: 'EVE-2026-0105-A', supplier: 'EVE Energy', quantity: 256, receivedAt: new Date('2026-01-05') },
    // PE-0015 — Samsung SDI
    { buildId: b['PE-0015'], lotNumber: 'SAMSUNG-2026-0402-A', supplier: 'Samsung SDI', quantity: 288, receivedAt: new Date('2026-04-02') },
    // PE-0016 — EVE Energy marine
    { buildId: b['PE-0016'], lotNumber: 'EVE-2026-0310-A', supplier: 'EVE Energy', quantity: 128, receivedAt: new Date('2026-03-10') },
    // PE-0017 — CATL Phase 2
    { buildId: b['PE-0017'], lotNumber: 'CATL-2026-0405-A', supplier: 'CATL', quantity: 256, receivedAt: new Date('2026-04-05') },
    // PE-0018 — EVE Energy (delivered)
    { buildId: b['PE-0018'], lotNumber: 'EVE-2026-0220-A', supplier: 'EVE Energy', quantity: 144, receivedAt: new Date('2026-02-20') },
    // PE-0020 — Samsung (delivered)
    { buildId: b['PE-0020'], lotNumber: 'SAMSUNG-2026-0120-A', supplier: 'Samsung SDI', quantity: 180, receivedAt: new Date('2026-01-20') },
    // PE-0021 — Panasonic NMC
    { buildId: b['PE-0021'], lotNumber: 'PAN-2026-0410-A', supplier: 'Panasonic', quantity: 720, receivedAt: new Date('2026-04-10') },
    // PE-0022 — CATL low temp
    { buildId: b['PE-0022'], lotNumber: 'CATL-2026-0402-A', supplier: 'CATL', quantity: 256, receivedAt: new Date('2026-04-02') },
    // PE-0024 — CATL (delivered — recall affected)
    { buildId: b['PE-0024'], lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 144, receivedAt: new Date('2026-03-12') },
    // PE-0027 — EVE Energy marine (delivered)
    { buildId: b['PE-0027'], lotNumber: 'EVE-2026-0210-C', supplier: 'EVE Energy', quantity: 160, receivedAt: new Date('2026-02-10') },
    // PE-0028 — Samsung SDI
    { buildId: b['PE-0028'], lotNumber: 'SAMSUNG-2026-0320-A', supplier: 'Samsung SDI', quantity: 192, receivedAt: new Date('2026-03-20') },
    // PE-0029 — CATL internal
    { buildId: b['PE-0029'], lotNumber: 'CATL-2026-0410-A', supplier: 'CATL', quantity: 128, receivedAt: new Date('2026-04-10') },
  ]
}

export function getTestResults(builds) {
  const b = builds
  return [
    // PE-0001
    { buildId: b['PE-0001'], testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 2mV tolerance', technician: 'John Koch', testedAt: new Date('2026-03-28') },
    { buildId: b['PE-0001'], testType: 'Capacity Test', result: 'PASS', notes: '98.4% of rated capacity confirmed', technician: 'John Koch', testedAt: new Date('2026-04-01') },
    { buildId: b['PE-0001'], testType: 'Thermal Management', result: 'PASS', notes: 'Max cell delta temp 2.1C under full load', technician: 'John Koch', testedAt: new Date('2026-04-03') },
    { buildId: b['PE-0001'], testType: 'BMS Communication', result: 'FAIL', notes: 'CAN bus timeout on unit 7 — under investigation, replacement BMS ordered', technician: 'John Koch', testedAt: new Date('2026-04-07') },
    // PE-0002
    { buildId: b['PE-0002'], testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 1.5mV tolerance', technician: 'John Koch', testedAt: new Date('2026-02-15') },
    { buildId: b['PE-0002'], testType: 'Capacity Test', result: 'PASS', notes: '99.1% of rated capacity — exceeds 72hr runtime spec', technician: 'John Koch', testedAt: new Date('2026-02-18') },
    { buildId: b['PE-0002'], testType: 'Thermal Management', result: 'PASS', notes: 'Outdoor enclosure test passed, -20C to +55C range confirmed', technician: 'John Koch', testedAt: new Date('2026-02-20') },
    { buildId: b['PE-0002'], testType: 'Functional Test', result: 'PASS', notes: 'Full discharge/charge cycle completed, all 24 units cleared for deployment', technician: 'John Koch', testedAt: new Date('2026-02-22') },
    // PE-0003
    { buildId: b['PE-0003'], testType: 'Cell Matching', result: 'PASS', notes: 'Samsung SDI lot within spec — proceeding to capacity test', technician: 'John Koch', testedAt: new Date('2026-04-05') },
    // PE-0004
    { buildId: b['PE-0004'], testType: 'Cell Matching', result: 'PASS', notes: 'Prototype cells within spec — ready for capacity test', technician: 'John Koch', testedAt: new Date('2026-04-10') },
    // PE-0005
    { buildId: b['PE-0005'], testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 1.8mV tolerance', technician: 'Sarah Mills', testedAt: new Date('2026-02-05') },
    { buildId: b['PE-0005'], testType: 'Capacity Test', result: 'PASS', notes: '97.8% rated capacity — within spec', technician: 'Sarah Mills', testedAt: new Date('2026-02-08') },
    { buildId: b['PE-0005'], testType: 'Functional Test', result: 'PASS', notes: 'All 10 units operational, full shift cycle tested', technician: 'Sarah Mills', testedAt: new Date('2026-02-12') },
    // PE-0006
    { buildId: b['PE-0006'], testType: 'Cell Matching', result: 'PASS', notes: 'Heavy gauge cells matched within 3mV', technician: 'John Koch', testedAt: new Date('2026-01-22') },
    { buildId: b['PE-0006'], testType: 'Capacity Test', result: 'PASS', notes: '99.3% rated capacity — excellent result', technician: 'John Koch', testedAt: new Date('2026-01-25') },
    { buildId: b['PE-0006'], testType: 'Load Test', result: 'PASS', notes: 'Sustained 600A discharge — no thermal event, BMS stable', technician: 'John Koch', testedAt: new Date('2026-01-27') },
    { buildId: b['PE-0006'], testType: 'Functional Test', result: 'PASS', notes: 'All 4 units operational under 15-ton load simulation', technician: 'John Koch', testedAt: new Date('2026-01-29') },
    // PE-0007
    { buildId: b['PE-0007'], testType: 'Cell Matching', result: 'PASS', notes: 'Within 2mV tolerance across all strings', technician: 'Sarah Mills', testedAt: new Date('2026-04-01') },
    { buildId: b['PE-0007'], testType: 'Capacity Test', result: 'PASS', notes: '98.9% rated capacity confirmed', technician: 'Sarah Mills', testedAt: new Date('2026-04-05') },
    { buildId: b['PE-0007'], testType: 'Grid Integration Test', result: 'FAIL', notes: 'Inverter communication fault on unit 2 — firmware update pending', technician: 'Sarah Mills', testedAt: new Date('2026-04-10') },
    // PE-0008
    { buildId: b['PE-0008'], testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 1.5mV', technician: 'John Koch', testedAt: new Date('2026-03-05') },
    { buildId: b['PE-0008'], testType: 'Capacity Test', result: 'PASS', notes: '99.5% rated capacity', technician: 'John Koch', testedAt: new Date('2026-03-08') },
    { buildId: b['PE-0008'], testType: 'Thermal Management', result: 'PASS', notes: 'Marine thermal test passed — salt spray exposure 72hrs', technician: 'John Koch', testedAt: new Date('2026-03-12') },
    { buildId: b['PE-0008'], testType: 'IP Rating Verification', result: 'PASS', notes: 'IP67 confirmed — 1m submersion 30min, no ingress', technician: 'John Koch', testedAt: new Date('2026-03-15') },
    { buildId: b['PE-0008'], testType: 'Functional Test', result: 'PASS', notes: 'All 6 boats tested, full day runtime confirmed', technician: 'John Koch', testedAt: new Date('2026-03-18') },
    // PE-0010
    { buildId: b['PE-0010'], testType: 'Cell Matching', result: 'PASS', notes: 'All 384 cells within 2mV', technician: 'Sarah Mills', testedAt: new Date('2026-04-08') },
    { buildId: b['PE-0010'], testType: 'Capacity Test', result: 'PASS', notes: '97.2% rated capacity — proceeding to thermal', technician: 'Sarah Mills', testedAt: new Date('2026-04-11') },
    // PE-0011
    { buildId: b['PE-0011'], testType: 'Cell Matching', result: 'PASS', notes: 'Within 1.8mV', technician: 'John Koch', testedAt: new Date('2026-02-20') },
    { buildId: b['PE-0011'], testType: 'Capacity Test', result: 'PASS', notes: '98.1% rated capacity', technician: 'John Koch', testedAt: new Date('2026-02-23') },
    { buildId: b['PE-0011'], testType: 'Functional Test', result: 'PASS', notes: 'All 8 stations operational, 24hr runtime validated', technician: 'John Koch', testedAt: new Date('2026-02-26') },
    // PE-0014
    { buildId: b['PE-0014'], testType: 'Cell Matching', result: 'PASS', notes: 'Within 2mV tolerance', technician: 'Sarah Mills', testedAt: new Date('2026-01-08') },
    { buildId: b['PE-0014'], testType: 'Capacity Test', result: 'PASS', notes: '98.7% rated capacity', technician: 'Sarah Mills', testedAt: new Date('2026-01-10') },
    { buildId: b['PE-0014'], testType: 'Functional Test', result: 'PASS', notes: '8hr runtime confirmed, all 4 systems stable', technician: 'Sarah Mills', testedAt: new Date('2026-01-13') },
    // PE-0016
    { buildId: b['PE-0016'], testType: 'Cell Matching', result: 'PASS', notes: 'Within 1.5mV', technician: 'John Koch', testedAt: new Date('2026-04-05') },
    { buildId: b['PE-0016'], testType: 'IP Rating Verification', result: 'PASS', notes: 'IP68 confirmed — 1.5m submersion 60min, no ingress detected', technician: 'John Koch', testedAt: new Date('2026-04-09') },
    // PE-0018
    { buildId: b['PE-0018'], testType: 'Cell Matching', result: 'PASS', notes: 'Within 2mV', technician: 'Sarah Mills', testedAt: new Date('2026-02-25') },
    { buildId: b['PE-0018'], testType: 'Capacity Test', result: 'PASS', notes: '99.0% rated capacity', technician: 'Sarah Mills', testedAt: new Date('2026-02-27') },
    { buildId: b['PE-0018'], testType: 'Functional Test', result: 'PASS', notes: 'Cold chain compliance verified, all 3 stations operational', technician: 'Sarah Mills', testedAt: new Date('2026-03-01') },
    // PE-0020
    { buildId: b['PE-0020'], testType: 'Cell Matching', result: 'PASS', notes: 'Within 2mV', technician: 'John Koch', testedAt: new Date('2026-01-25') },
    { buildId: b['PE-0020'], testType: 'Capacity Test', result: 'PASS', notes: '98.5% rated capacity', technician: 'John Koch', testedAt: new Date('2026-01-28') },
    { buildId: b['PE-0020'], testType: 'Thermal Management', result: 'PASS', notes: 'Extreme weather test -30C to +60C passed', technician: 'John Koch', testedAt: new Date('2026-02-01') },
    { buildId: b['PE-0020'], testType: 'Functional Test', result: 'PASS', notes: 'All 15 remote sites validated', technician: 'John Koch', testedAt: new Date('2026-02-05') },
    // PE-0022
    { buildId: b['PE-0022'], testType: 'Cell Matching', result: 'PASS', notes: 'Within 2.5mV — acceptable for low-temp cells', technician: 'Sarah Mills', testedAt: new Date('2026-04-12') },
    { buildId: b['PE-0022'], testType: 'Low Temperature Test', result: 'PASS', notes: 'Full capacity at -25C operating temp confirmed', technician: 'Sarah Mills', testedAt: new Date('2026-04-14') },
    // PE-0024
    { buildId: b['PE-0024'], testType: 'Cell Matching', result: 'PASS', notes: 'Within 1.8mV', technician: 'Sarah Mills', testedAt: new Date('2026-03-05') },
    { buildId: b['PE-0024'], testType: 'Capacity Test', result: 'PASS', notes: '98.2% rated capacity', technician: 'Sarah Mills', testedAt: new Date('2026-03-08') },
    { buildId: b['PE-0024'], testType: 'Functional Test', result: 'PASS', notes: 'All 6 AGV units operational, assembly line B cleared', technician: 'Sarah Mills', testedAt: new Date('2026-03-12') },
    // PE-0027
    { buildId: b['PE-0027'], testType: 'Cell Matching', result: 'PASS', notes: 'Within 1.5mV', technician: 'John Koch', testedAt: new Date('2026-02-15') },
    { buildId: b['PE-0027'], testType: 'Capacity Test', result: 'PASS', notes: '99.2% rated capacity', technician: 'John Koch', testedAt: new Date('2026-02-18') },
    { buildId: b['PE-0027'], testType: 'IP Rating Verification', result: 'PASS', notes: 'IP67 confirmed on all 10 units', technician: 'John Koch', testedAt: new Date('2026-02-20') },
    { buildId: b['PE-0027'], testType: 'Functional Test', result: 'PASS', notes: 'All 10 vessels signed off, seasonal launch ready', technician: 'John Koch', testedAt: new Date('2026-02-25') },
    // PE-0028
    { buildId: b['PE-0028'], testType: 'Cell Matching', result: 'PASS', notes: 'Within 2mV across all strings', technician: 'Sarah Mills', testedAt: new Date('2026-04-05') },
    { buildId: b['PE-0028'], testType: 'Capacity Test', result: 'PASS', notes: '97.9% rated capacity', technician: 'Sarah Mills', testedAt: new Date('2026-04-09') },
  ]
}
