"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserListener", {
    enumerable: true,
    get: ()=>UserListener
});
const _framework = require("@sapphire/framework");
const _utils = require("../../../lib/utils");
class UserListener extends _framework.Listener {
    run(payload) {
        (0, _utils.logSuccessCommand)(payload);
    }
    onLoad() {
        this.enabled = this.container.logger.level <= _framework.LogLevel.Debug;
        return super.onLoad();
    }
}
