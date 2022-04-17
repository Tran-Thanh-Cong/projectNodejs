const listProducts = (datas, name) => {
  return datas.filter((data) => {
    return data.detailCategory.name === name;
  });
};

module.exports = {
  listProducts: listProducts
}