"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidUserId = void 0;
// const DATE_YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/
var NUMBER_REGEX = /^\d+$/;
var isNumericString = function (data) {
    return NUMBER_REGEX.test(data);
};
var assertValidUserId = function (userId) {
    if (!isNumericString(userId)) {
        throw new TypeError("Invalid userId ('".concat(userId, "'). Expected numbers only."));
    }
    return parseInt(userId);
};
exports.assertValidUserId = assertValidUserId;
//# sourceMappingURL=apiValidators.js.map