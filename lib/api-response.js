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

		const slsResponse = { ...response };

		slsResponse.statusCode = slsResponse.statusCode || 200;

		slsResponse.statusCodeForPatternMatching = `[${slsResponse.statusCode}]`;

		const cookieHeader = this.formatCookies(slsResponse);
		if(cookieHeader) {
			if(!slsResponse.headers)
				slsResponse.headers = {};

			slsResponse.headers['Set-Cookie'] = cookieHeader;
		}

		if(slsResponse.statusCode < 400) {
			slsResponse.body = JSON.stringify(slsResponse.body);
			return slsResponse;
		}

		throw new Error(JSON.stringify(slsResponse));
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
