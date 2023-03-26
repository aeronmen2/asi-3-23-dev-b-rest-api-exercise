import { promisify } from "node:util"
import config from "../config.js"

const { randomBytes, pbkdf2: pbkdf2Callback } = await import("node:crypto")

const pbkdf2 = promisify(pbkdf2Callback)

const hashPassword = async (
  password,
  salt = randomBytes(config.security.password.saltlen).toString("hex")
) => [
  await pbkdf2(
    password,
    salt,
    config.security.password.iterations,
    config.security.password.keylen,
    config.security.password.digest
  ).toString("hex"),
  salt,
]

export default hashPassword
