import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed some starter apps
  await prisma.portalApp.upsert({
    where: { id: "plat-studio" },
    update: {},
    create: {
      id: "plat-studio",
      name: "Plat Studio",
      description:
        "Interactive lot mapping tool for subdivision plats with live DOMO data overlay",
      icon: "map",
      url: "http://localhost:5053",
      minRole: "EMPLOYEE",
      category: "tools",
      sortOrder: 1,
      openIn: "iframe",
    },
  });

  // Make the first user (skyler) an ADMIN if they exist
  const skyler = await prisma.user.findUnique({
    where: { email: "skyler@fieldstonehomes.com" },
  });
  if (skyler) {
    await prisma.user.update({
      where: { id: skyler.id },
      data: { role: "ADMIN" },
    });
    console.log("Set skyler@fieldstonehomes.com as ADMIN");
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
