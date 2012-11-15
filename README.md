## HTML payment buttons

Integrating with our HTML payment buttons are as easy as including a snippet of code. We have two flavors of buttons for you to use:

### Buy Now
Buy Now buttons are for single item purchases.

```html
<script src="paypal-button.min.js?merchant=YOUR_MERCHANT_ID"
    data-button="buynow"
    data-name="My product"
    data-amount="1.00"
></script>
```


### Add To Cart
Add To Cart buttons lets users add multiple items to their PayPal cart.

```html
<script src="paypal-button-minicart.min.js?merchant=YOUR_MERCHANT_ID"
    data-button="cart"
    data-name="Product in your cart"
    data-amount="1.00"
></script>
```

### QR Codes
QR codes which can be scanned with a smart phone can also be easily generated.

```html
<script src="paypal-button.min.js?merchant=YOUR_MERCHANT_ID"
    data-button="qr"
    data-name="Product via QR code"
    data-amount="1.00"
></script>
```


## Button variables
All of PayPal's [HTML button variables](https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_html_Appx_websitestandard_htmlvariables) are supported by prefixing their name with "data-". Here are the most commonly used:

* `data-name` Description of the item
* `data-number` The number of the item
* `data-amount` The price of the item
* `data-quantity` Quantity of items to purchase
* `data-shipping` The cost of shipping this item
* `data-tax` Transaction-based tax override variable
* `data-id` The hosted ID of the button (if applicable)


## Getting your Merchant ID
Your merchant ID needs to be added to the URL of the referenced script. This ID can either be your Secure Merchant ID, which can be found by logging into your PayPal account and visiting your profile, or your email address.


## Download the code
For the unminified files you can clone this repo and use the code in src/paypal-button.js.


## Browser support 
The JavaScript buttons have been tested and work in all modern browsers including:

* Chrome
* Safari
* Firefox
* Internet Explorer 7+.


## Contributing
We love contributions! If you'd like to contribute please submit a pull request via Github. 

[Mocha](https://github.com/visionmedia/mocha) is used to run our test cases. Please be sure to run these prior to your pull request and ensure nothing is broken.

## Authors
**Jeff Harrell**  
[https://github.com/jeffharrell](https://github.com/jeffharrell)
