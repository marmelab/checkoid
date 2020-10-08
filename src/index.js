const { validator, asyncValidator } = require("./Validator");
exports.array = require("./validators/array");
exports.boolean = require("./validators/boolean");
exports.number = require("./validators/number");
exports.object = require("./validators/object");
exports.string = require("./validators/string");

exports.validator = validator;
exports.asyncValidator = asyncValidator;
