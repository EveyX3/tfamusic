"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _framework = require("@sapphire/framework");
require("@sapphire/plugin-api/register");
require("@sapphire/plugin-hmr/register");
require("@sapphire/plugin-logger/register");
const _envutilities = require("@skyra/env-utilities");
const _path = require("path");
_framework.ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(_framework.RegisterBehavior.BulkOverwrite);
const rootDir = (0, _path.join)(__dirname, '..', '..');
(0, _envutilities.setup)({
    path: (0, _path.join)('.env')
});
