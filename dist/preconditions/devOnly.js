"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserPrecondition", {
    enumerable: true,
    get: ()=>UserPrecondition
});
const _framework = require("@sapphire/framework");
const _envutilities = require("@skyra/env-utilities");
function _check_private_redeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _class_apply_descriptor_get(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _class_extract_field_descriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _class_private_field_get(receiver, privateMap) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "get");
    return _class_apply_descriptor_get(receiver, descriptor);
}
function _class_private_field_init(obj, privateMap, value) {
    _check_private_redeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
const OWNERS = (0, _envutilities.envParseArray)('OWNERS');
var _message = /*#__PURE__*/ new WeakMap();
class UserPrecondition extends _framework.AllFlowsPrecondition {
    chatInputRun(interaction) {
        return this.doOwnerCheck(interaction.user.id);
    }
    contextMenuRun(interaction) {
        return this.doOwnerCheck(interaction.user.id);
    }
    messageRun(message) {
        return this.doOwnerCheck(message.author.id);
    }
    doOwnerCheck(userId) {
        return OWNERS.includes(userId) ? this.ok() : this.error({
            message: _class_private_field_get(this, _message)
        });
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _message, {
            writable: true,
            value: 'This command can only be used by the owner.'
        });
    }
}
