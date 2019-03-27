const Validator = require('./../functions/Validator')

const profileUpdate = (req, res, next) => {
  const requestBody = { ...req.params, ...req.body }

  const validationRule = {
    firstName: 'sometimes|required',
    lastName: 'sometimes|required',
    email: 'sometimes|email|exists:User,email',
    phoneNumber: 'sometimes|digits:11|exists:User,phoneNumber',
    password: 'sometimes|password_policy|confirmed'
  }

  Validator(requestBody, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: 'Validation failed',
        data: err
      })
    } else {
      next()
    }
  })
}

const memberTransactions = (req, res, next) => {
  const validationRule = {
    memberId: 'required|mongoId|exists:User,_id'
  }

  Validator(req.params, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400)
        .send({
          success: false,
          message: 'Validation failed',
          data: err
        })
    } else {
      next()
    }
  })
}

const memberStatus = (req, res, next) => {
  const validationRule = {
    memberId: 'required|mongoId|exists:User,_id',
    status: 'required|valid_status',
  }

  Validator({ ...req.params, ...req.body }, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400)
        .send({
          success: false,
          message: 'Validation failed',
          data: err
        })
    } else {
      next()
    }
  })
}

module.exports = {
  profileUpdate,
  memberTransactions,
  memberStatus
}
