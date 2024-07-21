import Contact from '../models/contact';
import { Op } from 'sequelize';

type IdentifyRequest = {
  email?: string;
  phoneNumber?: string;
}

export const identifyContact = async ({ email, phoneNumber }: IdentifyRequest) => {
 // TODO: Implement the check for existing contact
};
