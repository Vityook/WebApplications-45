class Cart {
    constructor(oldCart) {
        this.items = oldCart.items || {};  // Cart items will now be stored using imageSrc as the key
        this.totalQty = oldCart.totalQty || 0;
        this.totalPrice = oldCart.totalPrice || 0;
    }

    // Add item to the cart
    add(item, imageSrc) {
        let storedItem = this.items[imageSrc];

        if (!storedItem) {
            storedItem = this.items[imageSrc] = { item: item, qty: 0, price: 0 };
        }
        storedItem.qty++;
        storedItem.price = storedItem.qty * parseFloat(item.price.replace('$', ''));
        this.totalQty++;
        this.totalPrice += parseFloat(item.price.replace('$', ''));
    }

    // Reduce quantity of an item by 1
    reduceByOne(imageSrc) {
        this.items[imageSrc].qty--;
        this.items[imageSrc].price -= parseFloat(this.items[imageSrc].item.price.replace('$', ''));
        this.totalQty--;
        this.totalPrice -= parseFloat(this.items[imageSrc].item.price.replace('$', ''));
        if (this.items[imageSrc].qty <= 0) {
            delete this.items[imageSrc];
        }
    }

    // Remove item completely from cart
    removeItem(imageSrc) {
        this.totalQty -= this.items[imageSrc].qty;
        this.totalPrice -= this.items[imageSrc].price;
        delete this.items[imageSrc];
    }
}

module.exports = Cart;
