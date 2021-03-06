'use strict';


module.exports = {

	BN_CODE: 'JavaScriptButtons_{label}',

	PAYPAL_URL: 'http://{host}/issue_bill',

	QR_URL: 'https://{host}/webapps/ppint/qrcode?data={url}&pattern={pattern}&height={size}',

	QR_PATTERN: 13,

	QR_SIZE: 250,

	PRETTY_PARAMS: {
		name: 'item_name',
		number: 'item_number',
		locale: 'lc',
		currency: 'currency_code',
		recurrence: 'p3',
		period: 't3',
		callback: 'notify_url',
		button_id: 'hosted_button_id'
	},

	WIDGET_NAME: 'cause-button-widget',

	DEFAULT_HOST: 'consumer.dogpound.local:3000',

	DEFAULT_TYPE: 'button',

	DEFAULT_LABEL: 'buynow',

	DEFAULT_SIZE: 'large',

	DEFAULT_STYLE: 'primary',

	DEFAULT_LOCALE: 'en_US',

	DEFAULT_ENV: 'www',

	TEMPLATES: '$TEMPLATES$',

	STRINGS: '$STRINGS$',

	STYLES: '$STYLES$',

	LOGO: '$CAUSE_LOGO$',

	WORDMARK: {
		primary: '$WORDMARK_PRIMARY$',
		secondary: '$WORDMARK_SECONDARY$'
	}

};
