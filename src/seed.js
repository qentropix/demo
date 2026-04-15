import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data...')

  // ── Customers ──────────────────────────────────────────────────────────────
  const customers = await Promise.all([
    prisma.customer.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: 'Midwest Logistics Center', contact: 'Dave Pollard', email: 'd.pollard@midwestlogistics.com' } }),
    prisma.customer.upsert({ where: { id: 2 }, update: {}, create: { id: 2, name: 'Detroit Metro Telecom', contact: 'Karen Yee', email: 'k.yee@detroitmetrotelecom.com' } }),
    prisma.customer.upsert({ where: { id: 3 }, update: {}, create: { id: 3, name: 'Lakeside Medical Center', contact: 'Frank Russo', email: 'f.russo@lakesidemedical.org' } }),
    prisma.customer.upsert({ where: { id: 4 }, update: {}, create: { id: 4, name: 'Prime Energy — Internal', contact: 'Operations Team', email: 'ops@primeenergycs.com' } }),
    prisma.customer.upsert({ where: { id: 5 }, update: {}, create: { id: 5, name: 'Great Lakes Manufacturing', contact: 'Tom Brewer', email: 't.brewer@greatlakesmfg.com' } }),
    prisma.customer.upsert({ where: { id: 6 }, update: {}, create: { id: 6, name: 'Dearborn Steel Works', contact: 'Mike Okafor', email: 'm.okafor@dearbornsteel.com' } }),
    prisma.customer.upsert({ where: { id: 7 }, update: {}, create: { id: 7, name: 'Michigan Solar Partners', contact: 'Linda Zhao', email: 'l.zhao@misolarpartners.com' } }),
    prisma.customer.upsert({ where: { id: 8 }, update: {}, create: { id: 8, name: 'Peninsula Marina Group', contact: 'Steve Hartley', email: 's.hartley@peninsulamarina.com' } }),
    prisma.customer.upsert({ where: { id: 9 }, update: {}, create: { id: 9, name: 'Detroit EV Fleet', contact: 'Angela Morse', email: 'a.morse@detroitevfleet.com' } }),
    prisma.customer.upsert({ where: { id: 10 }, update: {}, create: { id: 10, name: 'AZD Distribution Center', contact: 'Ray Kowalski', email: 'r.kowalski@azddist.com' } }),
    prisma.customer.upsert({ where: { id: 11 }, update: {}, create: { id: 11, name: 'United Security Systems', contact: 'Patricia Nolan', email: 'p.nolan@unitedsecurity.com' } }),
    prisma.customer.upsert({ where: { id: 12 }, update: {}, create: { id: 12, name: 'Midwest Cold Storage', contact: 'Greg Tanner', email: 'g.tanner@midwestcoldstorage.com' } }),
  ])

  const [midwest, telecom, medical, primeInternal, glMfg, dearborn, miSolar, peninsula, detroitEV, azd, united, coldStorage] = customers

  // ── Builds ─────────────────────────────────────────────────────────────────
  const builds = await Promise.all([
    // PE-0001 — Midwest Logistics forklift (TESTING)
    prisma.build.upsert({ where: { buildNumber: 'PE-0001' }, update: {}, create: { buildNumber: 'PE-0001', customerId: midwest.id, voltage: '48V', cellConfig: '16S4P — LiFePO4', quantity: 8, application: 'Forklift', nominalCapacity: '200Ah', enclosureType: 'IP54', targetDelivery: new Date('2026-05-15'), status: 'TESTING', notes: 'Electric forklift fleet battery replacement — 8 units, Phase 1 of 2' } }),
    // PE-0002 — Detroit Metro Telecom (COMPLETE)
    prisma.build.upsert({ where: { buildNumber: 'PE-0002' }, update: {}, create: { buildNumber: 'PE-0002', customerId: telecom.id, voltage: '12V', cellConfig: '4S2P — LiFePO4', quantity: 24, application: 'Telecom Backup', nominalCapacity: '100Ah', enclosureType: 'IP67', targetDelivery: new Date('2026-03-01'), status: 'COMPLETE', notes: 'Cell tower backup power — 24 sites, 72-hour runtime requirement' } }),
    // PE-0003 — Lakeside Medical (IN_PROGRESS)
    prisma.build.upsert({ where: { buildNumber: 'PE-0003' }, update: {}, create: { buildNumber: 'PE-0003', customerId: medical.id, voltage: '24V', cellConfig: '8S3P — LiFePO4', quantity: 6, application: 'UPS / Backup Power', nominalCapacity: '150Ah', enclosureType: 'IP65', targetDelivery: new Date('2026-05-30'), status: 'IN_PROGRESS', notes: 'Emergency backup power for critical care wing — UL listed cells required' } }),
    // PE-0004 — Prime Internal prototype (IN_PROGRESS)
    prisma.build.upsert({ where: { buildNumber: 'PE-0004' }, update: {}, create: { buildNumber: 'PE-0004', customerId: primeInternal.id, voltage: '36V', cellConfig: '10S2P — LiFePO4', quantity: 1, application: 'Custom', nominalCapacity: '50Ah', enclosureType: 'Standard', targetDelivery: new Date('2026-04-30'), status: 'IN_PROGRESS', notes: 'Prototype evaluation unit — field validation before Phase 2 rollout' } }),
    // PE-0005 — Great Lakes Manufacturing AGV (COMPLETE)
    prisma.build.upsert({ where: { buildNumber: 'PE-0005' }, update: {}, create: { buildNumber: 'PE-0005', customerId: glMfg.id, voltage: '48V', cellConfig: '16S3P — LiFePO4', quantity: 10, application: 'Forklift', nominalCapacity: '150Ah', enclosureType: 'IP54', targetDelivery: new Date('2026-02-15'), status: 'COMPLETE', notes: 'AGV fleet upgrade — 10 units, stamping plant floor' } }),
    // PE-0006 — Dearborn Steel heavy forklift (COMPLETE)
    prisma.build.upsert({ where: { buildNumber: 'PE-0006' }, update: {}, create: { buildNumber: 'PE-0006', customerId: dearborn.id, voltage: '80V', cellConfig: '25S4P — LiFePO4', quantity: 4, application: 'Forklift', nominalCapacity: '400Ah', enclosureType: 'IP54', targetDelivery: new Date('2026-01-30'), status: 'COMPLETE', notes: 'Heavy-duty forklift replacement — 15-ton capacity units, steel coil handling' } }),
    // PE-0007 — Michigan Solar Partners storage (TESTING)
    prisma.build.upsert({ where: { buildNumber: 'PE-0007' }, update: {}, create: { buildNumber: 'PE-0007', customerId: miSolar.id, voltage: '48V', cellConfig: '16S8P — LiFePO4', quantity: 3, application: 'Solar Storage', nominalCapacity: '400Ah', enclosureType: 'IP65', targetDelivery: new Date('2026-05-01'), status: 'TESTING', notes: 'Grid-tied solar storage — 3 cabinet units, commercial rooftop installation' } }),
    // PE-0008 — Peninsula Marina marine (COMPLETE)
    prisma.build.upsert({ where: { buildNumber: 'PE-0008' }, update: {}, create: { buildNumber: 'PE-0008', customerId: peninsula.id, voltage: '24V', cellConfig: '8S4P — LiFePO4', quantity: 6, application: 'Marine', nominalCapacity: '200Ah', enclosureType: 'IP67', targetDelivery: new Date('2026-03-20'), status: 'COMPLETE', notes: 'Electric pontoon conversion — 6 boats, seasonal fleet' } }),
    // PE-0009 — Detroit EV Fleet (IN_PROGRESS)
    prisma.build.upsert({ where: { buildNumber: 'PE-0009' }, update: {}, create: { buildNumber: 'PE-0009', customerId: detroitEV.id, voltage: '72V', cellConfig: '24S2P — NMC', quantity: 5, application: 'EV Conversion', nominalCapacity: '100Ah', enclosureType: 'IP55', targetDelivery: new Date('2026-06-15'), status: 'IN_PROGRESS', notes: 'Last-mile delivery van conversion — Phase 1 pilot fleet' } }),
    // PE-0010 — AZD Distribution forklift (TESTING)
    prisma.build.upsert({ where: { buildNumber: 'PE-0010' }, update: {}, create: { buildNumber: 'PE-0010', customerId: azd.id, voltage: '48V', cellConfig: '16S4P — LiFePO4', quantity: 12, application: 'Forklift', nominalCapacity: '200Ah', enclosureType: 'IP54', targetDelivery: new Date('2026-05-10'), status: 'TESTING', notes: 'Distribution warehouse forklift fleet — 12 units, 2-shift operation' } }),
    // PE-0011 — United Security UPS (COMPLETE)
    prisma.build.upsert({ where: { buildNumber: 'PE-0011' }, update: {}, create: { buildNumber: 'PE-0011', customerId: united.id, voltage: '24V', cellConfig: '8S2P — LiFePO4', quantity: 8, application: 'UPS / Backup Power', nominalCapacity: '100Ah', enclosureType: 'IP54', targetDelivery: new Date('2026-02-28'), status: 'COMPLETE', notes: 'Security system backup — 8 remote monitoring stations, 24hr runtime' } }),
    // PE-0012 — Midwest Cold Storage (ON_HOLD)
    prisma.build.upsert({ where: { buildNumber: 'PE-0012' }, update: {}, create: { buildNumber: 'PE-0012', customerId: coldStorage.id, voltage: '48V', cellConfig: '16S2P — LiFePO4', quantity: 6, application: 'Forklift', nominalCapacity: '100Ah', enclosureType: 'IP54', targetDelivery: new Date('2026-06-30'), status: 'ON_HOLD', notes: 'Cold storage forklift — on hold pending customer facility expansion approval' } }),
    // PE-0013 — Great Lakes Mfg solar (IN_PROGRESS)
    prisma.build.upsert({ where: { buildNumber: 'PE-0013' }, update: {}, create: { buildNumber: 'PE-0013', customerId: glMfg.id, voltage: '48V', cellConfig: '16S6P — LiFePO4', quantity: 2, application: 'Solar Storage', nominalCapacity: '300Ah', enclosureType: 'IP65', targetDelivery: new Date('2026-06-01'), status: 'IN_PROGRESS', notes: 'Rooftop solar storage — peak shaving for stamping plant, 200kW demand' } }),
    // PE-0014 — Dearborn Steel UPS (COMPLETE)
    prisma.build.upsert({ where: { buildNumber: 'PE-0014' }, update: {}, create: { buildNumber: 'PE-0014', customerId: dearborn.id, voltage: '48V', cellConfig: '16S4P — LiFePO4', quantity: 4, application: 'UPS / Backup Power', nominalCapacity: '200Ah', enclosureType: 'IP54', targetDelivery: new Date('2026-01-15'), status: 'COMPLETE', notes: 'Control room UPS replacement — 4 critical systems, 8hr runtime requirement' } }),
    // PE-0015 — Detroit Metro Telecom Phase 2 (IN_PROGRESS)
    prisma.build.upsert({ where: { buildNumber: 'PE-0015' }, update: {}, create: { buildNumber: 'PE-0015', customerId: telecom.id, voltage: '12V', cellConfig: '4S4P — LiFePO4', quantity: 18, application: 'Telecom Backup', nominalCapacity: '200Ah', enclosureType: 'IP67', targetDelivery: new Date('2026-06-30'), status: 'IN_PROGRESS', notes: 'Phase 2 tower expansion — 18 additional sites, extended 96hr runtime spec' } }),
    // PE-0016 — Peninsula Marina Phase 2 (TESTING)
    prisma.build.upsert({ where: { buildNumber: 'PE-0016' }, update: {}, create: { buildNumber: 'PE-0016', customerId: peninsula.id, voltage: '48V', cellConfig: '16S2P — LiFePO4', quantity: 4, application: 'Marine', nominalCapacity: '100Ah', enclosureType: 'IP68', targetDelivery: new Date('2026-05-01'), status: 'TESTING', notes: 'Deep water vessel conversion — submersible enclosure, IP68 required' } }),
    // PE-0017 — Midwest Logistics Phase 2 (IN_PROGRESS)
    prisma.build.upsert({ where: { buildNumber: 'PE-0017' }, update: {}, create: { buildNumber: 'PE-0017', customerId: midwest.id, voltage: '48V', cellConfig: '16S4P — LiFePO4', quantity: 8, application: 'Forklift', nominalCapacity: '200Ah', enclosureType: 'IP54', targetDelivery: new Date('2026-07-01'), status: 'IN_PROGRESS', notes: 'Phase 2 fleet expansion — 8 additional units matching Phase 1 spec' } }),
    // PE-0018 — AZD Distribution UPS (COMPLETE)
    prisma.build.upsert({ where: { buildNumber: 'PE-0018' }, update: {}, create: { buildNumber: 'PE-0018', customerId: azd.id, voltage: '24V', cellConfig: '8S3P — LiFePO4', quantity: 3, application: 'UPS / Backup Power', nominalCapacity: '150Ah', enclosureType: 'IP54', targetDelivery: new Date('2026-03-10'), status: 'COMPLETE', notes: 'Dock management system UPS — 3 control stations, cold chain compliance' } }),
    // PE-0019 — Michigan Solar commercial (ON_HOLD)
    prisma.build.upsert({ where: { buildNumber: 'PE-0019' }, update: {}, create: { buildNumber: 'PE-0019', customerId: miSolar.id, voltage: '48V', cellConfig: '16S10P — LiFePO4', quantity: 5, application: 'Solar Storage', nominalCapacity: '500Ah', enclosureType: 'IP65', targetDelivery: new Date('2026-08-01'), status: 'ON_HOLD', notes: 'Large commercial solar storage — on hold pending utility interconnection approval' } }),
    // PE-0020 — United Security telecom backup (COMPLETE)
    prisma.build.upsert({ where: { buildNumber: 'PE-0020' }, update: {}, create: { buildNumber: 'PE-0020', customerId: united.id, voltage: '12V', cellConfig: '4S3P — LiFePO4', quantity: 15, application: 'Telecom Backup', nominalCapacity: '150Ah', enclosureType: 'IP65', targetDelivery: new Date('2026-02-10'), status: 'COMPLETE', notes: 'Outdoor camera and comms backup — 15 remote sites, extreme weather rated' } }),
    // PE-0021 — Detroit EV Phase 2 (IN_PROGRESS)
    prisma.build.upsert({ where: { buildNumber: 'PE-0021' }, update: {}, create: { buildNumber: 'PE-0021', customerId: detroitEV.id, voltage: '72V', cellConfig: '24S3P — NMC', quantity: 10, application: 'EV Conversion', nominalCapacity: '150Ah', enclosureType: 'IP55', targetDelivery: new Date('2026-07-15'), status: 'IN_PROGRESS', notes: 'Phase 2 fleet expansion — 10 additional vans based on Phase 1 validation' } }),
    // PE-0022 — Cold Storage AGV (TESTING)
    prisma.build.upsert({ where: { buildNumber: 'PE-0022' }, update: {}, create: { buildNumber: 'PE-0022', customerId: coldStorage.id, voltage: '48V', cellConfig: '16S4P — LFP', quantity: 4, application: 'Forklift', nominalCapacity: '200Ah', enclosureType: 'IP54', targetDelivery: new Date('2026-05-20'), status: 'TESTING', notes: 'Freeze warehouse AGV — low-temp rated cells, -25C operating environment' } }),
    // PE-0023 — Lakeside Medical Phase 2 (IN_PROGRESS)
    prisma.build.upsert({ where: { buildNumber: 'PE-0023' }, update: {}, create: { buildNumber: 'PE-0023', customerId: medical.id, voltage: '48V', cellConfig: '16S4P — LiFePO4', quantity: 4, application: 'UPS / Backup Power', nominalCapacity: '200Ah', enclosureType: 'IP65', targetDelivery: new Date('2026-07-01'), status: 'IN_PROGRESS', notes: 'Surgical wing UPS upgrade — 4 operating room critical systems' } }),
    // PE-0024 — Great Lakes Mfg forklift Phase 2 (COMPLETE)
    prisma.build.upsert({ where: { buildNumber: 'PE-0024' }, update: {}, create: { buildNumber: 'PE-0024', customerId: glMfg.id, voltage: '48V', cellConfig: '16S3P — LiFePO4', quantity: 6, application: 'Forklift', nominalCapacity: '150Ah', enclosureType: 'IP54', targetDelivery: new Date('2026-03-15'), status: 'COMPLETE', notes: 'Phase 2 AGV expansion — 6 additional units, assembly line B' } }),
    // PE-0025 — Dearborn Steel solar (IN_PROGRESS)
    prisma.build.upsert({ where: { buildNumber: 'PE-0025' }, update: {}, create: { buildNumber: 'PE-0025', customerId: dearborn.id, voltage: '48V', cellConfig: '16S8P — LiFePO4', quantity: 4, application: 'Solar Storage', nominalCapacity: '400Ah', enclosureType: 'IP65', targetDelivery: new Date('2026-06-30'), status: 'IN_PROGRESS', notes: 'On-site solar storage — peak demand management, 500kW install' } }),
    // PE-0026 — AZD EV delivery (ON_HOLD)
    prisma.build.upsert({ where: { buildNumber: 'PE-0026' }, update: {}, create: { buildNumber: 'PE-0026', customerId: azd.id, voltage: '72V', cellConfig: '24S2P — NMC', quantity: 8, application: 'EV Conversion', nominalCapacity: '100Ah', enclosureType: 'IP55', targetDelivery: new Date('2026-08-15'), status: 'ON_HOLD', notes: 'Delivery fleet EV conversion — on hold pending DOT certification' } }),
    // PE-0027 — Peninsula Marina small craft (COMPLETE)
    prisma.build.upsert({ where: { buildNumber: 'PE-0027' }, update: {}, create: { buildNumber: 'PE-0027', customerId: peninsula.id, voltage: '12V', cellConfig: '4S4P — LiFePO4', quantity: 10, application: 'Marine', nominalCapacity: '200Ah', enclosureType: 'IP67', targetDelivery: new Date('2026-03-01'), status: 'COMPLETE', notes: 'Small craft starter and house battery replacement — 10 vessels' } }),
    // PE-0028 — United Security solar (TESTING)
    prisma.build.upsert({ where: { buildNumber: 'PE-0028' }, update: {}, create: { buildNumber: 'PE-0028', customerId: united.id, voltage: '24V', cellConfig: '8S4P — LiFePO4', quantity: 6, application: 'Solar Storage', nominalCapacity: '200Ah', enclosureType: 'IP65', targetDelivery: new Date('2026-05-15'), status: 'TESTING', notes: 'Off-grid security post solar storage — 6 remote locations, no grid access' } }),
    // PE-0029 — Prime Energy internal EV (IN_PROGRESS)
    prisma.build.upsert({ where: { buildNumber: 'PE-0029' }, update: {}, create: { buildNumber: 'PE-0029', customerId: primeInternal.id, voltage: '48V', cellConfig: '16S4P — LiFePO4', quantity: 2, application: 'EV Conversion', nominalCapacity: '200Ah', enclosureType: 'IP55', targetDelivery: new Date('2026-06-01'), status: 'IN_PROGRESS', notes: 'Internal service vehicle EV conversion — 2 utility trucks for field ops' } }),
  ])

  const [b1,b2,b3,b4,b5,b6,b7,b8,b9,b10,b11,b12,b13,b14,b15,b16,b17,b18,b19,b20,b21,b22,b23,b24,b25,b26,b27,b28,b29] = builds

  // ── Cell Lots ───────────────────────────────────────────────────────────────
  await prisma.cellLot.createMany({
    skipDuplicates: true,
    data: [
      // PE-0001 — 3 CATL lots (recall affected)
      { buildId: b1.id, lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-12') },
      { buildId: b1.id, lotNumber: 'CATL-2026-0318-B', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-18') },
      { buildId: b1.id, lotNumber: 'CATL-2026-0325-A', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-25') },
      // PE-0002 — EVE + CATL (recall affected — delivered)
      { buildId: b2.id, lotNumber: 'EVE-2026-0201-A', supplier: 'EVE Energy', quantity: 96, receivedAt: new Date('2026-02-01') },
      { buildId: b2.id, lotNumber: 'EVE-2026-0210-A', supplier: 'EVE Energy', quantity: 96, receivedAt: new Date('2026-02-10') },
      { buildId: b2.id, lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 48, receivedAt: new Date('2026-03-12') },
      // PE-0003 — Samsung
      { buildId: b3.id, lotNumber: 'SAMSUNG-2026-0401-A', supplier: 'Samsung SDI', quantity: 144, receivedAt: new Date('2026-04-01') },
      // PE-0004 — CATL prototype
      { buildId: b4.id, lotNumber: 'CATL-2026-0408-A', supplier: 'CATL', quantity: 20, receivedAt: new Date('2026-04-08') },
      // PE-0005 — CATL (recall affected — delivered)
      { buildId: b5.id, lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 120, receivedAt: new Date('2026-03-12') },
      { buildId: b5.id, lotNumber: 'CATL-2026-0318-B', supplier: 'CATL', quantity: 60, receivedAt: new Date('2026-03-18') },
      // PE-0006 — EVE Energy
      { buildId: b6.id, lotNumber: 'EVE-2026-0110-A', supplier: 'EVE Energy', quantity: 200, receivedAt: new Date('2026-01-10') },
      { buildId: b6.id, lotNumber: 'EVE-2026-0120-A', supplier: 'EVE Energy', quantity: 200, receivedAt: new Date('2026-01-20') },
      // PE-0007 — Samsung SDI
      { buildId: b7.id, lotNumber: 'SAMSUNG-2026-0315-A', supplier: 'Samsung SDI', quantity: 192, receivedAt: new Date('2026-03-15') },
      // PE-0008 — EVE Energy marine
      { buildId: b8.id, lotNumber: 'EVE-2026-0301-A', supplier: 'EVE Energy', quantity: 192, receivedAt: new Date('2026-03-01') },
      // PE-0009 — Panasonic NMC
      { buildId: b9.id, lotNumber: 'PAN-2026-0320-A', supplier: 'Panasonic', quantity: 240, receivedAt: new Date('2026-03-20') },
      // PE-0010 — CATL (recall affected — in testing)
      { buildId: b10.id, lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 192, receivedAt: new Date('2026-03-12') },
      { buildId: b10.id, lotNumber: 'CATL-2026-0325-A', supplier: 'CATL', quantity: 192, receivedAt: new Date('2026-03-25') },
      // PE-0011 — EVE Energy
      { buildId: b11.id, lotNumber: 'EVE-2026-0210-B', supplier: 'EVE Energy', quantity: 128, receivedAt: new Date('2026-02-10') },
      // PE-0012 — CATL (on hold)
      { buildId: b12.id, lotNumber: 'CATL-2026-0401-A', supplier: 'CATL', quantity: 96, receivedAt: new Date('2026-04-01') },
      // PE-0013 — Samsung SDI
      { buildId: b13.id, lotNumber: 'SAMSUNG-2026-0401-B', supplier: 'Samsung SDI', quantity: 192, receivedAt: new Date('2026-04-05') },
      // PE-0014 — EVE Energy (delivered)
      { buildId: b14.id, lotNumber: 'EVE-2026-0105-A', supplier: 'EVE Energy', quantity: 256, receivedAt: new Date('2026-01-05') },
      // PE-0015 — Samsung SDI
      { buildId: b15.id, lotNumber: 'SAMSUNG-2026-0402-A', supplier: 'Samsung SDI', quantity: 288, receivedAt: new Date('2026-04-02') },
      // PE-0016 — EVE Energy marine
      { buildId: b16.id, lotNumber: 'EVE-2026-0310-A', supplier: 'EVE Energy', quantity: 128, receivedAt: new Date('2026-03-10') },
      // PE-0017 — CATL Phase 2
      { buildId: b17.id, lotNumber: 'CATL-2026-0405-A', supplier: 'CATL', quantity: 256, receivedAt: new Date('2026-04-05') },
      // PE-0018 — EVE Energy (delivered)
      { buildId: b18.id, lotNumber: 'EVE-2026-0220-A', supplier: 'EVE Energy', quantity: 144, receivedAt: new Date('2026-02-20') },
      // PE-0020 — Samsung (delivered)
      { buildId: b20.id, lotNumber: 'SAMSUNG-2026-0120-A', supplier: 'Samsung SDI', quantity: 180, receivedAt: new Date('2026-01-20') },
      // PE-0021 — Panasonic NMC
      { buildId: b21.id, lotNumber: 'PAN-2026-0410-A', supplier: 'Panasonic', quantity: 720, receivedAt: new Date('2026-04-10') },
      // PE-0022 — CATL low temp
      { buildId: b22.id, lotNumber: 'CATL-2026-0402-A', supplier: 'CATL', quantity: 256, receivedAt: new Date('2026-04-02') },
      // PE-0024 — CATL (delivered — recall affected)
      { buildId: b24.id, lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 144, receivedAt: new Date('2026-03-12') },
      // PE-0027 — EVE Energy marine (delivered)
      { buildId: b27.id, lotNumber: 'EVE-2026-0210-C', supplier: 'EVE Energy', quantity: 160, receivedAt: new Date('2026-02-10') },
      // PE-0028 — Samsung SDI
      { buildId: b28.id, lotNumber: 'SAMSUNG-2026-0320-A', supplier: 'Samsung SDI', quantity: 192, receivedAt: new Date('2026-03-20') },
      // PE-0029 — CATL internal
      { buildId: b29.id, lotNumber: 'CATL-2026-0410-A', supplier: 'CATL', quantity: 128, receivedAt: new Date('2026-04-10') },
    ],
  })

  // ── Test Results ────────────────────────────────────────────────────────────
  await prisma.testResult.createMany({
    skipDuplicates: true,
    data: [
      // PE-0001 (TESTING — one FAIL)
      { buildId: b1.id, testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 2mV tolerance', technician: 'John Koch', testedAt: new Date('2026-03-28') },
      { buildId: b1.id, testType: 'Capacity Test', result: 'PASS', notes: '98.4% of rated capacity confirmed', technician: 'John Koch', testedAt: new Date('2026-04-01') },
      { buildId: b1.id, testType: 'Thermal Management', result: 'PASS', notes: 'Max cell delta temp 2.1C under full load', technician: 'John Koch', testedAt: new Date('2026-04-03') },
      { buildId: b1.id, testType: 'BMS Communication', result: 'FAIL', notes: 'CAN bus timeout on unit 7 — under investigation, replacement BMS ordered', technician: 'John Koch', testedAt: new Date('2026-04-07') },

      // PE-0002 (COMPLETE — all pass)
      { buildId: b2.id, testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 1.5mV tolerance', technician: 'John Koch', testedAt: new Date('2026-02-15') },
      { buildId: b2.id, testType: 'Capacity Test', result: 'PASS', notes: '99.1% of rated capacity — exceeds 72hr runtime spec', technician: 'John Koch', testedAt: new Date('2026-02-18') },
      { buildId: b2.id, testType: 'Thermal Management', result: 'PASS', notes: 'Outdoor enclosure test passed, -20C to +55C range confirmed', technician: 'John Koch', testedAt: new Date('2026-02-20') },
      { buildId: b2.id, testType: 'Functional Test', result: 'PASS', notes: 'Full discharge/charge cycle completed, all 24 units cleared for deployment', technician: 'John Koch', testedAt: new Date('2026-02-22') },

      // PE-0003 (IN_PROGRESS — partial)
      { buildId: b3.id, testType: 'Cell Matching', result: 'PASS', notes: 'Samsung SDI lot within spec — proceeding to capacity test', technician: 'John Koch', testedAt: new Date('2026-04-05') },

      // PE-0004 (IN_PROGRESS — one test done)
      { buildId: b4.id, testType: 'Cell Matching', result: 'PASS', notes: 'Prototype cells within spec — ready for capacity test', technician: 'John Koch', testedAt: new Date('2026-04-10') },

      // PE-0005 (COMPLETE — all pass)
      { buildId: b5.id, testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 1.8mV tolerance', technician: 'Sarah Mills', testedAt: new Date('2026-02-05') },
      { buildId: b5.id, testType: 'Capacity Test', result: 'PASS', notes: '97.8% rated capacity — within spec', technician: 'Sarah Mills', testedAt: new Date('2026-02-08') },
      { buildId: b5.id, testType: 'Functional Test', result: 'PASS', notes: 'All 10 units operational, full shift cycle tested', technician: 'Sarah Mills', testedAt: new Date('2026-02-12') },

      // PE-0006 (COMPLETE — all pass)
      { buildId: b6.id, testType: 'Cell Matching', result: 'PASS', notes: 'Heavy gauge cells matched within 3mV', technician: 'John Koch', testedAt: new Date('2026-01-22') },
      { buildId: b6.id, testType: 'Capacity Test', result: 'PASS', notes: '99.3% rated capacity — excellent result', technician: 'John Koch', testedAt: new Date('2026-01-25') },
      { buildId: b6.id, testType: 'Load Test', result: 'PASS', notes: 'Sustained 600A discharge — no thermal event, BMS stable', technician: 'John Koch', testedAt: new Date('2026-01-27') },
      { buildId: b6.id, testType: 'Functional Test', result: 'PASS', notes: 'All 4 units operational under 15-ton load simulation', technician: 'John Koch', testedAt: new Date('2026-01-29') },

      // PE-0007 (TESTING)
      { buildId: b7.id, testType: 'Cell Matching', result: 'PASS', notes: 'Within 2mV tolerance across all strings', technician: 'Sarah Mills', testedAt: new Date('2026-04-01') },
      { buildId: b7.id, testType: 'Capacity Test', result: 'PASS', notes: '98.9% rated capacity confirmed', technician: 'Sarah Mills', testedAt: new Date('2026-04-05') },
      { buildId: b7.id, testType: 'Grid Integration Test', result: 'FAIL', notes: 'Inverter communication fault on unit 2 — firmware update pending', technician: 'Sarah Mills', testedAt: new Date('2026-04-10') },

      // PE-0008 (COMPLETE — all pass)
      { buildId: b8.id, testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 1.5mV', technician: 'John Koch', testedAt: new Date('2026-03-05') },
      { buildId: b8.id, testType: 'Capacity Test', result: 'PASS', notes: '99.5% rated capacity', technician: 'John Koch', testedAt: new Date('2026-03-08') },
      { buildId: b8.id, testType: 'Thermal Management', result: 'PASS', notes: 'Marine thermal test passed — salt spray exposure 72hrs', technician: 'John Koch', testedAt: new Date('2026-03-12') },
      { buildId: b8.id, testType: 'IP Rating Verification', result: 'PASS', notes: 'IP67 confirmed — 1m submersion 30min, no ingress', technician: 'John Koch', testedAt: new Date('2026-03-15') },
      { buildId: b8.id, testType: 'Functional Test', result: 'PASS', notes: 'All 6 boats tested, full day runtime confirmed', technician: 'John Koch', testedAt: new Date('2026-03-18') },

      // PE-0010 (TESTING)
      { buildId: b10.id, testType: 'Cell Matching', result: 'PASS', notes: 'All 384 cells within 2mV', technician: 'Sarah Mills', testedAt: new Date('2026-04-08') },
      { buildId: b10.id, testType: 'Capacity Test', result: 'PASS', notes: '97.2% rated capacity — proceeding to thermal', technician: 'Sarah Mills', testedAt: new Date('2026-04-11') },

      // PE-0011 (COMPLETE)
      { buildId: b11.id, testType: 'Cell Matching', result: 'PASS', notes: 'Within 1.8mV', technician: 'John Koch', testedAt: new Date('2026-02-20') },
      { buildId: b11.id, testType: 'Capacity Test', result: 'PASS', notes: '98.1% rated capacity', technician: 'John Koch', testedAt: new Date('2026-02-23') },
      { buildId: b11.id, testType: 'Functional Test', result: 'PASS', notes: 'All 8 stations operational, 24hr runtime validated', technician: 'John Koch', testedAt: new Date('2026-02-26') },

      // PE-0014 (COMPLETE)
      { buildId: b14.id, testType: 'Cell Matching', result: 'PASS', notes: 'Within 2mV tolerance', technician: 'Sarah Mills', testedAt: new Date('2026-01-08') },
      { buildId: b14.id, testType: 'Capacity Test', result: 'PASS', notes: '98.7% rated capacity', technician: 'Sarah Mills', testedAt: new Date('2026-01-10') },
      { buildId: b14.id, testType: 'Functional Test', result: 'PASS', notes: '8hr runtime confirmed, all 4 systems stable', technician: 'Sarah Mills', testedAt: new Date('2026-01-13') },

      // PE-0016 (TESTING)
      { buildId: b16.id, testType: 'Cell Matching', result: 'PASS', notes: 'Within 1.5mV', technician: 'John Koch', testedAt: new Date('2026-04-05') },
      { buildId: b16.id, testType: 'IP Rating Verification', result: 'PASS', notes: 'IP68 confirmed — 1.5m submersion 60min, no ingress detected', technician: 'John Koch', testedAt: new Date('2026-04-09') },

      // PE-0018 (COMPLETE)
      { buildId: b18.id, testType: 'Cell Matching', result: 'PASS', notes: 'Within 2mV', technician: 'Sarah Mills', testedAt: new Date('2026-02-25') },
      { buildId: b18.id, testType: 'Capacity Test', result: 'PASS', notes: '99.0% rated capacity', technician: 'Sarah Mills', testedAt: new Date('2026-02-27') },
      { buildId: b18.id, testType: 'Functional Test', result: 'PASS', notes: 'Cold chain compliance verified, all 3 stations operational', technician: 'Sarah Mills', testedAt: new Date('2026-03-01') },

      // PE-0020 (COMPLETE)
      { buildId: b20.id, testType: 'Cell Matching', result: 'PASS', notes: 'Within 2mV', technician: 'John Koch', testedAt: new Date('2026-01-25') },
      { buildId: b20.id, testType: 'Capacity Test', result: 'PASS', notes: '98.5% rated capacity', technician: 'John Koch', testedAt: new Date('2026-01-28') },
      { buildId: b20.id, testType: 'Thermal Management', result: 'PASS', notes: 'Extreme weather test -30C to +60C passed', technician: 'John Koch', testedAt: new Date('2026-02-01') },
      { buildId: b20.id, testType: 'Functional Test', result: 'PASS', notes: 'All 15 remote sites validated', technician: 'John Koch', testedAt: new Date('2026-02-05') },

      // PE-0022 (TESTING)
      { buildId: b22.id, testType: 'Cell Matching', result: 'PASS', notes: 'Within 2.5mV — acceptable for low-temp cells', technician: 'Sarah Mills', testedAt: new Date('2026-04-12') },
      { buildId: b22.id, testType: 'Low Temperature Test', result: 'PASS', notes: 'Full capacity at -25C operating temp confirmed', technician: 'Sarah Mills', testedAt: new Date('2026-04-14') },

      // PE-0024 (COMPLETE — recall affected, already delivered)
      { buildId: b24.id, testType: 'Cell Matching', result: 'PASS', notes: 'Within 1.8mV', technician: 'Sarah Mills', testedAt: new Date('2026-03-05') },
      { buildId: b24.id, testType: 'Capacity Test', result: 'PASS', notes: '98.2% rated capacity', technician: 'Sarah Mills', testedAt: new Date('2026-03-08') },
      { buildId: b24.id, testType: 'Functional Test', result: 'PASS', notes: 'All 6 AGV units operational, assembly line B cleared', technician: 'Sarah Mills', testedAt: new Date('2026-03-12') },

      // PE-0027 (COMPLETE)
      { buildId: b27.id, testType: 'Cell Matching', result: 'PASS', notes: 'Within 1.5mV', technician: 'John Koch', testedAt: new Date('2026-02-15') },
      { buildId: b27.id, testType: 'Capacity Test', result: 'PASS', notes: '99.2% rated capacity', technician: 'John Koch', testedAt: new Date('2026-02-18') },
      { buildId: b27.id, testType: 'IP Rating Verification', result: 'PASS', notes: 'IP67 confirmed on all 10 units', technician: 'John Koch', testedAt: new Date('2026-02-20') },
      { buildId: b27.id, testType: 'Functional Test', result: 'PASS', notes: 'All 10 vessels signed off, seasonal launch ready', technician: 'John Koch', testedAt: new Date('2026-02-25') },

      // PE-0028 (TESTING)
      { buildId: b28.id, testType: 'Cell Matching', result: 'PASS', notes: 'Within 2mV across all strings', technician: 'Sarah Mills', testedAt: new Date('2026-04-05') },
      { buildId: b28.id, testType: 'Capacity Test', result: 'PASS', notes: '97.9% rated capacity', technician: 'Sarah Mills', testedAt: new Date('2026-04-09') },
    ],
  })

  console.log('Seed complete — 29 builds across 12 customers.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
