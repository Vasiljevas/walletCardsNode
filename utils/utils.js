export const generateId = (items) => {
  const maxId = items.length > 0 ? Math.max(...items.map((i) => i.id)) : 0;
  return maxId + 1;
};
