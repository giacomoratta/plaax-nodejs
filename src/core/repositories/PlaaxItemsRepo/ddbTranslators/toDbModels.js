"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromProjectIdToSingleProjectSearchCriteria = void 0;
var fromProjectIdToSingleProjectSearchCriteria = function (projectId) {
    return {
        projectId: {
            N: projectId.toString()
        },
        itemId: {
            N: projectId.toString()
        }
    };
};
exports.fromProjectIdToSingleProjectSearchCriteria = fromProjectIdToSingleProjectSearchCriteria;
//# sourceMappingURL=toDbModels.js.map