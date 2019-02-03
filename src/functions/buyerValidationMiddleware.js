const Validator = require('./../functions/Validator')

const profileUpdate = (req, res, next) => {
  const requestBody = { ...req.params, ...req.body }

  const validationRule = {
    firstName: 'sometimes|required',
    lastName: 'sometimes|required',
    email: 'sometimes|email|exists:User,email',
    address: 'sometimes|mongoId|exists:AddressBook,_id',
    phoneNumber: 'sometimes|digits:11|exists:User,phoneNumber',
    businessAddress: 'sometimes|required',
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

module.exports = {
  profileUpdate
}
