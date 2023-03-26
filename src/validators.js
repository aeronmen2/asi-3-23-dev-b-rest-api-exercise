import * as yup from "yup"

export const firstNameValidator = yup.string().min(1)

export const lastNameValidator = yup.string().min(1)

export const emailValidator = yup.string().email()

export const passwordValidator = yup.string().min(8)

export const roleValidator = yup.number().integer()

export const boolValidator = yup.bool()

export const limitValidator = yup.number().integer().min(1).max(100).default(5)

export const pageValidator = yup.number().integer().min(1).default(1)

export const orderFieldValidator = (fields) => yup.string().oneOf(fields)

export const orderValidator = yup.string().lowercase().oneOf(["asc", "desc"])

export const titleValidator = yup.string()

export const contentValidator = yup.string()

export const slugValidator = yup.string()

export const creatorIdValidator = yup.number().integer()

export const statusValidator = yup.string().oneOf(["draft", "published"])
