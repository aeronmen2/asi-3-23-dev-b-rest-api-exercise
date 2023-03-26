import UserModel from "../db/models/UserModel.js"
import validate from "../middlewares/validate.js"
import { emailValidator, passwordValidator } from "../validators.js"
import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"

const prepareSignRoutes = ({ app }) => {
  app.post(
    "/sign-in",
    validate({
      body: {
        email: emailValidator.required(),
        password: passwordValidator.required(),
      },
    }),
    async (req, res) => {
      const { email, password } = req.locals.body
      const user = await UserModel.query().findOne({ email })

      if (!user || !(await user.checkPassword(password))) {
        res.status(401).send({ error: "Invalid credentials" })

        return
      }

      const jwt = jsonwebtoken.sign(
        {
          payload: {
            user: {
              id: user.id,
              roles: user.roles,
            },
          },
        },
        config.security.jwt.secret,
        {
          expiresIn: config.security.jwt.expiresIn,
        }
      )

      res.send({ result: jwt })
    }
  )
}

export default prepareSignRoutes
