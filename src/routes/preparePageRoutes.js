import PageModel from "../db/models/PageModel.js"
import auth from "../middlewares/auth.js"
import checkPerms from "../middlewares/checkPerms.js"
import validate from "../middlewares/validate.js"
import {
  contentValidator,
  creatorIdValidator,
  limitValidator,
  pageValidator,
  slugValidator,
  statusValidator,
  titleValidator,
} from "../validators.js"

const preparePageRoutes = ({ app }) => {
  app.get(
    "/pages",
    validate({
      query: {
        limit: limitValidator,
        page: pageValidator,
      },
    }),
    auth,
    checkPerms("read", "pages"),
    async (req, res) => {
      const { limit, page } = req.locals.query
      const query = await PageModel.query().modify("paginate", limit, page)

      const [countResult] = await PageModel.query().count()

      const count = Number.parseInt(countResult.count, 10)
      const pages = await query

      res.send({
        result: pages,
        meta: {
          count,
        },
      })
    }
  )

  app.get("/pages/:id", checkPerms("read", "pages"), async (req, res) => {
    const { id } = req.params
    const page = await PageModel.query().findById(id)

    if (!page) {
      res.status(404).send({ error: "Page not found!" })

      return
    }

    res.send({ result: page })
  })

  app.delete("/pages/:id", checkPerms("delete", "pages"), async (req, res) => {
    const { id } = req.params
    const page = await PageModel.query().findById(id)

    if (!page) {
      res.status(404).send({ error: "Page not found!" })

      return
    }

    await page.query().deleteById(id)

    res.send({ result: page })
  })

  app.post(
    "/pages",
    checkPerms("create", "pages"),
    validate({
      body: {
        title: titleValidator.required(),
        content: contentValidator.required(),
        slug: slugValidator.required(),
        creatorId: creatorIdValidator.required(),
        status: statusValidator.required(),
      },
    }),
    async (req, res) => {
      const { title, content, slug, creatorId, status } = req.locals.body
      const page = await PageModel.query().insertAndFetch({
        title,
        content,
        slug,
        creatorId,
        status,
      })

      res.send({ result: page })
    }
  )

  app.put(
    "/pages/:id",
    checkPerms("update", "pages"),
    validate({
      body: {
        title: titleValidator.required(),
        content: contentValidator.required(),
        slug: slugValidator.required(),
        creatorId: creatorIdValidator.required(),
        status: statusValidator.required(),
      },
    }),
    async (req, res) => {
      const { id } = req.params
      const { title, content, slug, creatorId, status } = req.locals.body

      const page = await PageModel.query().patchAndFetchById(id, {
        title,
        content,
        slug,
        creatorId,
        status,
      })

      if (!page) {
        res.status(404).send({ error: "Page not found!" })

        return
      }

      res.send({ result: page })
    }
  )
}

export default preparePageRoutes
