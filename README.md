
## HTML payment buttons

Integrating with our HTML payment buttons are as easy as including a snippet of code. We have two flavors of buttons for you to use:

### Buy Now
Buy Now buttons are for single item purchases.

```html
<script src="paypal-button.js?merchant=YOUR_MERCHANT_ID"
    data-button="buynow"
    data-name="Buy now!"
    data-amount="1.00"
></script>
```


### Add To Cart
Add To Cart buttons lets users add multiple items to their PayPal cart.

```html
<script src="paypal-button.js?merchant=YOUR_MERCHANT_ID"
    data-button="cart"
    data-name="Add to cart!"
    data-amount="1.00"
></script>
```

## Button variables
All of PayPal's [HTML button variables](https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_html_Appx_websitestandard_htmlvariables) are supported by prefixing their name with "data-". Here are the most commonly used:

* `data-name` Description of the item
* `data-number` The number of the item
* `data-quantity` Quantity of items to purchase
* `data-shipping` The cost of shipping this item
* `data-tax` Transaction-based tax override variable
* `data-id` The hosted ID of the button (if applicable)


## Merchant ID
Your merchant ID needs to be added to the URL of the referenced script. This ID can either be your Secure Merchant ID, which can be found by logging into your PayPal account and visiting your profile, or your email address.


## Authors
**Jeff Harrell**  
[https://github.com/jeffharrell](https://github.com/jeffharrell)
