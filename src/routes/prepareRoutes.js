import preparePageRoutes from "./preparePageRoutes.js"
import prepareSignRoutes from "./prepareSignRoutes.js"
import prepareUserRoutes from "./prepareUserRoutes.js"
import prepareNavigationRoutes from "./prepareNavigationRoutes.js"

const prepareRoutes = (ctx) => {
  prepareSignRoutes(ctx)
  preparePageRoutes(ctx)
  prepareUserRoutes(ctx)
  prepareNavigationRoutes(ctx)
}

export default prepareRoutes
