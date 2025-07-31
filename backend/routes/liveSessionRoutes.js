import express from 'express'
import { getSessionForACourse, createSession, getAllSession, updateSession, deleteSession } from '../controllers/liveSessionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const liveSessionRouter = express.Router();

liveSessionRouter.get('/course/:courseId',authMiddleware, getSessionForACourse );

liveSessionRouter.post('/',authMiddleware, createSession );
liveSessionRouter.get('/',authMiddleware, getAllSession );
liveSessionRouter.put('/:id',authMiddleware, updateSession );
liveSessionRouter.delete('/:id',authMiddleware, deleteSession );

export default liveSessionRouter