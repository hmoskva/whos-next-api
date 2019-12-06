const express = require("express");
const config = require("./config");

async function startServer() {
  const app = express();
  await require("./loaders")({ expressApp: app });

  app.listen(config.port, err => {
    if (err) {
      console.error("Error on app init", err);
      process.exit(1);
      return;
    }
    console.info(`
      ################################################
      🛡️  Knext server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
  });
}

startServer();
