"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
var createLoggerTests = function ( /* moduleName */) {
    return {
        debug: function () { return undefined; },
        info: function () { return undefined; },
        warn: function () { return undefined; },
        error: function () { return undefined; }
    };
};
var createLogger = function (moduleName) {
    return {
        debug: function (params, message) {
            // eslint-disable-next-line no-console
            console.log(__assign({ module: moduleName }, (typeof params !== 'string' ? params : {})), (typeof params !== 'string' ? message : params));
        },
        info: function (params, message) {
            // eslint-disable-next-line no-console
            console.info(__assign({ module: moduleName }, (typeof params !== 'string' ? params : {})), (typeof params !== 'string' ? message : params));
        },
        warn: function (params, message) {
            // eslint-disable-next-line no-console
            console.warn(__assign({ module: moduleName }, (typeof params !== 'string' ? params : {})), (typeof params !== 'string' ? message : params));
        },
        error: function (params, message) {
            // eslint-disable-next-line no-console
            console.error(__assign({ module: moduleName }, (typeof params !== 'string' ? params : {})), (typeof params !== 'string' ? message : params));
        }
    };
};
exports.createLogger = createLogger;
if (process.env.NODE_ENV === 'test') {
    exports.createLogger = createLogger = createLoggerTests;
}
//# sourceMappingURL=index.js.map