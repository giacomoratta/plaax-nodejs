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
exports.fromDbProjectItemsToProjectExpanded = exports.fromDbProjectToProjectItem = void 0;
// import { createLogger } from '../../logger'
// const log = createLogger('repo/plaaxItems/translateFromDb')
var PARSE = {
    IntWithFallback: function (originalValue, fallback) {
        if (originalValue == null)
            return fallback;
        var intValue = parseInt(originalValue);
        if (isNaN(intValue))
            return fallback;
        return intValue;
    },
    IntOrThrow: function (originalValue, errorInfo) {
        if (originalValue == null) {
            throw new TypeError("Value is not a number. (".concat(errorInfo, ")"));
        }
        var intValue = parseInt(originalValue);
        if (isNaN(intValue)) {
            throw new TypeError("Parsed value is not a number. (".concat(errorInfo, ")"));
        }
        return intValue;
    }
};
var IS = {
    DdbProject: function (item) {
        return item.projectId.N === item.itemId.N;
    },
    DdbList: function (item) {
        return item.projectId.N !== item.itemId.N && item.listId === undefined;
    },
    DdbActivity: function (item) {
        return item.projectId.N !== item.itemId && item.listId.N !== undefined && item.activityId === undefined;
    },
    DdbTask: function (item) {
        return item.projectId.N !== item.itemId && item.listId.N !== undefined && item.activityId !== undefined;
    }
};
var fromDbGenericItemToGenericItem = function (genericItem) {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        projectId: PARSE.IntOrThrow((_a = genericItem.projectId) === null || _a === void 0 ? void 0 : _a.N, 'projectId'),
        itemId: PARSE.IntOrThrow((_b = genericItem.itemId) === null || _b === void 0 ? void 0 : _b.N, 'itemId'),
        ownerUserId: PARSE.IntOrThrow((_c = genericItem.ownerUserId) === null || _c === void 0 ? void 0 : _c.N, 'ownerUserId'),
        assignedUserIds: ((_e = (_d = genericItem.assignedUserIds) === null || _d === void 0 ? void 0 : _d.NS) !== null && _e !== void 0 ? _e : []).map(function (value) { return PARSE.IntWithFallback(value, 0); }),
        title: genericItem.title.S,
        createTs: PARSE.IntWithFallback((_f = genericItem.createTs) === null || _f === void 0 ? void 0 : _f.N, 0),
        updateTs: PARSE.IntWithFallback((_g = genericItem.updateTs) === null || _g === void 0 ? void 0 : _g.N, 0),
        archivedTs: genericItem.archivedTs != null ? PARSE.IntWithFallback(genericItem.archivedTs.N, 0) : null
    };
};
var fromDbProjectToProjectExpanded = function (projectItem) {
    return __assign(__assign({}, fromDbGenericItemToGenericItem(projectItem)), { lists: [] });
};
var fromDbListToListExpanded = function (listItem) {
    return __assign(__assign({}, fromDbGenericItemToGenericItem(listItem)), { activities: [] });
};
var fromDbActivityToActivityExpanded = function (activityItem) {
    var _a;
    return __assign(__assign({}, fromDbGenericItemToGenericItem(activityItem)), { listId: PARSE.IntOrThrow((_a = activityItem.listId) === null || _a === void 0 ? void 0 : _a.N, 'listId'), tasks: [] });
};
var fromDbTaskToTaskItem = function (taskItem) {
    var _a, _b;
    return __assign(__assign({}, fromDbGenericItemToGenericItem(taskItem)), { listId: PARSE.IntOrThrow((_a = taskItem.listId) === null || _a === void 0 ? void 0 : _a.N, 'listId'), activityId: PARSE.IntOrThrow((_b = taskItem.activityId) === null || _b === void 0 ? void 0 : _b.N, 'activityId') });
};
var fromDbProjectToProjectItem = function (projectItem) {
    return fromDbGenericItemToGenericItem(projectItem);
};
exports.fromDbProjectToProjectItem = fromDbProjectToProjectItem;
var fromDbProjectItemsToProjectExpanded = function (resultItems) {
    var project;
    var projectLists = [];
    var activitiesByListId = {};
    var tasksByActivityId = {};
    resultItems.forEach(function (item) {
        if (IS.DdbProject(item)) {
            project = fromDbProjectToProjectExpanded(item);
        }
        else if (IS.DdbList(item)) {
            var list = fromDbListToListExpanded(item);
            projectLists.push(list);
        }
        else if (IS.DdbActivity(item)) {
            var activity = fromDbActivityToActivityExpanded(item);
            if (activitiesByListId[activity.listId] == null)
                activitiesByListId[activity.listId] = [];
            activitiesByListId[activity.listId].push(activity);
        }
        else if (IS.DdbTask(item)) {
            var task = fromDbTaskToTaskItem(item);
            if (tasksByActivityId[task.activityId] == null)
                tasksByActivityId[task.activityId] = [];
            tasksByActivityId[task.activityId].push(task);
        }
    });
    if (project != null) {
        project.lists = projectLists !== null && projectLists !== void 0 ? projectLists : [];
        project.lists.forEach(function (list) {
            var _a;
            list.activities = (_a = activitiesByListId[list.itemId]) !== null && _a !== void 0 ? _a : [];
            list.activities.forEach(function (activity) {
                var _a;
                activity.tasks = (_a = tasksByActivityId[activity.itemId]) !== null && _a !== void 0 ? _a : [];
            });
        });
        return project;
    }
};
exports.fromDbProjectItemsToProjectExpanded = fromDbProjectItemsToProjectExpanded;
//# sourceMappingURL=fromDbModels.js.map