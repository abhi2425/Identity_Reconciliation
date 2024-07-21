import { Request, Response } from 'express';
import { identifyContact } from '../services/contact_service';

export const identify = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      console.log('Email or phone number is required');
      return res.status(400).json({ message: 'Email or phone number is required' });
    }

    const contact = await identifyContact({ email, phoneNumber });
    return res.status(200).json({ contact });

  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: errorMessage });
  }
};
