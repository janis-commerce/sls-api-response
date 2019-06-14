# Serverless API Response

[![Build Status](https://travis-ci.org/janis-commerce/api-schema.svg?branch=master)](https://travis-ci.org/janis-commerce/api-schema)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/api-schema/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/api-schema?branch=master)

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