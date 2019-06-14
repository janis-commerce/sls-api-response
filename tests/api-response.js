'use strict';

const assert = require('assert');

const { ApiResponse } = require('../');

/* eslint-disable prefer-arrow-callback */

describe('API Response', function() {

	describe('send', function() {

		it('Should return the original response object if no statusCode is specified', async function() {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			const response = ApiResponse.send(originalObject);

			assert.deepStrictEqual(response, originalObject);
		});

		it('Should return the original response object if statusCode is 200', async function() {

			const originalObject = {
				statusCode: 200,
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			const response = ApiResponse.send(originalObject);

			assert.deepStrictEqual(response, originalObject);
		});

		it('Should return the original response object if statusCode is 201', async function() {

			const originalObject = {
				statusCode: 200,
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			const response = ApiResponse.send(originalObject);

			assert.deepStrictEqual(response, originalObject);
		});

		it('Should throw an Error if statusCode is 4xx', async function() {

			const originalObject = {
				statusCode: 400,
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			assert.throws(() => ApiResponse.send(originalObject));
		});

		it('Should throw an Error if statusCode is 5xx', async function() {

			const originalObject = {
				statusCode: 500,
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			assert.throws(() => ApiResponse.send(originalObject));
		});

	});

});
