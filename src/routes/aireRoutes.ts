import { Request, Response, Router } from 'express'
import { Aires } from '../model/aire'
import { db } from '../database/database'

class AireRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getAires = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Aires.find()
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getFecha = async (req:Request, res: Response) => {
        const { ano, mes, dia } = req.params
        console.log( ano, mes, dia )
        await db.conectarBD()
        .then( async ()=> {
            const query = await Aires.aggregate([
                {
                    $match:{}
                },
                {
                    $addFields: {
                        "ano": {$toString: {$year: "$fecha"}},
                        "mes": {$toString: {$month: "$fecha"}},
                        "dia": {$toString: {$dayOfMonth: "$fecha"}}
                    }
                },
                {
                    $match: {
                        "ano": ano,
                        "mes": mes,
                        "dia": dia
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getFecha2 = async (req:Request, res: Response) => {
        const { ano, mes, dia, cont } = req.params
        console.log( ano, mes, dia, cont )
        await db.conectarBD()
        .then( async ()=> {
            const query = await Aires.aggregate([
                {
                    $match:{}
                },
                {
                    $addFields: {
                        "ano": {$toString: {$year: "$fecha"}},
                        "mes": {$toString: {$month: "$fecha"}},
                        "dia": {$toString: {$dayOfMonth: "$fecha"}},
                        "cont": cont,
                    }
                },
                {
                    $match: {
                        "ano": ano,
                        "mes": mes,
                        "dia": dia
                    }
                },
                {
                    $project: {
                        "ano": 1,
                        "mes": 1,
                        "dia": 1,
                        "Latitud": 1,
                        "Longitud": 1,
                        "cont": 1,
                        "dato": { $switch: {
                            branches: [
                                {case: { $regexMatch: { input: "$cont", regex: "O3"} }, then: ["$O3"] },
                                {case: { $regexMatch: { input: "$cont", regex: "NO2"} }, then: ["$NO2"] },
                                {case: { $regexMatch: { input: "$cont", regex: "CO"} }, then: ["$CO"] },
                                {case: { $regexMatch: { input: "$cont", regex: "Todo"} }, then: ["$O3", "$NO2", "$CO"] }
                            ]
                        }}
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getFecha3 = async (req:Request, res: Response) => {
        const { ano, mes, dia, hora, min, seg } = req.params
        console.log( ano, mes, dia, hora, min, seg )
        await db.conectarBD()
        .then( async ()=> {
            const query = await Aires.aggregate([
                {
                    $match:{}
                },
                {
                    $addFields: {
                        "ano": {$toString: {$year: "$fecha"}},
                        "mes": {$toString: {$month: "$fecha"}},
                        "dia": {$toString: {$dayOfMonth: "$fecha"}},
                        "hora": {$toString: {$hour: "$fecha"}},
                        "min": {$toString: {$minute: "$fecha"}},
                        "seg": {$toString: {$second: "$fecha"}}
                    }
                },
                {
                    $match: {
                        "ano": ano,
                        "mes": mes,
                        "dia": dia,
                        "hora": hora,
                        "min": min,
                        "seg": seg
                    }
                },
                {
                    $project: {
                        "dato": ["$O3", "$NO2", "$CO"],
                        "Latitud": 1,
                        "Longitud": 1
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    misRutas(){
        this._router.get('/', this.getAires),
        this._router.get('/getFecha/:ano&:mes&:dia', this.getFecha),
        this._router.get('/getFecha2/:ano&:mes&:dia&:cont', this.getFecha2)
        this._router.get('/getFecha3/:ano&:mes&:dia&:hora&:min&:seg', this.getFecha3)
    }
}
const obj = new AireRoutes()
obj.misRutas()
export const aireRoutes = obj.router