"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aires = void 0;
const mongoose_1 = require("mongoose");
const aireSchema = new mongoose_1.Schema({
    "O3": { type: Number },
    "NO2": { type: Number },
    "CO": { type: Number },
    "latitud": { type: Number },
    "longitud": { type: Number },
    "fecha": { type: Date }
}, {
    collection: 'portable'
});
exports.Aires = mongoose_1.model('aire', aireSchema);
