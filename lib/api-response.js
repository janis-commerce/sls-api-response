'use strict';

class ApiResponse {

	/**
	 * Sends a response for Api Gateway
	 *
	 * @param {object} response The response object. Properties: statusCode, body
	 * @return {object} The standarized success response object
	 * @throws {Error} When response is not successful
	 */
	static send(response) {

		response.statusCode = response.statusCode || 200;

		response.statusCodeForPatternMatching = `[${response.statusCode}]`;

		const cookieHeader = this.formatCookies(response);
		if(cookieHeader) {
			if(!response.headers)
				response.headers = {};

			response.headers['Set-Cookie'] = cookieHeader;
		}

		if(!response.statusCode || response.statusCode < 400) {
			response.body = JSON.stringify(response.body);
			return response;
		}

		throw new Error(JSON.stringify(response));
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

}

module.exports = ApiResponse;
