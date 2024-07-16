import { updateDoctor, deleteDoctor, getAllDoctor, getSingleDoctor, getDoctorProfile } from "../controllers/doctorController.js";
import express from 'express'
import { authenticate, restrict } from "../auth/verifyToken.js";
import review from './review.js'
const router = express.Router();


//nested route
router.use('/:doctorId/reviews', review)
router.get('/:id', getSingleDoctor)
router.get('/', getAllDoctor)
router.put('/:id', authenticate, restrict(['doctor']), updateDoctor)
router.delete('/:id', authenticate, restrict(['doctor']), deleteDoctor)
router.get('/profile/me', authenticate, restrict(['doctor']), getDoctorProfile)
export default router;