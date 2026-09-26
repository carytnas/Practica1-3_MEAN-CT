module.exports = {
  apps: [{
    name: "empleados-api",
    script: "./src/index.ts",
    interpreter: "node",
    interpreter_args: "--import tsx",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 80,
      // Reemplaza este valor con tu connection string real de MongoDB Atlas
      MONGO_URI: "mongodb+srv://carytnas_db_user:<carytnas_db_user>@cluster0.jewjwuj.mongodb.net/?appName=Cluster0"
    },
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true
  }],

  deploy: {
    production: {
      user: "ubuntu",
      host: "3.131.155.90",
      ref: "origin/main",
      repo: "git@github.com:carytnas/Practica1-3_MEAN-CT.git",
      path: "/home/ubuntu",
      // El repo tiene /backend y /frontend en la raíz; PM2 deploy corre desde la raíz del repo
      "post-deploy": "cd backend && npm install && pm2 reload ecosystem.config.js --env production && pm2 save",
      ssh_options: "IdentityFile=~/.ssh/id_aws_nueva"
    }
  }
};
