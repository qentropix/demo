import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data...')

  // Customers
  const toyota = await prisma.customer.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Toyota Material Handling', contact: 'James Wu', email: 'j.wu@toyota-mh.com' },
  })
  const marina = await prisma.customer.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Great Lakes Marina', contact: 'Sarah Kowalski', email: 's.kowalski@greatlakesmarina.com' },
  })
  const buildwise = await prisma.customer.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'Buildwise Facilities', contact: 'Ron Hatch', email: 'r.hatch@buildwisefacilities.com' },
  })
  const custom = await prisma.customer.upsert({
    where: { id: 4 },
    update: {},
    create: { name: 'Custom Prototype Client', contact: 'Sumit Mathur', email: 'connect@qentropix.com' },
  })

  // Builds
  const build1 = await prisma.build.upsert({
    where: { buildNumber: 'PE-0001' },
    update: {},
    create: {
      buildNumber: 'PE-0001',
      customerId: toyota.id,
      voltage: '48V',
      cellConfig: '16S4P — LiFePO4',
      quantity: 12,
      status: 'TESTING',
      notes: 'AGV fleet replacement — Phase 1 of 3',
    },
  })

  const build2 = await prisma.build.upsert({
    where: { buildNumber: 'PE-0002' },
    update: {},
    create: {
      buildNumber: 'PE-0002',
      customerId: marina.id,
      voltage: '24V',
      cellConfig: '8S2P — LiFePO4',
      quantity: 4,
      status: 'COMPLETE',
      notes: 'Marine conversion — 28ft pontoon fleet',
    },
  })

  const build3 = await prisma.build.upsert({
    where: { buildNumber: 'PE-0003' },
    update: {},
    create: {
      buildNumber: 'PE-0003',
      customerId: buildwise.id,
      voltage: '72V',
      cellConfig: '24S3P — NMC',
      quantity: 6,
      status: 'IN_PROGRESS',
      notes: 'Building automation backup power — UPS replacement',
    },
  })

  const build4 = await prisma.build.upsert({
    where: { buildNumber: 'PE-0004' },
    update: {},
    create: {
      buildNumber: 'PE-0004',
      customerId: custom.id,
      voltage: '36V',
      cellConfig: '10S2P — LiFePO4',
      quantity: 1,
      status: 'IN_PROGRESS',
      notes: 'Custom prototype — Modular Energy Cube v2 validation',
    },
  })

  // Cell Lots — Build 1
  await prisma.cellLot.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build1.id, lotNumber: 'CATL-2026-0312-A', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-12') },
      { buildId: build1.id, lotNumber: 'CATL-2026-0318-B', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-18') },
      { buildId: build1.id, lotNumber: 'CATL-2026-0325-A', supplier: 'CATL', quantity: 64, receivedAt: new Date('2026-03-25') },
    ],
  })

  // Cell Lots — Build 2
  await prisma.cellLot.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build2.id, lotNumber: 'EVE-2026-0201-A', supplier: 'EVE Energy', quantity: 32, receivedAt: new Date('2026-02-01') },
      { buildId: build2.id, lotNumber: 'EVE-2026-0210-A', supplier: 'EVE Energy', quantity: 32, receivedAt: new Date('2026-02-10') },
    ],
  })

  // Cell Lots — Build 3
  await prisma.cellLot.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build3.id, lotNumber: 'SAMSUNG-2026-0401-A', supplier: 'Samsung SDI', quantity: 144, receivedAt: new Date('2026-04-01') },
    ],
  })

  // Cell Lots — Build 4
  await prisma.cellLot.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build4.id, lotNumber: 'CATL-2026-0408-A', supplier: 'CATL', quantity: 20, receivedAt: new Date('2026-04-08') },
    ],
  })

  // Test Results — Build 1
  await prisma.testResult.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build1.id, testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 2mV tolerance', technician: 'John Koch', testedAt: new Date('2026-03-28') },
      { buildId: build1.id, testType: 'Capacity Test', result: 'PASS', notes: '98.4% of rated capacity confirmed', technician: 'John Koch', testedAt: new Date('2026-04-01') },
      { buildId: build1.id, testType: 'Thermal Management', result: 'PASS', notes: 'Max cell delta temp 2.1C under load', technician: 'John Koch', testedAt: new Date('2026-04-03') },
      { buildId: build1.id, testType: 'BMS Communication', result: 'FAIL', notes: 'CAN bus timeout on unit 7 -- under investigation', technician: 'John Koch', testedAt: new Date('2026-04-07') },
    ],
  })

  // Test Results — Build 2
  await prisma.testResult.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build2.id, testType: 'Cell Matching', result: 'PASS', notes: 'All cells within 1.5mV tolerance', technician: 'John Koch', testedAt: new Date('2026-02-15') },
      { buildId: build2.id, testType: 'Capacity Test', result: 'PASS', notes: '99.1% of rated capacity confirmed', technician: 'John Koch', testedAt: new Date('2026-02-18') },
      { buildId: build2.id, testType: 'Thermal Management', result: 'PASS', notes: 'Marine environment test passed -- IP67 confirmed', technician: 'John Koch', testedAt: new Date('2026-02-20') },
      { buildId: build2.id, testType: 'Functional Test', result: 'PASS', notes: 'Full discharge/charge cycle completed successfully', technician: 'John Koch', testedAt: new Date('2026-02-22') },
    ],
  })

  // Test Results — Build 4
  await prisma.testResult.createMany({
    skipDuplicates: true,
    data: [
      { buildId: build4.id, testType: 'Cell Matching', result: 'PASS', notes: 'Prototype cells within spec', technician: 'John Koch', testedAt: new Date('2026-04-10') },
    ],
  })

  console.log('Seed complete.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
