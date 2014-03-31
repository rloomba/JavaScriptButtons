## PayPal Payment Buttons [![Build Status](https://travis-ci.org/paypal/JavaScriptButtons.png?branch=master)](https://travis-ci.org/paypal/JavaScriptButtons)

PayPal HTML payment buttons that are as easy as including a snippet of code. [Try it out and configure your own](http://paypal.github.com/JavaScriptButtons/).

We have a few flavors of buttons for you to use:

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
Add To Cart buttons let users add multiple items to their PayPal cart.

```html
<script src="paypal-button-minicart.min.js?merchant=YOUR_MERCHANT_ID"
    data-button="cart"
    data-name="Product in your cart"
    data-amount="1.00"
></script>
```

### QR Codes
QR codes can be easily scanned with a smart phone to check out.

```html
<script src="paypal-button.min.js?merchant=YOUR_MERCHANT_ID"
    data-button="qr"
    data-name="Product via QR code"
    data-amount="1.00"
></script>
```

### Donations
Donation buttons let you accept donations from your users.

```html
<script src="paypal-button.min.js?merchant=YOUR_MERCHANT_ID"
    data-button="donate"
    data-name="My donation"
    data-amount="1.00"
></script>
```

### Subscriptions
Subscribe buttons let you set up payment subscriptions.

```html
<script src="paypal-button.min.js?merchant=YOUR_MERCHANT_ID"
    data-button="subscribe"
    data-name="My product"
    data-amount="1.00"
    data-recurrence="1"
    data-period="M"
></script>
```


## Button variables
All of PayPal's [HTML button variables](https://developer.paypal.com/webapps/developer/docs/classic/paypal-payments-standard/integration-guide/Appx_websitestandard_htmlvariables/) are supported by prefixing their name with "data-". Here are the most commonly used:

* `data-name` Description of the item.
* `data-number` The number of the item.
* `data-amount` The price of the item.
* `data-currency` The currency of the item (note: these cannot be mixed).
* `data-quantity` Quantity of items to purchase.
* `data-shipping` The cost of shipping this item.
* `data-tax` Transaction-based tax override variable.
* `data-size` For button images: `small` and `large` work. For QR codes enter the pixel length of the longest side.
* `data-locale` The desired locale of the PayPal site.
* `data-callback` The IPN notify URL to be called on completion of the transaction.
* `data-env` The PayPal environment to checkout in, e.g. `sandbox` (defaults to 'www')


## Editable fields
Creating editable fields is easy! Just add `-editable` to the name of your variable, e.g. `data-quantity-editable`, and an input field will magically appear for your users.

## Hosted Button Support
Button stored on PayPal will have hosted button id. Add `data-hosted_button_id` variable. e.g. 

	data-hosted_button_id='<HOSTED_BUTTON_ID>'

## Optional fields
Creating custom dropdown field is by adding `-options-N` where N is a digit between 0 and 4

	data-<OPTION_NAME>-options-N='<JSON_DATA>'

**Usage:**

	data-colors-options-0='<DROP_DOWN_JSON_DATA>'
	data-sizes-options-1='<DROP_DOWN_JSON_DATA>'
	data-coupon-options2='<TEXT_FIELD_JSON_DATA>'

**Note:** JSON should be wrapped with Single quote

**Sample JSON Data for dropdown field**

	DROPDOWN_JSON_DATA
        { "label" : "<DROP_DOWN_LABEL>",  "value": [ {"<DROP_DOWN_VALUE>": "<DROP_DOWN_DISPLAY_TEXT>"}, ............. ]} 
	Ex: { "label" : "Colors",             "value": [ {"Red": "Red $10.00"} {"Blue" : "$8.00"}, {"Green","$12.00"} ]}
    or
        { "label" : "<DROPDOWN_LABEL>", "value": [ "<DROPDOWN_DISPLAY_TEXT_1>", "<DROPDOWN_DISPLAY_TEXT_2>",  ............. ]}
	Ex: { "label" : "Sizes",            "value": [ "Small", "Medium", "Large" }


**Sample JSON Data for input field**

	TEXT_FIELD_JSON_DATA
	    { "label" : "<TEXT_FIELD_LABEL>", "value": "<TEXT_FIELD_VALUE>" }
	Ex: { "label" : "Coupon Number",      "value": ""}

## Callback notification
On completion of a transaction you can get a payment notification ([IPN](https://www.x.com/developers/paypal/documentation-tools/ipn/integration-guide/IPNIntro)) on a callback URL you specify using the `data-callback` attribute. An [IPN simulator](https://developer.paypal.com/webapps/developer/applications/ipn_simulator) is available on the sandbox.

## Localization
* Changing the default language of a button can be done by setting the variable `data-lc` with the correct locale code, e.g. es_ES.
* Changing the default input labels of editable buttons can be done by overriding the default configuration, e.g. PAYPAL.apps.ButtonFactory.config.labels.


## JavaScript API
There's even a fancy JavaScript API if you'd like to pragmatically create your buttons.

**PAYPAL.apps.ButtonFactory.config**  
This can be overridden to change the default behavior of the buttons.

**PAYPAL.apps.ButtonFactory.create(business, data, type, parentNode)**  
Creates and returns an HTML element that contains the button code. 
> **business** - A string containing either the business ID or the business email  
> **data** - A JavaScript object containing the button variables  
> **type** - The button type, e.g. "buynow", "cart", "qr"  
> **parentNode** - An HTML element to add the newly created button to (Optional)  


## Download
To download the production-ready JavaScript you'll need to save one of these files:

* [JavaScript Buttons](http://www.paypalobjects.com/js/external/paypal-button.min.js)
* [JavaScript Buttons + MiniCart](http://www.paypalobjects.com/js/external/paypal-button-minicart.min.js)

The first file gives you support for PayPal's JavaScript buttons. The second file has the same code from the first, but also contains functionality for the [PayPal Mini Cart](https://github.com/jeffharrell/MiniCart).

To see the un-minified code you can take a peek at [paypal-button.js](https://github.com/paypal/JavaScriptButtons/blob/master/src/paypal-button.js).


## Browser support 
The JavaScript buttons have been tested and work in all modern browsers including:

* Chrome
* Safari
* Firefox
* Internet Explorer 7+.


## Getting your Merchant ID
Your merchant ID needs to be added to the URL of the referenced script. This ID can either be your Secure Merchant ID, which can be found by logging into your PayPal account and visiting your profile, or your email address.


## Contributing 

We love contributions! If you'd like to contribute please submit a pull request via Github. 

[Mocha](https://github.com/visionmedia/mocha) is used to run our test cases. Please be sure to run these prior to your pull request and ensure nothing is broken.


## Authors
**Jeff Harrell**  
[https://github.com/jeffharrell](https://github.com/jeffharrell)

**Mark Stuart**  
[https://github.com/mstuart](https://github.com/mstuart)
