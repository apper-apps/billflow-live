import contactsData from "@/services/mockData/contacts.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getContacts = async (type = "all") => {
  await delay(300);
  let contacts = [...contactsData.contacts];
  
  if (type === "customers") {
    contacts = contacts.filter(contact => contact.type === "customer");
  } else if (type === "suppliers") {
    contacts = contacts.filter(contact => contact.type === "supplier");
  }
  
  return contacts;
};

export const createContact = async (contact) => {
  await delay(500);
  const newContact = {
    ...contact,
    Id: Math.max(...contactsData.contacts.map(c => c.Id)) + 1,
    totalTransactions: 0,
    totalAmount: 0,
    status: "active"
  };
  contactsData.contacts.push(newContact);
  return { ...newContact };
};

export const updateContact = async (Id, updates) => {
  await delay(400);
  const index = contactsData.contacts.findIndex(contact => contact.Id === Id);
  if (index === -1) throw new Error("Contact not found");
  
  contactsData.contacts[index] = { ...contactsData.contacts[index], ...updates };
  return { ...contactsData.contacts[index] };
};

export const deleteContact = async (Id) => {
  await delay(300);
  const index = contactsData.contacts.findIndex(contact => contact.Id === Id);
  if (index === -1) throw new Error("Contact not found");
  
  contactsData.contacts.splice(index, 1);
  return { success: true };
};