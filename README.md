# Serverless API Response

![Build Status](https://github.com/janis-commerce/sls-api-response/workflows/Build%20Status/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/sls-api-response/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/sls-api-response?branch=master)
[![npm version](https://badge.fury.io/js/%40janiscommerce%2Fsls-api-response.svg)](https://www.npmjs.com/package/@janiscommerce/sls-api-response)

A package to handle Serverless API Responses

## Installation

```
npm install @janiscommerce/sls-api-response
```

## Usage

```js
'use strict';

const { ApiResponse } = require('@janiscommerce/sls-api-response');

// Successful response (default statusCode is 200)
ApiResponse.send({
	body: {
		foo: 'bar'
	}
});

// Successful response with response headers
ApiResponse.send({
	body: {
		foo: 'bar'
	},
	headers: {
		'x-foo': 'bar'
	}
});

// Successful response with simple cookie
ApiResponse.send({
	body: {
		foo: 'bar'
	},
	cookies: {
		'my-cookie': 'bar'
	}
});

// Successful response with complex cookie
ApiResponse.send({
	body: {
		foo: 'bar'
	},
	cookies: {
		'my-cookie': {
			value: 'bar',
			httpOnly: true,
			secure: true,
			path: '/',
			expires: new Date(), // Or (new Date()).toUTCString()
			domain: '.example.com'
		}
	}
});

// Error response (default statusCode is 500)
ApiResponse.sendError(new Error('We have a problem'));
// Response body: { "message": "We have a problem" }

// Error response with custom status code
const error = new Error('You have a problem');
error.statusCode = 400;
ApiResponse.sendError(error);
// Response body: { "message": "You have a problem" }

// Error response with custom response body
const error = new Error('You have a problem');
error.body = { customErrorMessage: "Bad request body" }
ApiResponse.sendError(error);
// Response body: { "customErrorMessage": "Bad request body" }
```

## Configuration

In order to work properly, you have to set valid response templates in each function configuration. An example can be found [here](https://github.com/janis-commerce/sls-api-rest#function-minimal-configuration)
