const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const FamilyModel = {
  // Listar todas as famílias com seus membros e rendas
  findAll: async () => {
    return await prisma.family.findMany({
      include: {
        members: true,
        incomes: true, // Garante que as rendas também são retornadas
      },
    });
  },

  // Criar uma nova família (com ou sem membros iniciais)
  create: async (familyData) => {
    return await prisma.family.create({
      data: {
        name: familyData.name,
        members: {
          create: familyData.members || [],
        },
      },
      include: {
        members: true,
      },
    });
  },

  // Adicionar um membro a uma família existente
  addMember: async (familyId, memberData) => {
    return await prisma.member.create({
      data: {
        name: memberData.name,
        role: memberData.role,
        familyId: familyId,
      },
    });
  },

  // Adicionar um registro de renda a uma família
  addIncome: async (familyId, incomeData) => {
    return await prisma.income.create({
      data: {
        description: incomeData.description,
        amount: incomeData.amount,
        familyId: familyId,
      },
    });
  },

  // Atualizar o nome da família
  updateFamily: async (id, name) => {
    return await prisma.family.update({
      where: { id },
      data: { name },
    });
  },

  // Excluir a família inteira (apaga os registos dependentes primeiro para não dar erro de chave estrangeira)
  deleteFamily: async (id) => {
    await prisma.income.deleteMany({ where: { familyId: id } });
    await prisma.member.deleteMany({ where: { familyId: id } });
    return await prisma.family.delete({ where: { id } });
  },

  // Excluir um membro específico
  deleteMember: async (memberId) => {
    return await prisma.member.delete({
      where: { id: memberId },
    });
  },
};

module.exports = FamilyModel;
