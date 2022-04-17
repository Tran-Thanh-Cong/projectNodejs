const filterCategory = (datas, name) => {
  return datas.filter((data) => {
    return data.detailCategory.category.name == name
  })
};

module.exports = {
  filterCategory: filterCategory
}