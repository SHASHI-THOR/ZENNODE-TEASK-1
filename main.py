class ShoppingCart:
    def __init__(self):
        self.products = {"Product A": 20, "Product B": 40, "Product C": 50}
        self.cart = {}
        self.discount_rules = {
            "flat_10_discount": lambda total, _, __: 10 if total > 200 else 0,
            "bulk_5_discount": lambda qty, price, __: 0.05 * qty * price if qty > 10 else 0,
            "bulk_10_discount": lambda total_qty, total_price, ___: 0.1 * total_price if total_qty > 20 else 0,
            "tiered_50_discount": lambda total_qty, qty, price: 0.5 * qty * price if total_qty > 30 and qty > 15 else 0
        }
        self.gift_wrap_fee = 1
        self.shipping_fee_per_package = 5
        self.products_per_package = 10

    def add_to_cart(self, product, quantity, is_gift_wrapped):
        self.cart[product] = {"quantity": quantity, "is_gift_wrapped": is_gift_wrapped}

    def calculate_discount(self):
        total_qty = sum(item["quantity"] for item in self.cart.values())
        total_price = sum(self.products[product] * item["quantity"] for product, item in self.cart.items())

        discounts = {rule: discount_func(total_qty, item["quantity"], self.products[product])
                     for rule, discount_func in self.discount_rules.items()
                     for product, item in self.cart.items()}

        max_discount_rule = max(discounts, key=discounts.get)
        return max_discount_rule, discounts[max_discount_rule]

    def calculate_shipping_fee(self):
        total_qty = sum(item["quantity"] for item in self.cart.values())
        return (total_qty // self.products_per_package) * self.shipping_fee_per_package

    def generate_receipt(self):
        subtotal = sum(self.products[product] * item["quantity"] for product, item in self.cart.items())
        discount_rule, discount_amount = self.calculate_discount()
        shipping_fee = self.calculate_shipping_fee()
        total = subtotal - discount_amount + shipping_fee + (len(self.cart) * self.gift_wrap_fee)

        print("Receipt:")
        for product, item in self.cart.items():
            print(f"{product}: {item['quantity']} units - ${self.products[product] * item['quantity']}")
        print(f"\nSubtotal: ${subtotal}")
        print(f"Discount applied ({discount_rule}): -${discount_amount}")
        print(f"Shipping Fee: +${shipping_fee}")
        print(f"Gift Wrap Fee: +${len(self.cart) * self.gift_wrap_fee}")
        print(f"\nTotal: ${total}")


cart = ShoppingCart()

quantity_A = int(input("Enter quantity for Product A: "))
gift_wrap_A = input("Is Product A gift-wrapped? (y/n): ").lower() == 'y'
cart.add_to_cart("Product A", quantity_A, gift_wrap_A)

quantity_B = int(input("Enter quantity for Product B: "))
gift_wrap_B = input("Is Product B gift-wrapped? (y/n): ").lower() == 'y'
cart.add_to_cart("Product B", quantity_B, gift_wrap_B)

quantity_C = int(input("Enter quantity for Product C: "))
gift_wrap_C = input("Is Product C gift-wrapped? (y/n): ").lower() == 'y'
cart.add_to_cart("Product C", quantity_C, gift_wrap_C)

cart.generate_receipt()
