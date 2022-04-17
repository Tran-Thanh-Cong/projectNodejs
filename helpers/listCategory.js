function filterData(datas, name) {
  const category = datas.filter((data) => {
    return data.category.name === name;
  });

  return category.map((data) => {
    return {
      _id: data._id,
      name: data.name,
      __v: data.__v,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  })
}

module.exports = {
  filterData: filterData
}