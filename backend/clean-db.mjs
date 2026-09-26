import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1/usuarios_db';
await mongoose.connect(uri);
const col = mongoose.connection.db.collection('empleados');

const antes = await col.countDocuments();
const result = await col.deleteMany({ nombre: 'Andres Mendoza' });
const despues = await col.countDocuments();

console.log(`Antes: ${antes} registros`);
console.log(`Eliminados: ${result.deletedCount} duplicados del stress test`);
console.log(`Después: ${despues} registros`);

await mongoose.disconnect();
