[
	{
		settingsId: "local",
		store_id: "ferdo65ba5cef51e9e",
		store_passwd: "ferdo65ba5cef51e9e@ssl",
		currency: "BDT",
		success_url: "http://localhost:3000/api/v1/payment-success",
		fail_url: "http://localhost:3000/api/v1/payment-fail",
		cancel_url: "http://localhost:3000/api/v1/payment-cancel",
		ipn_url: "http://localhost:3000/api/v1/payment-ipn",
		init_url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
	},
];

[
	{
		settingsId: "live",
		store_id: "ferdo65ba5cef51e9e",
		store_passwd: "ferdo65ba5cef51e9e@ssl",
		currency: "BDT",
		success_url: "liveURL/api/v1/payment-success",
		fail_url: "liveURL/api/v1/payment-fail",
		cancel_url: "liveURL/api/v1/payment-cancel",
		ipn_url: "liveURL/api/v1/payment-ipn",
		init_url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
	},
];
