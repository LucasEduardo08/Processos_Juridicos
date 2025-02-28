// Importando as libs
const { PrismaClient } = require("@prisma/client");
// const { connect } = require("../routes/processRouter");
const prisma = new PrismaClient();

// Adcionar licenças
async function calendar(req, res) {
  // Dados recebidos
  console.log(req.body);

  // Atributos
  const { Cale_Data, Cale_DiaSemana, Cale_TipoData } = req.body;

  try {
    // Atributos que não podem ser vazios
    if (!Cale_Data || !Cale_DiaSemana || !Cale_TipoData) {
      res.json({ error: "Não é possível inserir a data desejada" });
    } else {
      // Objeto para criar a licença
      const novaData = await prisma.calendario.create({
        data: {
          Cale_Data,
          Cale_DiaSemana,
          Cale_TipoData,
        },
      });

      // Resposta
      res.status(200).json(novaData);
    }
  } catch {
    // Mensagem de erro
    res.status(500).json({ error: "Erro ao criar a cadastrar a data." });
  }
}

// Função para alterar o calendário
async function updateCalendar(req, res) {
  // Dados recebidos
  console.log("req body", req.body);

  // Atributos
  const { Calt_Data, Calt_Motivo, Calt_Usuario_id, tipo_data } = req.body;

  try {
    // Atributos que não podem ser vazios
    if (!Calt_Data || !Calt_Motivo || !Calt_Usuario_id) {
      res.json({ error: "Não é possível alterar a data desejada" });
    } else {
      // Verificando se o usuário que está alterando é secretária
      const usuario = await prisma.usuarios.findUnique({
        where: {
          id: parseInt(Calt_Usuario_id),
        },
      });

      if (String(usuario.Usua_TipoUsuario).trim() !== "secretaria") {
        return res.status(403).json({ error: "Apenas usuários do tipo Secretária podem alterar o calendário." });
      }

      // const data = await prisma.calendario.update({
      //   where: {
      //     Cale_Data: Calt_Data,
      //   },
      //   data: {
      //     Cale_TipoData: tipo_data,
      //   },
      // });

      // Objeto para criar a licença
      const novaAlteracaoData = await prisma.calendarioAlteracoes.create({
        data: {
          Calt_Data,
          Calt_Motivo,
          Calt_Usuario_id,
          Calt_Tipo: tipo_data,
        },
      });

      // Resposta
      res.status(200).json(novaAlteracaoData);
    }
  } catch (error) {
    // Mensagem de erro
    console.log(error);
    res.status(500).json({ error: "Erro ao alterar a data." });
  }
}

async function getCalendar(req, res) {
  try {
    // Pegando as datas cadastradas
    const datas = await prisma.calendario.findMany();
    res.status(200).json(datas);
  } catch (error) {
    // Mensagem de erro
    res.status(500).json({ error: "Erro ao pegar as datas cadastradas" });
  }
}

// Exportar funções
module.exports = {
  calendar,
  updateCalendar,
  getCalendar,
};
