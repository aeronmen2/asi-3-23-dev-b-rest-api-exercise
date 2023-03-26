import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import UserModel from "../db/models/UserModel.js"

const auth = async (req, res, next) => {
  const jwt = req.headers.authorization?.slice(7)

  try {
    const { payload } = jsonwebtoken.verify(jwt, config.security.jwt.secret)
    req.locals.session = payload

    const user = await UserModel.query()
      .findById(payload.id)
      .withGraphFetched("role")
    req.locals.user = user

    next()
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      res.status(403).send({ error: "Forbidden!" })

      return
    }

    console.error(err)

    res.status(500).send({ error: "Oops.. Something went wrong." })
  }
}

export default auth
