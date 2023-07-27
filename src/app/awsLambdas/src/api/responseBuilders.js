"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericJsonServerError = exports.notFoundJsonServerError = exports.buildJsonResponse = void 0;
var httpStatusCode_1 = require("../../../../core/shared/httpStatusCode");
var fileMimeType_1 = require("../../../../core/shared/fileMimeType");
var buildJsonResponse = function (statusCode, responseData) {
    (0, httpStatusCode_1.assertHttpStatusCodeIsValid)(statusCode);
    return {
        statusCode: statusCode,
        body: JSON.stringify(responseData),
        headers: {
            'Content-Type': fileMimeType_1.FileMimeTypes['.json']
        },
        isBase64Encoded: false
    };
};
exports.buildJsonResponse = buildJsonResponse;
var notFoundJsonServerError = function (message) {
    return (0, exports.buildJsonResponse)(httpStatusCode_1.HttpStatusCode.NOT_FOUND, {
        message: message,
        payload: {}
    });
};
exports.notFoundJsonServerError = notFoundJsonServerError;
var genericJsonServerError = function (errorData) {
    return (0, exports.buildJsonResponse)(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR, {
        message: 'Internal server error.',
        payload: errorData
    });
};
exports.genericJsonServerError = genericJsonServerError;
//# sourceMappingURL=responseBuilders.js.map