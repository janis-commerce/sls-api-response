'use strict';

const assert = require('assert');

const { ApiResponse } = require('../');

/* eslint-disable prefer-arrow-callback */

describe('API Response', function() {

	describe('send: online mode', function() {

		it('Should return the original response object if no statusCode is specified', function() {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			const response = ApiResponse.send(originalObject);

			assert.deepStrictEqual(response, originalObject);
		});

		it('Should return the original response object if statusCode is 200', function() {

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

		it('Should return the original response object if statusCode is 201', function() {

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

		it('Should throw an Error if statusCode is 4xx', function() {

			const originalObject = {
				statusCode: 400,
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			assert.throws(() => ApiResponse.send(originalObject));
		});

		it('Should throw an Error if statusCode is 5xx', function() {

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

	describe('send: offline mode', function() {

		it('Should return the original response object if no statusCode is specified', function() {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			process.env.IS_OFFLINE = true;
			const response = ApiResponse.send(originalObject);
			delete process.env.IS_OFFLINE;

			assert.deepStrictEqual(response, originalObject.body);
		});

		it('Should return the original response object if statusCode is 200', function() {

			const originalObject = {
				statusCode: 200,
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			process.env.IS_OFFLINE = true;
			const response = ApiResponse.send(originalObject);
			delete process.env.IS_OFFLINE;

			assert.deepStrictEqual(response, originalObject.body);
		});

		it('Should return the original response object if statusCode is 201', function() {

			const originalObject = {
				statusCode: 200,
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			process.env.IS_OFFLINE = true;
			const response = ApiResponse.send(originalObject);
			delete process.env.IS_OFFLINE;

			assert.deepStrictEqual(response, originalObject.body);
		});

		it('Should throw an Error if statusCode is 4xx', function() {

			const originalObject = {
				statusCode: 400,
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			process.env.IS_OFFLINE = true;
			assert.throws(() => ApiResponse.send(originalObject));
			delete process.env.IS_OFFLINE;
		});

		it('Should throw an Error if statusCode is 5xx', function() {

			const originalObject = {
				statusCode: 500,
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			process.env.IS_OFFLINE = true;
			assert.throws(() => ApiResponse.send(originalObject));
			delete process.env.IS_OFFLINE;
		});

	});


});
