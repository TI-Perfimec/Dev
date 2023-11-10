const express = require('express');
const path = require('path');
const ejs = require('ejs');
const msal = require('@azure/msal-node');
const dotenv = require('dotenv');
const session = require('express-session');
const clienteController = require('./controllers/clientesController');
const pedidosController = require('./controllers/pedidosController');

dotenv.config();
const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do MSAL
const msalConfig = {
    auth: {
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      authority: process.env.AZURE_AD_AUTHORITY,
      redirectUri: process.env.AZURE_AD_REDIRECT_URI,
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel, message) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Verbose,
      }
    }
  };  

const pca = new msal.PublicClientApplication(msalConfig);

// Middleware para fornecer informações de usuário às páginas
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
  });  

// Define a rota para a página principal
app.get('/', (req, res) => {
    res.render('mainLayout.ejs');
  });

// Rota de login
app.get('/login', (req, res) => {
    const authCodeUrlParameters = {
      scopes: ["openid", "profile"],
      redirectUri: process.env.AZURE_AD_REDIRECT_URI,
    };
  
    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
      res.redirect(response);
    }).catch((error) => {
      console.log(error);
      res.status(500).send('Erro ao redirecionar para a autenticação');
    });
  });
  
  // Rota de callback de autenticação
  app.get('/auth-callback', (req, res) => {
    const tokenRequest = {
      code: req.query.code,
      scopes: ["openid", "profile"],
      redirectUri: process.env.AZURE_AD_REDIRECT_URI,
    };
  
    pca.acquireTokenByCode(tokenRequest).then((response) => {
      // Use o token de acesso (response.accessToken) para autenticar o usuário
      res.redirect('/');
    }).catch((error) => {
      console.log(error);
      res.status(500).send('Erro ao obter token de acesso');
    });
  });
  

app.get('/relacao-clientes', async (req, res) => {
  try {
    const clientes = await clienteController.getClientes();
    res.render('clientes', { clientes });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao obter clientes');
  }
});

app.get('/relacao-pedidos-carteira', async (req, res) => {
    try {
      const pedidosEmCarteira = await pedidosController.getPedidosEmCarteira();
      res.render('pedidosEmCarteira', { pedidosEmCarteira });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).send('Erro ao obter pedidos em carteira');
    }
  });

app.get('/relacao-pedidos-carteira-pcp', async (req, res) => {
  try {
    const pedidosEmCarteiraPCP = await pedidosController.getPedidosEmCarteiraPCP();
    res.render('pedidosEmCarteiraPCP', { pedidosEmCarteiraPCP });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao obter pedidos em carteira PCP');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
