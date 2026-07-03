import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@bistro.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "admin" },
    create: { email, name: "Administrator", passwordHash, role: "admin" },
  });

  console.log(`✔ Seeded admin user: ${admin.email}`);

  // Example event so the Events page and admin manager have real content to
  // show/edit out of the box. Fixed id → idempotent across re-seeds.
  const event = await prisma.event.upsert({
    where: { id: "seed-sunday-service" },
    update: {},
    create: {
      id: "seed-sunday-service",
      title: "Burger Sunday",
      subtitle: "Jeden Sonntag · 15:00–21:00 Uhr · solange der Vorrat reicht",
      description:
        "Oklahoma Smash Burger + Fries\nBeyond Burger (vegetarisch) + Fries\n+++\n\nKuchen des Tages\n\nReservieren oder einfach vorbeikommen.\n\nBeim Sunday Service gibt es nur Burger und Specials – nicht unser reguläres Menü.",
      image: "/events/sunday-service.jpg",
      published: true,
      sortOrder: 0,
    },
  });

  console.log(`✔ Seeded example event: ${event.title}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
