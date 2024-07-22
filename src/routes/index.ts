import { Router } from 'express';
import { identify } from '../controllers/contact_controller';

const router = Router();

router.get('/', (req, res) => res.send({
  message: "Hey there I am Abhinav, Welcome to the Identity Reconciliation API",
  endpoints: ["/identify"],
  method: "POST"
}));

router.post('/identify', identify);

export default router;
