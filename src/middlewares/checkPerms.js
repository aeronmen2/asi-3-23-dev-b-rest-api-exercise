const checkPerms = (perms, access) => (req, res, next) => {
  const { user } = req.locals

  if (!user) {
    res.status(403).send({ error: "Forbidden!" })

    return
  }

  const permissions = JSON.parse(user.role.permissions[access])

  if (permissions && permissions.includes(perms)) {
    next()
  } else {
    res.status(403).send({ error: "Forbidden!" })
  }
}

export default checkPerms
