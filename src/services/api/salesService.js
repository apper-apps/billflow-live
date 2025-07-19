import salesData from "@/services/mockData/sales.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getSalesInvoices = async () => {
  await delay(300);
  return [...salesData.invoices];
};

export const getSalesOrders = async () => {
  await delay(350);
  return [...salesData.orders];
};

export const getSalesQuotes = async () => {
  await delay(250);
  return [...salesData.quotes];
};

export const createSalesInvoice = async (invoice) => {
  await delay(500);
  const newInvoice = {
    ...invoice,
    Id: Math.max(...salesData.invoices.map(i => i.Id)) + 1,
    date: new Date().toISOString().split("T")[0],
    status: "draft"
  };
  salesData.invoices.push(newInvoice);
  return { ...newInvoice };
};

export const updateSalesInvoice = async (Id, updates) => {
  await delay(400);
  const index = salesData.invoices.findIndex(invoice => invoice.Id === Id);
  if (index === -1) throw new Error("Invoice not found");
  
  salesData.invoices[index] = { ...salesData.invoices[index], ...updates };
  return { ...salesData.invoices[index] };
};

export const deleteSalesInvoice = async (Id) => {
  await delay(300);
  const index = salesData.invoices.findIndex(invoice => invoice.Id === Id);
  if (index === -1) throw new Error("Invoice not found");
  
  salesData.invoices.splice(index, 1);
  return { success: true };
};