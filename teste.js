const paypal = require('@paypal/checkout-server-sdk');
  
// Creating an environment
let clientId = process.env.paypalclient_id ;
let clientSecret = process.env.paypalclient_secret;
// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Construct a request object and set desired parameters
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
let request = new paypal.orders.OrdersCreateRequest();
request.requestBody({
                          "intent": "CAPTURE",
                          "purchase_units": [
                              {
                                  "amount": {
                                      "currency_code": "BRL",
                                      "value": "25.00"
                                  }
                              }
                           ]
                    });

// Call API with your client and get a response for your call
let createOrder  = async function(){
        let response = await client.execute(request);
      //  console.log(`Response: ${JSON.stringify(response)}`);
        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
       console.log(`Order: ${JSON.stringify(response.result)}`);
}
createOrder();