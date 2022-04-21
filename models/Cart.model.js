module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id, qty) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {
        item: item,
        qty: 0,
        price: 0
      }
    }
    storedItem.qty = storedItem.qty + qty;
    storedItem.price = (storedItem.item.price - (storedItem.item.discount) / 100).toFixed() * storedItem.qty;
    let total = 0;
    for (let id in this.items) {
      total = total + id.qty;
    }
    this.totalQty = this.totalQty + total;
    let totalPri = 0;
    for (let id in this.items) {
      totalPri = totalPri + id.price;
    }
    this.totalPrice = this.totalPrice + totalPri;
  };
  this.generateArray = function() {
    const array = [];
    for (let id in this.items) {
      array.push(this.items[id]);
    }
    return array;
  }
};