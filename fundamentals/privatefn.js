const B = () => {
  return 'B';
};

const A = () => {
  const ret = B();
  return `${ret}A`;
};

module.exports = {
  A
};
