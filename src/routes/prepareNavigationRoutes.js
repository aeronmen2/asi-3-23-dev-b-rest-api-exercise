import NavigationModel from "../db/models/NavigationModel.js"
import auth from "../middlewares/auth.js"
import checkPerms from "../middlewares/checkPerms.js"
import validate from "../middlewares/validate.js"
import { limitValidator, pageValidator } from "../validators.js"

const prepareNavigationRoutes = ({ app }) => {
  app.get(
    "/navigation",
    validate({
      query: {
        limit: limitValidator,
        page: pageValidator,
      },
    }),
    auth,
    checkPerms("read", "navigations"),
    async (req, res) => {
      const { limit, page } = req.locals.query

      const query = await NavigationModel.query().modify(
        "paginate",
        limit,
        page
      )

      if (!query) {
        res.status(404).send({ error: "Navigation menus cannot be found!" })

        return
      }

      const [countResult] = await NavigationModel.query().count()

      const count = Number.parseInt(countResult.count, 10)
      const navigation = await query

      res.send({
        result: navigation,
        meta: {
          count,
        },
      })
    }
  )

  app.get(
    "/navigation/:id",
    checkPerms("read", "navigations"),
    async (req, res) => {
      const { id } = req.params
      const navigation = await NavigationModel.query().findById(id)

      if (!navigation) {
        res.status(404).send({ error: "Navigation menu could not be found!" })

        return
      }

      res.send({ result: navigation })
    }
  )

  app.delete(
    "/navigation/:id",
    checkPerms("delete", "navigations"),
    async (req, res) => {
      const { id } = req.params
      const navigation = await NavigationModel.query().findById(id)

      if (!navigation) {
        res.status(404).send({ error: "Navigation menu could not be found" })

        return
      }

      await NavigationModel.query().deleteById(id)

      res.send({ result: navigation })
    }
  )
}

export default prepareNavigationRoutes
