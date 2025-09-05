// Sinh ngẫu nhiên 8 chữ số
module.exports = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};
