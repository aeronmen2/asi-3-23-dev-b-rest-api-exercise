import * as dotenv from "dotenv"
import { resolve } from "node:path"

dotenv.config()

const config = {
  port: 3000,
  db: {
    client: "pg",
    connection: {
      host: process.env.DB__CONNECTION__HOST,
      port: process.env.DB__CONNECTION__PORT,
      user: process.env.DB__CONNECTION__USER,
      password: process.env.DB__CONNECTION__PASSWORD,
      database: process.env.DB__CONNECTION__DATABASE,
    },
    migrations: {
      directory: resolve("src/db/migrations"),
      stub: resolve("src/db/migration.stub"),
    },
    seeds: {
      directory: resolve("src/db/seeds"),
    },
  },
  security: {
    jwt: {
      secret: process.env.SECURITY__JWT__SECRET,
      expiresIn: "2 days",
    },
    password: {
      saltlen: 128,
      keylen: 128,
      iterations: 10,
      digest: "sha512",
      pepper: process.env.SECURITY__PASSWORD__PEPPER,
    },
  },
}

export default config
