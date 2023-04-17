"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuricleClient", {
    enumerable: true,
    get: ()=>AuricleClient
});
const _framework = require("@sapphire/framework");
const _envutilities = require("@skyra/env-utilities");
const _discordplayer = require("discord-player");
const _discord = require("discord.js");
const _utils = /*#__PURE__*/ _interop_require_wildcard(require("./lib/utils"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
class AuricleClient extends _framework.SapphireClient {
    constructor(){
        super({
            disableMentionPrefix: true,
            intents: [
                _discord.GatewayIntentBits.Guilds,
                _discord.GatewayIntentBits.GuildVoiceStates
            ],
            defaultCooldown: {
                filteredUsers: (0, _envutilities.envParseArray)('OWNERS'),
                scope: _framework.BucketScope.User,
                delay: 10000,
                limit: 2
            },
            logger: {
                level: _framework.LogLevel.Info
            }
        });
        _define_property(this, "player", void 0);
        _define_property(this, "utils", void 0);
        this.utils = _utils;
        this.player = _discordplayer.Player.singleton(this);
    }
}
