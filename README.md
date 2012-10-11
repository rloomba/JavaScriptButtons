



# HTML payment buttons

Integrating with our HTML payment buttons are as easy as including a snippet of code. We have two flavors of buttons for you to use:

## Buy Now
Buy Now buttons are for single item purchases.

```html
<script src="paypal.js"
    data-type="buy"
    data-business="MERCHANT_ID"
    data-item_name="Buy me now!"
    data-amount="1.00"
></script>
```


## Add To Cart
Add To Cart buttons lets users add multiple items to their PayPal cart.

```html
<script src="paypal.js"
    data-type="cart"
    data-business="MERCHANT_ID"
    data-item_name="Add to cart!"
    data-amount="1.00"
></script>
```
