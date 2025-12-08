import express from 'express';
import { getAllUsersData, deleteUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', getAllUsersData);
router.delete('/users/:id', deleteUser);

export default router;
