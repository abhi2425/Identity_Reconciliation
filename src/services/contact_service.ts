import Contact from '../models/contact';
import { Op } from 'sequelize';

type IdentifyRequest = {
  email: string | null;
  phoneNumber: string | null;
};

export const identifyContact = async ({ email, phoneNumber }: IdentifyRequest) => {

  // Handle cases where both email and phoneNumber are null
  if (!email && !phoneNumber) {
    throw new Error('Either email or phoneNumber must be provided');
  }

  // Find all contacts that match the given email or phone number
  const contacts = await Contact.findAll({
    where: {
      [Op.or]: [{ email }, { phoneNumber }],
    },
  });

  // If no contacts found and both email and phoneNumber are provided, create a new primary contact
  if (contacts.length === 0 && email && phoneNumber) {
    const newContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: 'primary',
    });
    return {
      primaryContactId: newContact.id,
      emails: [email],
      phoneNumbers: [phoneNumber],
      secondaryContactIds: [],
    };
  }

  let primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary');
  const secondaryContacts = contacts.filter(contact => contact.linkPrecedence === 'secondary');

  if (!primaryContact) {
    primaryContact = contacts[0];
    await primaryContact.update({ linkPrecedence: 'primary' });
  }

  const emails = Array.from(new Set(contacts.map(contact => contact.email).filter(email => email)));
  const phoneNumbers = Array.from(new Set(contacts.map(contact => contact.phoneNumber).filter(phone => phone)));
  const secondaryContactIds = secondaryContacts.map(contact => contact.id);

  // Handle the case where one of them is in the database and create a secondary contact if needed
  if (email || phoneNumber) {
    // Check if the new information is already present
    const alreadyExists = contacts.some(contact => contact.email === email && contact.phoneNumber === phoneNumber);
    if (!alreadyExists) {
      const newSecondaryContact = await Contact.create({
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: 'secondary',
      });
      secondaryContactIds.push(newSecondaryContact.id);
      if (email && !emails.includes(email)) emails.push(email);
      if (phoneNumber && !phoneNumbers.includes(phoneNumber)) phoneNumbers.push(phoneNumber);
    }
  }

  // Handle the case where the primary contact needs to turn into a secondary contact
  const conflictingPrimary = contacts.find(contact =>
    contact.linkPrecedence === 'primary' &&
    contact.email !== primaryContact.email &&
    contact.phoneNumber !== primaryContact.phoneNumber
  );

  if (conflictingPrimary) {
    await conflictingPrimary.update({ linkPrecedence: 'secondary', linkedId: primaryContact.id });
    secondaryContactIds.push(conflictingPrimary.id);
    if (conflictingPrimary.email && !emails.includes(conflictingPrimary.email)) emails.push(conflictingPrimary.email);
    if (conflictingPrimary.phoneNumber && !phoneNumbers.includes(conflictingPrimary.phoneNumber)) phoneNumbers.push(conflictingPrimary.phoneNumber);
  }

  // Find all linked contacts recursively to include all related information
  const linkedContacts = await Contact.findAll({
    where: {
      [Op.or]: [
        { id: secondaryContactIds },
        { linkedId: primaryContact.id }
      ],
    },
  });

  linkedContacts.forEach(contact => {
    if (contact.email && !emails.includes(contact.email)) emails.push(contact.email);
    if (contact.phoneNumber && !phoneNumbers.includes(contact.phoneNumber)) phoneNumbers.push(contact.phoneNumber);
    if (!secondaryContactIds.includes(contact.id)) secondaryContactIds.push(contact.id);
  });

  return {
    primaryContactId: primaryContact.id,
    emails,
    phoneNumbers,
    secondaryContactIds,
  };
};