# Serverless API Response

[![Build Status](https://travis-ci.org/janis-commerce/sls-api-response.svg?branch=master)](https://travis-ci.org/janis-commerce/sls-api-response)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/sls-api-response/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/sls-api-response?branch=master)

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

// Error response
ApiResponse.send({
	statusCode: 400,
	body: {
		message: 'Something is bad',
		messageVariables: {
			foo: 'bar'
		}
	}
});
```

## Configuration

In order to work properly, you have to set valid response templates in each function configuration. An example can be found [here](https://github.com/janis-commerce/sls-api-rest#function-minimal-configuration)
