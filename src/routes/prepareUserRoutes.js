import hashPassword from "../db/hashPassword.js"
import UserModel from "../db/models/UserModel.js"
import validate from "../middlewares/validate.js"
import {
  emailValidator,
  firstNameValidator,
  lastNameValidator,
  passwordValidator,
  roleValidator,
  limitValidator,
  pageValidator,
} from "../validators.js"
import checkPerms from "../middlewares/checkPerms.js"

const prepareUserRoutes = ({ app }) => {
  app.get(
    "/users",
    validate({
      query: {
        limit: limitValidator,
        page: pageValidator,
      },
    }),
    checkPerms("read", "users"),
    async (req, res) => {
      const { limit, page } = req.locals.query
      const query = await UserModel.query().modify("paginate", limit, page)

      const [countResult] = await UserModel.query().count()

      const count = Number.parseInt(countResult.count, 10)
      const users = await query

      res.send({ result: users, meta: { count } })
    }
  )

  app.get("/users/:id", checkPerms("read", "users"), async (req, res) => {
    const { id } = req.params

    const user = await UserModel.query().findById(id)

    if (!user) {
      res.status(404).send({ error: "User not found!" })

      return
    }

    res.send({ result: user })
  })

  app.post(
    "/users",
    checkPerms("create", "users"),
    validate({
      body: {
        firstName: firstNameValidator.required(),
        lastName: lastNameValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required(),
        role_id: roleValidator.required(),
      },
    }),
    async (req, res) => {
      const { firstName, lastName, email, password, role_id } = req.locals.body
      const user = await UserModel.query().findOne({ email })

      if (user) {
        res.send({ result: true })

        return
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      await UserModel.query().insertAndFetch({
        firstName,
        lastName,
        email,
        passwordHash,
        passwordSalt,
        role_id,
      })

      res.send({ result: true })
    }
  )

  app.delete("/users/:id", checkPerms("delete", "users"), async (req, res) => {
    const { id } = req.params

    const user = await UserModel.query().findById(id)

    if (!user) {
      res.status(404).send({ error: "User not found!" })

      return
    }

    await UserModel.query().deleteById(id)

    res.send({ result: true })
  })

  app.put(
    "/users/:id",
    checkPerms("update", "users"),
    validate({
      body: {
        firstName: firstNameValidator,
        lastName: lastNameValidator,
        email: emailValidator,
        password: passwordValidator,
        role_id: roleValidator,
      },
    }),
    async (req, res) => {
      const { id } = req.params
      const { firstName, lastName, email, password, role_id } = req.locals.body

      const user = await UserModel.query().findById(id)

      if (!user) {
        res.status(404).send({ error: "User not found!" })

        return
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      await user.query().patchAndFetch({
        firstName,
        lastName,
        email,
        passwordHash,
        passwordSalt,
        role_id,
      })

      res.send({ result: true })
    }
  )
}

export default prepareUserRoutes
