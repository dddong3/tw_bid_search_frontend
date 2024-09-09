export const formatSaleDate = (date) => {
  const options = { month: 'long', day: 'numeric' };
  const saleDate = new Date(date);
  const taiwanYear = saleDate.getFullYear() - 1911;
  const formattedDate = saleDate.toLocaleDateString('zh-TW', options);
  return `${taiwanYear}年${formattedDate}`;
};