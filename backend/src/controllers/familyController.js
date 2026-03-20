const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const FamilyModel = {
  // Lista todas as famílias ordenadas alfabeticamente, incluindo membros e rendas
  findAll: async () => {
    return await prisma.family.findMany({
      orderBy: {
        name: "asc", // Ordenação alfabética exigida
      },
      include: {
        members: true,
        incomes: true, // Trazemos as rendas para calcular o total no controller
      },
    });
  },

  // Cria uma nova família (opcionalmente já com membros)
  create: async (familyData) => {
    return await prisma.family.create({
      data: {
        name: familyData.name,
        // Se vierem membros na criação, já insere em lote
        members: {
          create: familyData.members || [],
        },
      },
      include: {
        members: true,
      },
    });
  },

  // Adiciona um membro a uma família existente
  addMember: async (familyId, memberData) => {
    return await prisma.member.create({
      data: {
        ...memberData,
        familyId: familyId,
      },
    });
  },
};

module.exports = FamilyModel;
