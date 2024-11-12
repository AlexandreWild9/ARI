require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerConfig');
const UsuarioRoutes = require('./src/routes/usuarios');
const PrescricaoRoutes = require('./src/routes/prescricao');
const RemedioRoutes = require('./src/routes/remedio');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // Permite o envio de cookies nas requisições
}));

app.use(express.json());
app.use(cookieParser());

// Rota para a documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/usuarios', UsuarioRoutes);
app.use('/prescricao', PrescricaoRoutes);
app.use('/remedios', RemedioRoutes);

// Iniciar o servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
