// Importando as libs
const { PrismaClient } = require("@prisma/client");
// const { connect } = require("../routes/processRouter");
const prisma = new PrismaClient();

// Função que faz o histórico de transferência
async function transferencia(req, res) {
  // Dados recebidos

  // Atributos
  const { Tran_Motivo, Tran_UsuarioOrigem_id, Tran_ProcuradorDestino_id, processos } = req.body;
  console.log(req.body);

  console.log(processos);

  try {
    // Atributos que não podem ser vazios
    if (!Tran_Motivo || !Tran_UsuarioOrigem_id || !processos || !Tran_ProcuradorDestino_id) {
      console.log(error);
      res.json({ error: "Não é possível realizar a transferência porque há dados faltantes" });
    } else {
      // Objeto para criar o Usuário
      const novaTransferencia = await prisma.transferencias.create({
        data: {
          Tran_Data: new Date(),
          Tran_UsuarioOrigem_id,
          Tran_ProcuradorDestino_id,
          Tran_Motivo,
          processos: {
            connect: processos.map((id) => ({ id })),
          },
        },
      });

      // Atualiza o procurador que vai ficar com o processo
      // const processo_para_procurador = await prisma.processos.update({
      //   where: {
      //     id: Tran_NumeroProcesso_id,
      //   },
      //   data: {
      //     Pcss_Procurador_id: Tran_ProcuradorDestino_id,
      //   },
      // });

      // Resposta
      res.status(200).json(novaTransferencia);
    }
  } catch (error) {
    // Mensagem de erro
    console.log(error);
    res.status(500).json({ error: "Erro ao criar o processo" });
  }
}

const getNotifications = async (req, res) => {
  const { id } = req.params;
  console.log("currentuser", id);
  const procurador = await prisma.procuradores.findFirst({
    where: {
      Pcrd_Usuario_id: parseInt(id),
    },
  });

  // console.log(procurador);

  try {
    const tranferOrder = await prisma.transferencias.findMany({
      where: {
        Tran_ProcuradorDestino_id: parseInt(procurador.id),
      },
      include: {
        processos: true,
        usuarioOrigem: true,
      },
    });

    res.status(200).json(tranferOrder);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as notificações" });
    console.log(error);
  }
};

const getProcessesInTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("idgetprocesses in transfer", id);
    const procurador = await prisma.procuradores.findFirst({
      where: {
        Pcrd_Usuario_id: parseInt(id),
      },
    });

    // console.log("procurador getprocessesintrnasfer", procurador);
    const processes = await prisma.transferencias.findMany({
      where: {
        Tran_UsuarioOrigem_id: parseInt(id),
      },
      include: {
        processos: {
          select: {
            id: true,
          },
        },
        // usuarioOrigem: true,
      },
    });

    res.status(200).json(processes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar os processos em transferência" });
  }
};

const acceptTransfer = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  try {
    const transfer = await prisma.transferencias.update({
      where: {
        id: parseInt(id),
      },
      data: {
        Tran_Status: "Aceito",
      },
      include: {
        processos: true,
      },
    });

    console.log(transfer);

    const processesUpdated = await prisma.processos.updateMany({
      where: {
        id: { in: transfer.processos.map((process) => process.id) },
      },
      data: { Pcss_Procurador_id: transfer.Tran_ProcuradorDestino_id },
    });
    res.status(200).json(transfer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao aceitar a transferência" });
  }
};

// Exportar funções
module.exports = {
  transferencia,
  getNotifications,
  getProcessesInTransfer,
  acceptTransfer,
};
