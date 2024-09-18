"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replacer = void 0;
const replacer = (i, arr, str) => {
    const len = arr.length;
    if (i < len) {
        const [key, value] = arr[i];
        const formattedKey = `{{${key}}}`;
        return (0, exports.replacer)(i + 1, arr, str.split(formattedKey).join(value));
    }
    else {
        return str;
    }
};
exports.replacer = replacer;
//# sourceMappingURL=utils.js.map