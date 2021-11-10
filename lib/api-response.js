'use strict';

const { inspect } = require('util');
const logger = require('lllog')();

const ensureScalar = value => {

	if(typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
		return value;

	if(value === undefined || value === null)
		return '';

	if(Array.isArray(value))
		return value.toString();

	return inspect(value);
};

class ApiResponse {

	/**
	 * Sends a response for Api Gateway
	 *
	 * @param {object} response The response object. Properties: statusCode, body
	 * @return {object} The standarized success response object
	 * @throws {Error} When response is not successful
	 */
	static send(response) {

		const statusCode = response.statusCode || 200;

		const slsResponse = {
			...response,
			statusCode,
			statusCodeForPatternMatching: `[${statusCode}]`
		};

		this.setCookies(slsResponse);

		return this.handleResponse(slsResponse);
	}

	/**
	 * Sends an error response for Api Gateway
	 *
	 * @param {Error} error The response error. Properties: statusCode, headers, cookies, body, message, stack
	 * @throws {Error} Throws the error response
	 */
	static sendError(error) {

		logger.error(error);

		const statusCode = error.statusCode || 500;

		const slsResponse = {
			statusCode,
			statusCodeForPatternMatching: `[${statusCode}]`,
			...error.headers && { headers: error.headers },
			body: error.body || { message: error.message }
		};

		this.setCookies(slsResponse);

		return this.handleResponse(slsResponse);
	}

	static setCookies(response) {

		const cookieHeader = this.formatCookies(response);

		if(cookieHeader) {
			if(!response.headers)
				response.headers = {};

			response.headers['Set-Cookie'] = cookieHeader;
		}
	}

	/**
	 * Format cookies to a header value. It only formats the first cookie
	 *
	 * @param {Object} arg1 The response object
	 * @param {Object} arg1.cookies The cookies from the response object
	 * @return {string} The first cookie formatted as a header value
	 */
	static formatCookies({ cookies }) {

		if(!cookies)
			return;

		const firstCookie = Object.entries(cookies)[0];

		if(!firstCookie)
			return;

		const [cookieName, cookieValue] = firstCookie;

		if(typeof cookieValue === 'object') {

			const httpOnly = cookieValue.httpOnly ? '; HttpOnly' : '';
			const secure = cookieValue.secure ? '; Secure' : '';
			const path = cookieValue.path ? `; Path=${cookieValue.path}` : '';
			const expires = cookieValue.expires
				? (`; Expires=${cookieValue.expires.constructor.name === 'Date' ? cookieValue.expires.toUTCString() : cookieValue.expires}`)
				: '';
			const domain = cookieValue.domain ? `; Domain=${cookieValue.domain}` : '';

			return `${cookieName}=${cookieValue.value}${httpOnly}${secure}${path}${expires}${domain}`;
		}

		return `${cookieName}=${cookieValue}`;
	}

	static handleResponse(response) {

		if(response.statusCode < 400) {
			response.body = JSON.stringify(response.body);
			return response;
		}

		if(!response.body.messageVariables || typeof response.body.messageVariables !== 'object')
			throw new Error(JSON.stringify(response));

		const messageVariables = {};
		Object.entries(response.body.messageVariables).forEach(([key, value]) => {
			messageVariables[key] = ensureScalar(value);
		});

		throw new Error(JSON.stringify({
			...response,
			body: {
				...response.body,
				messageVariables: JSON.stringify(messageVariables)
			}
		}));
	}

}

module.exports = ApiResponse;
