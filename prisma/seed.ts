import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.registrationActivity.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.normProfileHistory.deleteMany();
  await prisma.normProfile.deleteMany();
  await prisma.activityCategory.deleteMany();
  await prisma.team.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.appSettings.deleteMany();

  await prisma.appSettings.create({
    data: {
      id: "default",
      thresholdGreen: 100,
      thresholdOrange: 90,
    },
  });

  const teamA = await prisma.team.create({ data: { name: "Team A" } });
  const teamB = await prisma.team.create({ data: { name: "Team B" } });

  const dossierProfile = await prisma.normProfile.create({
    data: {
      name: "Dossierbehandelaar",
      hoursPerDay: 8,
      targetUnits: 4,
      history: {
        create: {
          hoursPerDay: 8,
          targetUnits: 4,
          validFrom: new Date("2025-01-01"),
        },
      },
    },
  });

  const categories = [
    "Overleg",
    "Opleiding",
    "Begeleiding / inwerken",
    "Administratief werk",
    "Kwaliteitswerk",
    "Klachten",
    "Andere toegewezen werkzaamheden",
    "Ziek / afwezig",
    "Bijzonder / complex dossier",
    "Overig",
  ];

  for (const name of categories) {
    await prisma.activityCategory.create({
      data: {
        name,
        reducesProductiveTime: true,
        active: true,
      },
    });
  }

  const employees = [
    { name: "Jan Jansen", teamId: teamA.id, hoursPerDay: 8, targetUnits: 4, pin: "1234" },
    { name: "Petra Smit", teamId: teamA.id, hoursPerDay: 8, targetUnits: 4, pin: "2345" },
    { name: "Lisa de Boer", teamId: teamB.id, hoursPerDay: 6, targetUnits: 3, pin: "3456" },
    { name: "Marko Landman", teamId: teamA.id, hoursPerDay: 8, targetUnits: 4, pin: "4567" },
  ];

  for (const employee of employees) {
    await prisma.employee.create({
      data: {
        name: employee.name,
        email: `${employee.name.toLowerCase().replace(/\s+/g, ".")}@ind.nl`,
        pinCode: await bcrypt.hash(employee.pin, 10),
        teamId: employee.teamId,
        normProfileId: dossierProfile.id,
        hoursPerDay: employee.hoursPerDay,
        active: true,
      },
    });
  }

  await prisma.admin.create({
    data: {
      name: "IND Admin",
      email: "admin@ind.nl",
      passwordHash: await bcrypt.hash("admin123", 10),
    },
  });

  const overleg = await prisma.activityCategory.findFirstOrThrow({ where: { name: "Overleg" } });
  const opleiding = await prisma.activityCategory.findFirstOrThrow({ where: { name: "Opleiding" } });
  const begeleiding = await prisma.activityCategory.findFirstOrThrow({
    where: { name: "Begeleiding / inwerken" },
  });
  const admin = await prisma.activityCategory.findFirstOrThrow({
    where: { name: "Administratief werk" },
  });

  const petra = await prisma.employee.findFirstOrThrow({ where: { name: "Petra Smit" } });
  const jan = await prisma.employee.findFirstOrThrow({ where: { name: "Jan Jansen" } });
  const lisa = await prisma.employee.findFirstOrThrow({ where: { name: "Lisa de Boer" } });

  const sampleDates = [
    new Date("2026-10-01"),
    new Date("2026-10-02"),
    new Date("2026-10-03"),
    new Date("2026-10-04"),
  ];

  await prisma.registration.create({
    data: {
      employeeId: petra.id,
      date: sampleDates[0],
      productionUnits: 4,
      activities: { create: [{ categoryId: overleg.id, hours: 1 }] },
    },
  });

  await prisma.registration.create({
    data: {
      employeeId: petra.id,
      date: sampleDates[1],
      productionUnits: 2,
      comment: "Training",
      activities: {
        create: [
          { categoryId: overleg.id, hours: 2 },
          { categoryId: opleiding.id, hours: 2 },
        ],
      },
    },
  });

  await prisma.registration.create({
    data: {
      employeeId: petra.id,
      date: sampleDates[2],
      productionUnits: 5,
    },
  });

  await prisma.registration.create({
    data: {
      employeeId: petra.id,
      date: sampleDates[3],
      productionUnits: 3,
      comment: "Complex dossier",
      activities: {
        create: [
          { categoryId: overleg.id, hours: 1 },
          { categoryId: admin.id, hours: 1 },
        ],
      },
    },
  });

  await prisma.registration.create({
    data: {
      employeeId: jan.id,
      date: sampleDates[3],
      productionUnits: 6,
    },
  });

  await prisma.registration.create({
    data: {
      employeeId: lisa.id,
      date: sampleDates[3],
      productionUnits: 2,
      activities: {
        create: [{ categoryId: begeleiding.id, hours: 1.5 }],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed voltooid");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
