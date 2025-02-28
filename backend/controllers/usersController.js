// Importando as libs
const { PrismaClient } = require("@prisma/client");
// const { connect } = require("../routes/processRouter");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

// Função para cadastrar Funcionários
async function registerEmployee(req, res) {
  // Dados recebidos
  console.log(req.body);

  // Atributos
  const { Usua_Matricula, Usua_Nome, Usua_Email, Usua_CPF, Usua_TipoUsuario, Usua_Identidade, Usua_Telefone, Usua_Sexo, Pcrd_NumeroOAB } = req.body;

  let cargo;

  let tipoUsua;

  try {
    // Atributos que não podem ser vazios
    if (!Usua_Nome || !Usua_CPF || !Usua_Email || !Usua_TipoUsuario || !Usua_Identidade || !Usua_Sexo || !Usua_Telefone) {
      res.json({ error: "Não é possível cadastrar o usuário porque há dados faltantes" });
    } else {
      tipoUsua = Usua_TipoUsuario;
      const hashedPassword = await bcrypt.hash(Usua_CPF, 10);
      if (Usua_TipoUsuario === "ProcuradorGeral" || Usua_TipoUsuario === "ProcuradorEfetivo") {
        if (Usua_TipoUsuario.includes("Geral")) {
          cargo = "Geral";
        } else {
          cargo = "Efetivo";
        }

        // Objeto para criar o Usuário
        const novoUsuario = await prisma.usuarios.create({
          data: {
            Usua_Matricula,
            Usua_Nome,
            Usua_CPF,
            Usua_Identidade,
            Usua_Senha: hashedPassword,
            Usua_Telefone,
            Usua_Email,
            Usua_TipoUsuario,
            Usua_Sexo,
            procuradores: {
              create: {
                Pcrd_NumeroOAB,
                Pcrd_Cargo: cargo,
              },
            },
          },
        });

        // Resposta
        res.status(200).json(novoUsuario);
      } else {
        console.log(1);

        // Objeto para criar o Usuário
        const novoUsuario = await prisma.usuarios.create({
          data: {
            Usua_Matricula,
            Usua_Nome,
            Usua_CPF,
            Usua_Identidade,
            Usua_Senha: hashedPassword,
            Usua_Telefone,
            Usua_Email,
            Usua_TipoUsuario,
            Usua_Sexo,
          },
        });

        // Resposta
        res.status(200).json(novoUsuario);
      }
    }
  } catch (e) {
    // Mensagem de erro
    res.status(500).json(e);
    console.log(e);
  }
  console.log("Dados recebidos no backend:", req.body);
  console.log(cargo);
  console.log(tipoUsua);
}

// Função para editar usuários
async function editEmployee(req, res) {
  // Dados recebidos
  console.log(req.body);
  console.log(req.params);

  // Atributos
  const { id } = req.params;

  const { Usua_Matricula, Usua_Nome, Usua_Email, Usua_TipoUsuario, Usua_Identidade, Usua_Telefone, Usua_Sexo, Usua_CPF } = req.body;

  try {
    // Atualiza o procurador que vai ficar com o processo
    const atualizar_informacoes = await prisma.usuarios.update({
      where: {
        id: parseInt(id),
      },
      data: {
        Usua_Matricula: Usua_Matricula,
        Usua_Nome: Usua_Nome,
        Usua_CPF: Usua_CPF,
        Usua_Identidade: Usua_Identidade,
        Usua_Telefone: Usua_Telefone,
        Usua_Email: Usua_Email,
        Usua_TipoUsuario: Usua_TipoUsuario,
        Usua_Sexo: Usua_Sexo,
      },
    });

    // Resposta
    res.status(200).json(atualizar_informacoes);
  } catch (error) {
    console.error("Erro ao atualizar as informações do usuário: ", error);
    res.status(500).json({ error: "Erro ao atualizar as informações do usuário." });
  }
}

// Pegar as informações dos usuários
async function getEmployee(req, res) {
  try {
    // Pegando os usuários cadastrados
    const funcionarios = await prisma.usuarios.findMany();
    res.status(200).json(funcionarios);
  } catch (error) {
    // Mensagem de erro
    res.status(500).json({ error: "Erro ao pegar as informações" });
  }
}

async function getAttorneys(req, res) {
  try {
    // Pegando os usuários cadastrados que são procuradores
    const procurador = await prisma.procuradores.findMany();
    res.status(200).json(procurador);
  } catch (error) {
    // Mensagem de erro
    res.status(500).json({ error: "Erro ao pegar as informações" });
  }
}

// Pegar as informações de um procurador específico
async function getOneAttorneys(req, res) {
  // Atributos
  const { id } = req.params;

  try {
    // Pegando o procurador específico cadastrado
    const procurador = await prisma.procuradores.findUnique({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json(procurador);
  } catch (error) {
    // Mensagem de erro
    res.status(500).json({ error: "Erro ao pegar as informações" });
  }
}

// Fazer a ideia de Deletar Funcionário que é tirar o acesso dele no sistema

// Exportar funções
module.exports = {
  registerEmployee,
  editEmployee,
  getEmployee,
  getAttorneys,
  getOneAttorneys,
};
