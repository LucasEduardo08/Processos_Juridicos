// importando bibliotecas
const express = require('express');
const cors = require('cors');
const app = express();
const processRouter = require("./routes/processRouter");
const usersRouter = require("./routes/usersRouter");

// Usando Cors para permitir requisições de qualquer origem 
app.use(cors());

// Restando da configuração com o servidor
app.use(express.json());

// Usando as rotas
app.use('/api/', processRouter);
app.use('/api/', usersRouter);

// Inicia o servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});