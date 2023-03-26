import BaseModel from "./BaseModel.js"
import MenuItemModel from "./MenuItemModel.js"
import UserModel from "./UserModel.js"

class PageModel extends BaseModel {
  static tableName = "pages"

  static modifiers = {
    paginate: (query, limit, page) => {
      return query.limit(limit).offset((page - 1) * limit)
    },
  }

  static RelationMappings() {
    return {
      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "pages.creatorId",
          to: "users.id",
        },
      },
      modifier: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "pages.modifierId",
          to: "users.id",
        },
      },
      menuItem: {
        relation: BaseModel.HasManyRelation,
        modelClass: MenuItemModel,
        join: {
          from: "pages.id",
          to: "menuItems.pageId",
        },
      },
    }
  }
}

export default PageModel
