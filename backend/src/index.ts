import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDatabase } from './config/database.js';
import empleadosRoutes from './routes/empleados.routes.js';
import { notFoundHandler, errorHandler } from './utils/errorHandler.js';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use('/api/v1', empleadosRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

await connectDatabase();
app.listen(port, () => {
  console.log('Servidor escuchando en el puerto ' + port);
});