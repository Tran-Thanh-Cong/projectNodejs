function filterProductsCategory(datas, name) {
  return datas.filter((data) => {
    return data.detailCategory.category.name === name;
  });
}

function filterProductsDetailCategory(datas, name) {
  return datas.filter((data) => {
    return data.detailCategory.name = name;
  });
}

module.exports = {
  filterProductsCategory: filterProductsCategory,
  filterProductsDetailCategory: filterProductsDetailCategory
};