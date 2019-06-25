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

		if(process.env.IS_OFFLINE)
			return this.sendOfflineResponse(response);

		const statusCode = response.statusCode || 200;

		if(!statusCode || statusCode < 400)
			return response;

		throw new Error(JSON.stringify(response));
	}

	/**
	 * Sends an offline response.
	 *
	 * @param {Object} arg1 The response object
	 * @param {number} arg1.statusCode The status code
	 * @param {object} arg1.body The body
	 * @return {object} The standarized success response object
	 * @throws {Error} When response is not successful
	 */
	static sendOfflineResponse({ statusCode, body }) {

		if(!statusCode || statusCode < 400)
			return body;

		throw new Error(`[${statusCode}] ${body.message}`);
	}

}

module.exports = ApiResponse;
