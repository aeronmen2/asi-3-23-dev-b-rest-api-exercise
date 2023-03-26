import BaseModel from "./BaseModel.js"
import NavigationModel from "./NavigationModel.js"
import PageModel from "./PageModel.js"

class MenuItemModel extends BaseModel {
  static tableName = "menuItems"

  static modifiers = {
    paginate: (query, limit, page) => {
      return query.limit(limit).offset((page - 1) * limit)
    },
  }

  static RelationMappings() {
    return {
      navigationMenu: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: NavigationModel,
        join: {
          from: "menuItems.navigationId",
          to: "navigations.id",
        },
      },
      page: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: PageModel,
        join: {
          from: "menuItems.pageId",
          to: "pages.id",
        },
      },
      parent: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: MenuItemModel,
        join: {
          from: "menuItems.parentId",
          to: "menuItems.id",
        },
      },
    }
  }
}

export default MenuItemModel
