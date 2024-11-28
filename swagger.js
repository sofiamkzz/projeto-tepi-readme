const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Projeto Viva Colors',
    description: 'Documentação gerada automaticamente',
  },
  host: 'localhost:3000',
  schemes: ['http'], // Alterar para 'https' em produção
};

const outputFile = './swagger-output.json'; // Arquivo gerado
const endpointsFiles = ['./app.js']; // Arquivo(s) onde as rotas estão definidas

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app.js'); // Inicia o servidor após a documentação ser gerada
});
