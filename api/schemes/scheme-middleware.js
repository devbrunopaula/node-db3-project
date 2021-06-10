const e = require('express')
const db = require('../../data/db-config')
/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const {scheme_id} = req.params
  const error = {}

  try {
    const isIdValid = await db('schemes').where('scheme_id', scheme_id).first()

    if (isIdValid === undefined) {
      error.status = 404
      error.message = `scheme with scheme_id ${scheme_id} not found`
    } else if (!isIdValid.scheme_id || isIdValid.scheme_id === '') {
      error.status = 400
      error.message = 'invalid scheme_name'
    }

    if (error.message) {
      next(error)
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const {scheme_name} = req.body
  if (
    scheme_name === undefined ||
    typeof scheme_name !== 'string' ||
    !scheme_name.trim()
  ) {
    next({status: 400, message: 'invalid step'})
  } else {
    next()
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/

const validateStep = (req, res, next) => {
  const {instructions, step_number} = req.body

  if (
    !instructions ||
    instructions === undefined ||
    typeof instructions !== 'string' ||
    typeof step_number === 'number' ||
    step_number < 1
  ) {
    next({status: 400, message: 'invalid step'})
  } else {
    next
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
