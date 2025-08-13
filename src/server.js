const { app } = require('./app');

const PORT = process.env.PORT || 3001;

// Pour Vercel, on exporte l'app directement
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  // En développement, on démarre le serveur normalement
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}
