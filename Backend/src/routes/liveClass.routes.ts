import express from 'express';
import { 
    startLiveClass, 
    joinLiveClass,  
    endLiveClass
} from '../controllers/liveClass.controller';
import { authenticateUser, isInstructor, isStudent } from "../middlewares/auth.middlewares";

const router = express.Router();

router.post('/start', authenticateUser, isInstructor, startLiveClass);
router.post('/end', authenticateUser, isInstructor, endLiveClass);

router.post('/join', authenticateUser, isStudent, joinLiveClass);


export default router;