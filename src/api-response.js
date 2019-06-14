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
		const statusCode = response.statusCode || 200;

		if(statusCode >= 400)
			throw new Error(JSON.stringify(response));

		return response;
	}

}

module.exports = ApiResponse;
