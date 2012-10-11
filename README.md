



# HTML payment buttons

Integrating with our HTML payment buttons are as easy as including a snippet of code. We have two flavors of buttons for you to use:

## Buy Now
Buy Now buttons are for single item purchases.

```html
<script src="paypal.js"
    data-paypal-checkout="buy-now"
    data-paypal-button="true"
    data-paypal-business="12345abc"
    data-paypal-item-name="Buy me now!"
    data-paypal-amount="1.00"
></script>
```

Go ahead and try it out



## Add To Cart
Add To Cart buttons lets users add multiple items to their PayPal cart.

```html
<script src="paypal.js"
    data-paypal-checkout="cart"
    data-paypal-button="true"
    data-paypal-business="12345abc"
    data-paypal-item-name="Add me to cart"
    data-paypal-amount="1.00"
></script>
```

Prepare to be amazed with this one



# API payment buttons

```html
<script src="paypal.js"
    data-paypal-checkout="api"
    data-paypal-button="true"
></script>
```
