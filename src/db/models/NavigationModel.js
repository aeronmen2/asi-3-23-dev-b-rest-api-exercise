import BaseModel from "./BaseModel.js"
import MenuItemModel from "./MenuItemModel.js"

class NavigationModel extends BaseModel {
  static tableName = "navigations"

  static modifiers = {
    paginate: (query, limit, page) => {
      return query.limit(limit).offset((page - 1) * limit)
    },
  }

  static RelationMappings() {
    return {
      menuItems: {
        relation: BaseModel.HasManyRelation,
        modelClass: MenuItemModel,
        join: {
          from: "navigations.id",
          to: "menuItems.navigationId",
        },
      },
    }
  }
}

export default NavigationModel
