import express from "express"
import knex from "knex"
import winston from "winston"
import config from "./src/config.js"
import BaseModel from "./src/db/models/BaseModel.js"
import prepareRoutes from "./src/routes/prepareRoutes.js"

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
})
const db = knex(config.db)

db.on("query", ({ sql }) => logger.debug(sql))
BaseModel.knex(db)

const app = express()
const ctx = {
  app,
  db,
}

app.use((req, res, next) => {
  req.locals = {}

  next()
})

app.use(express.json())
prepareRoutes(ctx)

app.listen(config.port, () => logger.info(`Listening on port :${config.port}`))
