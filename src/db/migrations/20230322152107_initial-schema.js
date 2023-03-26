export const up = async (knex) => {
  await knex.schema.createTable("roles", (table) => {
    table.increments("id")
    table.string("name").notNullable()
    table.json("permissions").notNullable()
  })

  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("firstName").notNullable()
    table.text("lastName").notNullable()
    table.text("email").notNullable().unique()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.integer("roleId").references("id").inTable("roles").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("pages", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("content").notNullable()
    table.text("slug").notNullable().unique()
    table.integer("creatorId").references("id").inTable("users").notNullable()
    table.integer("modifierId").references("id").inTable("users").nullable()
    table.dateTime("publishedAt")
    table.enum("status", ["draft", "published"]).notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("navigationMenus", (table) => {
    table.increments("id")
    table.string("name").notNullable()
    table.json("pages").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("menuItems", (table) => {
    table.increments("id")
    table
      .integer("menuId")
      .references("id")
      .inTable("navigationMenus")
      .notNullable()
    table.integer("pageId").references("id").inTable("pages").notNullable()
    table.integer("parentId").references("id").inTable("menuItems").nullable()
    table.integer("order").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("fields", (table) => {
    table.increments("id")
    table
      .enum("type", ["single", "multi", "radio", "select", "checkbox"])
      .notNullable()
    table.json("options").nullable()
    table.string("label").notNullable()
    table.string("default_value").nullable()
    table.timestamps(true, true, true)
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("fields")
  await knex.schema.dropTable("menuItems")
  await knex.schema.dropTable("navigationMenus")
  await knex.schema.dropTable("pages")
  await knex.schema.dropTable("users")
  await knex.schema.dropTable("roles")
}
