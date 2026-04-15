import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data...')

  // Prime Energy's clients
  const midwest = await prisma.customer.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Midwest Logistics Center', contact: 'Dave Pollard', email: 'd.pollard@midwestlogistics.com' },
  })
  const telecom = await prisma.customer.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Detroit Metro Telecom', contact: 'Karen Yee', email: 'k.yee@detroitmetrotelecom.com' },
  })
  const medical = await prisma.customer.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'Lakeside Medical Center', contact: 'Frank Russo', email: 'f.russo@lakesidemedical.org' },
  })
  const primeInternal = await prisma.customer.upsert({
    where: { id: 4 },
    update: {},
    create: { name: 'Prime Energy — Internal', contact: 'Operations Team', email: 'ops@primeenergycs.com' },
  })

  // Builds
  const build1 = await prisma.build.upsert({
    where: { buildNumber: 'PE-0001' },
    update: {},
    create: {
      buildNumber: 'PE-0001',
      customerId: midwest.id,
      voltage: '48V',
      cellConfig: '16S4P — LiFePO4',
      quantity: 8,
      application: 'Forklift',
      nominalCapacity: '200Ah',
      enclosureType: 'IP54',
      targetDelivery: new Date('2026-05-15'),
      status: 'TESTING',
      notes: 'Electric forklift fleet battery replacement — 8 units, Phase 1 of 2',
    },
  })

  const build2 = await prisma.build.upsert({
    where: { buildNumber: 'PE-0002' },
    update: {},
    create: {
      buildNumber: 'PE-0002',
      customerId: telecom.id,
      voltage: '12V',
      cellConfig: '4S2P — LiFePO4',
      quantity: 24,
      application: 'Telecom Backup',
      nominalCapacity: '100Ah',
      enclosureType: 'IP67',
      targetDelivery: new Date('2026-03-01'),
      status: 'COMPLETE',
      notes: 'Cell tower backup power — 24 sites, 72-hour runtime requirement',
    },
  })

  const build3 = await prisma.build.upsert({
    where: { buildNumber: 'PE-0003' },
    update: {},
    create: {
      buildNumber: 'PE-0003',
      customerId: medical.id,
      voltage: '24V',
      cellConfig: '8S3P — LiFePO4',
      quantity: 6,
      application: 'UPS / Backup Power',
      nominalCapacity: '150Ah',
      enclosureType: 'IP65',
      targetDelivery: new Date('2026-05-30'),
      status: 'IN_PROGRESS',
      notes: 'Emergency backup power for critical care wing — UL listed cells required',
    },
  })

  const build4 = await prisma.build.upsert({
    where: { buildNumber: 'PE-0004' },
    update: {},
    create: {
      buildNumber: 'PE-0004',
      customerId: primeInternal.id,
      voltage: '36V',
      cellConfig: '10S2P — LiFePO4',
      quantity: 1,
      application: 'Custom',
      nominalCapacity: '50Ah',
      enclosureType: 'Standard',
      targetDelivery: new Date('2026-04-30'),
      status: 'IN_PROGRESS',
      notes: 'Prototype evaluation unit — field validation before Phase 2 rollout',
    },
  })

  // Cell Lots — Build 1 (Midwest Logistics forklift)
  await prisma.cellLot.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build1.id, lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-12') },
      { buildId: build1.id, lotNumber: 'CATL-2026-0318-B', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-18') },
      { buildId: build1.id, lotNumber: 'CATL-2026-0325-A', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-25') },
    ],
  })

  // Cell Lots — Build 2 (Detroit Metro Telecom, complete)
  await prisma.cellLot.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build2.id, lotNumber: 'EVE-2026-0201-A', supplier: 'EVE Energy', quantity: 96, receivedAt: new Date('2026-02-01') },
      { buildId: build2.id, lotNumber: 'EVE-2026-0210-A', supplier: 'EVE Energy', quantity: 96, receivedAt: new Date('2026-02-10') },
    ],
  })

  // Cell Lots — Build 3 (Lakeside Medical)
  await prisma.cellLot.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build3.id, lotNumber: 'SAMSUNG-2026-0401-A', supplier: 'Samsung SDI', quantity: 144, receivedAt: new Date('2026-04-01') },
    ],
  })

  // Cell Lots — Build 4 (Prime Internal prototype)
  await prisma.cellLot.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build4.id, lotNumber: 'CATL-2026-0408-A', supplier: 'CATL', quantity: 20, receivedAt: new Date('2026-04-08') },
    ],
  })

  // Test Results — Build 1 (Midwest Logistics — in testing, one fail)
  await prisma.testResult.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build1.id, testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 2mV tolerance', technician: 'John Koch', testedAt: new Date('2026-03-28') },
      { buildId: build1.id, testType: 'Capacity Test', result: 'PASS', notes: '98.4% of rated capacity confirmed', technician: 'John Koch', testedAt: new Date('2026-04-01') },
      { buildId: build1.id, testType: 'Thermal Management', result: 'PASS', notes: 'Max cell delta temp 2.1C under full load', technician: 'John Koch', testedAt: new Date('2026-04-03') },
      { buildId: build1.id, testType: 'BMS Communication', result: 'FAIL', notes: 'CAN bus timeout on unit 7 — under investigation, replacement BMS ordered', technician: 'John Koch', testedAt: new Date('2026-04-07') },
    ],
  })

  // Test Results — Build 2 (Detroit Metro Telecom — complete, all pass)
  await prisma.testResult.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build2.id, testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 1.5mV tolerance', technician: 'John Koch', testedAt: new Date('2026-02-15') },
      { buildId: build2.id, testType: 'Capacity Test', result: 'PASS', notes: '99.1% of rated capacity — exceeds 72hr runtime spec', technician: 'John Koch', testedAt: new Date('2026-02-18') },
      { buildId: build2.id, testType: 'Thermal Management', result: 'PASS', notes: 'Outdoor enclosure test passed, -20C to +55C range confirmed', technician: 'John Koch', testedAt: new Date('2026-02-20') },
      { buildId: build2.id, testType: 'Functional Test', result: 'PASS', notes: 'Full discharge/charge cycle completed, all 24 units cleared for deployment', technician: 'John Koch', testedAt: new Date('2026-02-22') },
    ],
  })

  // Test Results — Build 4 (Prime Internal prototype)
  await prisma.testResult.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build4.id, testType: 'Cell Matching', result: 'PASS', notes: 'Prototype cells within spec — ready for capacity test', technician: 'John Koch', testedAt: new Date('2026-04-10') },
    ],
  })

  console.log('Seed complete.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
