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

// Error response
ApiResponse.send({
	statusCode: 400,
	body: {
		message: 'Something is bad',
		detail: {
			what: 'your request'
		}
	}
});
```