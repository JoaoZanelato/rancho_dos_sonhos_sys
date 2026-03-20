const FamilyModel = require('../models/familyModel');

const FamilyController = {
  // Listar famílias com soma de rendas
  getFamilies: async (req, res) => {
    try {
      const families = await FamilyModel.findAll();

      // Formata o retorno para incluir o total da renda de cada família
      const formattedFamilies = families.map(family => {
        // Calcula o total somando todos os registros de renda
        const totalIncome = family.incomes.reduce((sum, current) => {
          return sum + Number(current.amount);
        }, 0);

        return {
          id: family.id,
          name: family.name,
          members: family.members,
          incomes: family.incomes,
          totalIncome: totalIncome
        };
      });

      res.status(200).json(formattedFamilies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar famílias' });
    }
  },

  // Criar nova família
  createFamily: async (req, res) => {
    try {
      const { name, members } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'O nome da família é obrigatório' });
      }

      const newFamily = await FamilyModel.create({ name, members });
      res.status(201).json(newFamily);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar família' });
    }
  },

  // Adicionar membro à família
  addMemberToFamily: async (req, res) => {
    try {
      const { id } = req.params; // ID da família na URL
      const { name, role } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'O nome do membro é obrigatório' });
      }

      const newMember = await FamilyModel.addMember(id, { name, role });
      res.status(201).json(newMember);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao adicionar membro' });
    }
  }
};

module.exports = FamilyController;