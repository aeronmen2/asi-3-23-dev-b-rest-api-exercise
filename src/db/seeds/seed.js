import { faker } from "@faker-js/faker"
import hashPassword from "../hashPassword.js"

export const seed = async function (knex) {
  await knex("roles").del()
  await knex("users").del()
  await knex("pages").del()

  const [passwordHash, passwordSalt] = await hashPassword("Testmdp123@@")

  await knex("roles").insert([
    {
      name: "admin",
      permissions: {
        user: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        page: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        navigation: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      },
    },
    {
      name: "manager",
      permissions: {
        user: {
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        page: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        navigation: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      },
    },
    {
      name: "editor",
      permissions: {
        user: {
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        page: {
          create: false,
          read: true,
          update: true,
          delete: false,
        },
        navigation: {
          create: false,
          read: true,
          update: true,
          delete: false,
        },
      },
    },
  ])

  await knex("users").insert([
    {
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      roleId: 1,
    },
    {
      firstName: "Manager",
      lastName: "User",
      email: "manager@example.com",
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      roleId: 2,
    },
    {
      firstName: "Editor",
      lastName: "User",
      email: "editor@example.com",
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      roleId: 3,
    },
  ])

  const pages = []

  for (let i = 0; i < 300; i++) {
    const title = faker.lorem.sentence()
    const content = faker.lorem.paragraphs()
    const slug = faker.lorem.slug()
    const creatorId = Math.floor(Math.random() * 3) + 1
    const status = "draft"

    pages.push({ title, content, slug, creatorId, status })
  }

  await knex("pages").insert(pages)
}
