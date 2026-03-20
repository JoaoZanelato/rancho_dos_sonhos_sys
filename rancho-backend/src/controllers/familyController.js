const FamilyModel = require("../models/familyModel");

const FamilyController = {
  // Listar famílias com soma de rendas
  getFamilies: async (req, res) => {
    try {
      const families = await FamilyModel.findAll();

      // Formata o retorno para incluir o total da renda de cada família
      const formattedFamilies = families.map((family) => {
        const totalIncome = family.incomes.reduce((sum, current) => {
          return sum + Number(current.amount);
        }, 0);

        return {
          id: family.id,
          name: family.name,
          members: family.members,
          incomes: family.incomes,
          totalIncome: totalIncome,
        };
      });

      res.status(200).json(formattedFamilies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar famílias" });
    }
  },

  // Criar nova família
  createFamily: async (req, res) => {
    try {
      const { name, members } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ error: "O nome da família é obrigatório" });
      }

      const newFamily = await FamilyModel.create({ name, members });
      res.status(201).json(newFamily);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar família" });
    }
  },

  // Adicionar membro à família
  addMemberToFamily: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, role } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ error: "O nome do membro é obrigatório" });
      }

      const newMember = await FamilyModel.addMember(id, { name, role });
      res.status(201).json(newMember);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao adicionar membro" });
    }
  },

  // Registrar renda
  addIncomeToFamily: async (req, res) => {
    try {
      const { id } = req.params;
      const { description, amount } = req.body;

      if (!description || !amount) {
        return res
          .status(400)
          .json({ error: "Descrição e valor são obrigatórios" });
      }

      const newIncome = await FamilyModel.addIncome(id, {
        description,
        amount: parseFloat(amount),
      });

      res.status(201).json(newIncome);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao registrar renda" });
    }
  },

  // Atualizar o nome da família
  updateFamily: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ error: "O novo nome da família é obrigatório" });
      }

      const updated = await FamilyModel.updateFamily(id, name);
      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar família" });
    }
  },

  // Excluir a família inteira
  deleteFamily: async (req, res) => {
    try {
      const { id } = req.params;
      await FamilyModel.deleteFamily(id);
      res.status(204).send(); // 204 indica que deu certo, mas não há dados para retornar (No Content)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao excluir família" });
    }
  },

  // Excluir um membro específico
  deleteMember: async (req, res) => {
    try {
      const { id } = req.params;
      await FamilyModel.deleteMember(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao excluir membro" });
    }
  },
};

module.exports = FamilyController;
