"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    filterPosts: ()=>filterPosts,
    default: ()=>_default
});
const _e621 = /*#__PURE__*/ _interop_require_default(require("e621"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const E621 = new _e621.default({
    authUser: process.env.e621User,
    authKey: process.env.e621APIKey,
    userAgent: process.env.userAgent
});
const filterPosts = (posts, noVideo, noFlash)=>posts.filter((p)=>!Object.values(p.tags).reduce((a, b)=>a.concat(b)).some((t)=>[
                "cub",
                "young"
            ].includes(t)) || noVideo && p.file.ext === "webm" || noFlash && p.file.ext === "swf");
const _default = E621;
