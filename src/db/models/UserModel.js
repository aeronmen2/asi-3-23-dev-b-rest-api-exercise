import BaseModel from "./BaseModel.js"
import hashPassword from "../hashPassword.js"
import RoleModel from "./RoleModel.js"
import PageModel from "./PageModel.js"

class UserModel extends BaseModel {
  static tableName = "users"

  static modifiers = {
    paginate: (query, limit, page) => {
      return query.limit(limit).offset((page - 1) * limit)
    },
  }

  static RelationMappings() {
    return {
      role: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: "users.roleId",
          to: "roles.id",
        },
      },
      createdPages: {
        relation: BaseModel.HasManyRelation,
        modelClass: PageModel,
        join: {
          from: "users.id",
          to: "pages.creatorId",
        },
      },
      modifiedPages: {
        relation: BaseModel.HasManyRelation,
        modelClass: PageModel,
        join: {
          from: "users.id",
          to: "pages.modifierId",
        },
      },
    }
  }

  checkPassword = async (password) => {
    const [passwordHash] = await hashPassword(password, this.passwordSalt)

    return passwordHash === this.passwordHash
  }
}

export default UserModel
