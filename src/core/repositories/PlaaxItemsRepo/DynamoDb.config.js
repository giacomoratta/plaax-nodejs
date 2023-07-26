"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDbTables = exports.DynamoDBClientConfiguration = void 0;
var RESOURCE_PREFIX = (_a = process.env.RESOURCE_PREFIX) !== null && _a !== void 0 ? _a : 'unknown';
exports.DynamoDBClientConfiguration = { region: 'eu-west-1' };
exports.DynamoDbTables = {
    ITEMS: RESOURCE_PREFIX + '-items',
    USER_PROJECTS: RESOURCE_PREFIX + '-user-project'
};
//# sourceMappingURL=DynamoDb.config.js.map