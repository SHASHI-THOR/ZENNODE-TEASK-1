const readlineSync = require('readline-sync');

class ShoppingCart {
    constructor() {
        this.products = { "Product A": 20, "Product B": 40, "Product C": 50 };
        this.cart = {};
        this.discountRules = {
            "flat_10_discount": (total) => total > 200 ? 10 : 0,
            "bulk_5_discount": (qty, price) => qty > 10 ? 0.05 * qty * price : 0,
            "bulk_10_discount": (totalQty, totalPrice) => totalQty > 20 ? 0.1 * totalPrice : 0,
            "tiered_50_discount": (totalQty, qty, price) => totalQty > 30 && qty > 15 ? 0.5 * qty * price : 0
        };
        this.giftWrapFee = 1;
        this.shippingFeePerPackage = 5;
        this.productsPerPackage = 10;
    }

    addToCart(product, quantity, isGiftWrapped) {
        this.cart[product] = { quantity, isGiftWrapped };
    }

    calculateDiscount() {
        const totalQty = Object.values(this.cart).reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = Object.entries(this.cart).reduce((acc, [product, item]) => acc + this.products[product] * item.quantity, 0);

        const discounts = {};
        for (const [rule, discountFunc] of Object.entries(this.discountRules)) {
            for (const [product, item] of Object.entries(this.cart)) {
                discounts[rule] = (discounts[rule] || 0) + discountFunc(totalQty, item.quantity, this.products[product]);
            }
        }

        const maxDiscountRule = Object.keys(discounts).reduce((a, b) => discounts[a] > discounts[b] ? a : b);
        return [maxDiscountRule, discounts[maxDiscountRule]];
    }

    calculateShippingFee() {
        const totalQty = Object.values(this.cart).reduce((acc, item) => acc + item.quantity, 0);
        return Math.floor(totalQty / this.productsPerPackage) * this.shippingFeePerPackage;
    }

    generateReceipt() {
        const subtotal = Object.entries(this.cart).reduce((acc, [product, item]) => acc + this.products[product] * item.quantity, 0);
        const [discountRule, discountAmount] = this.calculateDiscount();
        const shippingFee = this.calculateShippingFee();
        const total = subtotal - discountAmount + shippingFee + (Object.keys(this.cart).length * this.giftWrapFee);

        console.log("Receipt:");
        for (const [product, item] of Object.entries(this.cart)) {
            console.log(`${product}: ${item.quantity} units - $${this.products[product] * item.quantity}`);
        }
        console.log(`\nSubtotal: $${subtotal}`);
        console.log(`Discount applied (${discountRule}): -$${discountAmount}`);
        console.log(`Shipping Fee: +$${shippingFee}`);
        console.log(`Gift Wrap Fee: +$${Object.keys(this.cart).length * this.giftWrapFee}`);
        console.log(`\nTotal: $${total}`);
    }
}

const cart = new ShoppingCart();

const quantityA = parseInt(readlineSync.question("Enter quantity for Product A:"));
const giftWrapA = readlineSync.question("Is Product A gift-wrapped? (y/n):").toLowerCase() === 'y';
cart.addToCart("Product A", quantityA, giftWrapA);

const quantityB = parseInt(readlineSync.question("Enter quantity for Product B:"));
const giftWrapB = readlineSync.question("Is Product B gift-wrapped? (y/n):").toLowerCase() === 'y';
cart.addToCart("Product B", quantityB, giftWrapB);

const quantityC = parseInt(readlineSync.question("Enter quantity for Product C:"));
const giftWrapC = readlineSync.question("Is Product C gift-wrapped? (y/n):").toLowerCase() === 'y';
cart.addToCart("Product C", quantityC, giftWrapC);

cart.generateReceipt();
