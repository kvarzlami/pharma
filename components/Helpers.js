module.exports = getQ = (med) => {
  let first = med.split('#');
  if (first.length > 1) {
    return first[1].split('//')[0];
  }
  return 1;
};
