import { Schema, model } from 'mongoose'

const aireSchema = new Schema({
    "O3": {type: Number},
    "NO2": {type: Number},
    "CO": {type: Number},
    "latitud": {type: Number},
    "longitud": {type: Number},
    "fecha": {type: Date}
},{
    collection: 'portable'
})

export const Aires = model('aire', aireSchema)