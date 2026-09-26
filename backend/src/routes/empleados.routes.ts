import express from 'express';
import empleado from '../controllers/empleados.controllers.js';

const router=express.Router();

router.get('/empleados',empleado.getEmpleados); 
router.post('/empleados', empleado.addEmpleado); 
router.put('/empleados/:id', empleado.updateEmpleado); 
router.delete('/empleados/:id', empleado.deleteEmpleado); 

export default router;