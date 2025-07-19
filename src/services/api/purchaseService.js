import purchaseData from "@/services/mockData/purchases.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getPurchaseOrders = async () => {
  await delay(300);
  return [...purchaseData.orders];
};

export const getPurchaseInvoices = async () => {
  await delay(350);
  return [...purchaseData.invoices];
};

export const getVendors = async () => {
  await delay(250);
  return [...purchaseData.vendors];
};

export const createPurchaseOrder = async (order) => {
  await delay(500);
  const newOrder = {
    ...order,
    Id: Math.max(...purchaseData.orders.map(o => o.Id)) + 1,
    date: new Date().toISOString().split("T")[0],
    status: "pending"
  };
  purchaseData.orders.push(newOrder);
  return { ...newOrder };
};

export const updatePurchaseOrder = async (Id, updates) => {
  await delay(400);
  const index = purchaseData.orders.findIndex(order => order.Id === Id);
  if (index === -1) throw new Error("Order not found");
  
  purchaseData.orders[index] = { ...purchaseData.orders[index], ...updates };
  return { ...purchaseData.orders[index] };
};

export const deletePurchaseOrder = async (Id) => {
  await delay(300);
  const index = purchaseData.orders.findIndex(order => order.Id === Id);
  if (index === -1) throw new Error("Order not found");
  
  purchaseData.orders.splice(index, 1);
  return { success: true };
};