import inventoryData from "@/services/mockData/inventory.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getInventoryItems = async () => {
  await delay(300);
  return [...inventoryData.items];
};

export const getWarehouses = async () => {
  await delay(250);
  return [...inventoryData.warehouses];
};

export const getStores = async () => {
  await delay(350);
  return [...inventoryData.stores];
};

export const createInventoryItem = async (item) => {
  await delay(500);
  const newItem = {
    ...item,
    Id: Math.max(...inventoryData.items.map(i => i.Id)) + 1,
    status: item.stock > item.reorderLevel ? "In Stock" : item.stock === 0 ? "Out of Stock" : "Low Stock"
  };
  inventoryData.items.push(newItem);
  return { ...newItem };
};

export const updateInventoryItem = async (Id, updates) => {
  await delay(400);
  const index = inventoryData.items.findIndex(item => item.Id === Id);
  if (index === -1) throw new Error("Item not found");
  
  inventoryData.items[index] = { ...inventoryData.items[index], ...updates };
  return { ...inventoryData.items[index] };
};

export const deleteInventoryItem = async (Id) => {
  await delay(300);
  const index = inventoryData.items.findIndex(item => item.Id === Id);
  if (index === -1) throw new Error("Item not found");
  
  inventoryData.items.splice(index, 1);
  return { success: true };
};