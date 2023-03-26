import * as yup from "yup"
import deepmerge from "deepmerge"

const validate = ({ body, params, query }) => {
  const validator = yup.object().shape({
    ...(body ? { body: yup.object(body).shape() } : {}),
    ...(params ? { params: yup.object(params).shape() } : {}),
    ...(query ? { query: yup.object(query).shape() } : {}),
  })

  return async (req, res, next) => {
    try {
      const { body, params, query } = await validator.validate(
        {
          body: req.body,
          params: req.params,
          query: req.query,
        },
        { abortEarly: false }
      )

      req.locals = deepmerge(req.locals, {
        body,
        params,
        query,
      })

      next()
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        res.status(422).send({ error: err.errors })

        return
      }

      res.status(500).send({ error: "Oops... Something went wrong" })
    }
  }
}

export default validate
