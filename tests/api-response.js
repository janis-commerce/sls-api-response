'use strict';

const assert = require('assert');

const { ApiResponse } = require('../lib');

describe('API Response', () => {

	describe('send', () => {

		it('Should set statusCode 200 if no statusCode is specified', () => {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			const { statusCode, statusCodeForPatternMatching } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(statusCode, 200);
			assert.deepStrictEqual(statusCodeForPatternMatching, '[200]');
		});

		it('Should JSON stringify the body if statusCode is not defined', () => {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			const { body } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(body, JSON.stringify(originalObject.body));
		});

		it('Should JSON stringify the body if statusCode is successfull', () => {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				},
				statusCode: 200
			};

			const { body } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(body, JSON.stringify(originalObject.body));
		});

		it('Should set statusCodeForPatternMatching properly if statusCode is set', () => {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				},
				statusCode: 201
			};

			const { statusCodeForPatternMatching } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(statusCodeForPatternMatching, '[201]');
		});

		it('Should throw an Error if statusCode is 4xx', () => {

			const originalObject = {
				statusCode: 400,
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			assert.throws(() => ApiResponse.send(originalObject));
		});

		it('Should throw an Error if statusCode is 5xx', () => {

			const originalObject = {
				statusCode: 500,
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				}
			};

			assert.throws(() => ApiResponse.send(originalObject));
		});

		it('Should parse the messageVariables when present to ensure that only scalar values are sent', () => {

			const originalObject = {
				statusCode: 500,
				body: {
					message: 'common.error.someMessage',
					messageVariables: {
						string: 'string',
						number: 100,
						boolean1: true,
						boolean2: false,
						array: ['foo', 100, {}],
						object: {
							foo: 'bar',
							baz: 100
						},
						null: null,
						undefined
					}
				}
			};

			const expectedError = {
				...originalObject,
				statusCodeForPatternMatching: '[500]',
				body: {
					message: 'common.error.someMessage',
					messageVariables: JSON.stringify({
						string: 'string',
						number: 100,
						boolean1: true,
						boolean2: false,
						array: 'foo,100,[object Object]',
						object: '{ foo: \'bar\', baz: 100 }',
						null: '',
						undefined: ''
					})
				}
			};

			assert.throws(() => ApiResponse.send({ ...originalObject }), err => {
				assert.deepStrictEqual(JSON.parse(err.message), expectedError);
				return true;
			});
		});

		it('Should pass the response headers', () => {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				},
				headers: {
					'x-foo': 'bar'
				}
			};

			const { headers } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(headers, {
				'x-foo': 'bar'
			});
		});

		it('Should ignore cookies if it\'s an empty object', () => {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				},
				cookies: {}
			};

			const { headers } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(headers, undefined);
		});

		it('Should set a simple cookie if it\'s defined', () => {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				},
				cookies: {
					foo: 'bar'
				}
			};

			const { headers } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(headers, {
				'Set-Cookie': 'foo=bar'
			});
		});

		it('Should set a simple cookie if it\'s defined, mantaining other response headers', () => {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				},
				headers: {
					'x-foo': 'x-bar'
				},
				cookies: {
					foo: 'bar'
				}
			};

			const { headers } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(headers, {
				'x-foo': 'x-bar',
				'Set-Cookie': 'foo=bar'
			});
		});

		it('Should set a complex cookie if it\'s defined only with it\'s value', () => {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				},
				cookies: {
					foo: {
						value: 'bar'
					}
				}
			};

			const { headers } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(headers, {
				'Set-Cookie': 'foo=bar'
			});
		});

		it('Should set a complex cookie if it\'s defined', () => {

			const expireDate = new Date().toUTCString();

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				},
				cookies: {
					foo: {
						value: 'bar',
						httpOnly: true,
						secure: true,
						path: '/',
						expires: expireDate,
						domain: '.example.com'
					}
				}
			};

			const { headers } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(headers, {
				'Set-Cookie': `foo=bar; HttpOnly; Secure; Path=/; Expires=${expireDate}; Domain=.example.com`
			});
		});

		it('Should set only the first cookie if more than one are defined', () => {

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				},
				cookies: {
					foo: 'bar',
					baz: 'yeah'
				}
			};

			const { headers } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(headers, {
				'Set-Cookie': 'foo=bar'
			});
		});

		it('Should handle an Date object as expire date', () => {

			const expireDate = new Date();

			const originalObject = {
				body: {
					foo: 'bar',
					baz: [1, 2, 3]
				},
				cookies: {
					foo: {
						value: 'bar',
						expires: expireDate
					}
				}
			};

			const { headers } = ApiResponse.send({ ...originalObject });

			assert.deepStrictEqual(headers, {
				'Set-Cookie': `foo=bar; Expires=${expireDate.toUTCString()}`
			});
		});
	});

	describe('sendError', () => {

		it('Should set statusCode 500 if no error.statusCode is specified', () => {

			const originalError = new Error('Generic error');

			assert.throws(() => ApiResponse.sendError(originalError), e => {
				const response = JSON.parse(e.message);
				return response.statusCode === 500;
			});
		});

		it('Should set custom statusCode if error.statusCode is specified', () => {

			const originalError = new Error('Generic error');
			originalError.statusCode = 400;

			assert.throws(() => ApiResponse.sendError(originalError), e => {
				const response = JSON.parse(e.message);
				return response.statusCode === 400;
			});
		});

		it('Should use the error message as body for default', () => {

			const originalError = new Error('Generic error');

			assert.throws(() => ApiResponse.sendError(originalError), e => {
				const response = JSON.parse(e.message);
				return response.body.message === 'Generic error';
			});
		});

		it('Should set custom body if error.body is specified', () => {

			const originalError = new Error('Generic error');
			originalError.body = {
				custom: true
			};

			assert.throws(() => ApiResponse.sendError(originalError), e => {
				const response = JSON.parse(e.message);
				assert.deepStrictEqual(response.body, {
					custom: true
				});

				return true;
			});
		});

		it('Should set response headers if error.headers is specified', () => {

			const originalError = new Error('Generic error');
			originalError.headers = {
				'x-custom': 'foo'
			};

			assert.throws(() => ApiResponse.sendError(originalError), e => {
				const response = JSON.parse(e.message);
				assert.deepStrictEqual(response.headers, {
					'x-custom': 'foo'
				});

				return true;
			});
		});
	});

});
