// importando bibliotecas
const express = require("express");
const cors = require("cors");
const app = express();
const processRouter = require("./routes/processRouter");
const usersRouter = require("./routes/usersRouter");
const transferRouter = require("./routes/transferRouter");
const licensesRouter = require("./routes/licensesRouter");
const procMovimentacoesRouter = require("./routes/procMovimentacoesRouter");
const calendarRouter = require("./routes/calendarRouter");
const documentRouter = require("./routes/documentRouter");
const { iniciarMonitoramento } = require("./services/alertService");
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");
const reportRouter = require("./routes/reportRouter");

// Usando Cors para permitir requisições de qualquer origem
app.use(cors());
app.use(cookieParser());

// Restando da configuração com o servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["*"], // Permitir apenas o frontend local
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // Permite que cookies e credenciais sejam compartilhados
};

app.options("*", cors());
app.use(cors(corsOptions));
// Usando as rotas
app.use("/api/", processRouter);
app.use("/api/", usersRouter);
app.use("/api/", transferRouter);
app.use("/api/", licensesRouter);
app.use("/api/", procMovimentacoesRouter);
app.use("/api/", calendarRouter);
app.use("/api/documents", documentRouter);
app.use("/api/", authRouter);
app.use("/api/", reportRouter);
const path = require("path");

// Servir arquivos estáticos da pasta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Inicia o servidor
const PORT = process.env.PORT || 3035;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  iniciarMonitoramento();
});
