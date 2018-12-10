const Validator = require('./../functions/Validator')
const helpers = require('./../functions/helpers')

/**
 * We'll be validating user body request before hitting our controller method using validatorjs
 * to learn more about this module https://www.npmjs.com/package/validatorjs
 * This validation will be done depending on the registering account type
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 * @return {*} object
 */
const validateUserCreation = (req, res, next) => {
  // check if businessRegistrationDocumentWas upload and update the document path
  if (req.file) req.body.businessRegistrationDocument = req.file.path

  const { body: reqBody } = req

  const accountTypes = {
    [helpers.constants.SELLER]: true,
    [helpers.constants.BUYER]: true,
    [helpers.constants.CORPORATE_ADMIN]: true,
    [helpers.constants.SUPER_ADMIN]: true
  }

  const { accountType } = reqBody

  //  let us check if accountType is set and exists in our defined accountTypes
  if (!accountType || (!accountTypes[accountType])) {
    //  if validation fails remove file
    if (req.body.businessRegistrationDocument) {
      helpers.removeFile(req.body.businessRegistrationDocument)
    }
    return res.send({
      success: false,
      message: 'Validation failed',
      data: { errors: { accountType: ['Invalid account type'] } }
    })
      .status(400)
  }

  //  if email is not defined set an empty string
  if (!reqBody.email) reqBody.email = ''

  const buyerRules = {
    accountType: 'required',
    firstName: 'required',
    lastName: 'required',
    email: 'email|exists:User,email',
    phoneNumber: [{
      required_if: ['email', ''],
      min: 11,
      max: 11,
      exists: 'User,phoneNumber'
    }],
    cooperative: [{
      mongoId: '',
      exists: 'User,_id'
    }],
    password: 'required|min:6'
  }

  const superAdminRules = {
    accountType: 'required',
    name: 'required',
    email: 'exists:User,email'
  }

  const sellerRules = {
    ...buyerRules,
    businessName: 'required|exists:User,businessName',
    businessRegistrationNumber: 'required|exists:User,businessRegistrationNumber',
    businessRegistrationDocument: 'required',
    businessAddress: 'required',
    businessProductCategory: 'required',
    businessSellingInOtherWebsite: 'required|boolean',
  }
  //  password is not required when signing up as a seller so we won't validate it
  delete sellerRules.password

  const customMessages = {
    'required_if.phoneNumber': 'Please provide your email or phone number',
    'exists.cooperative': 'Specified cooperative doesn\'t not exits'
  }

  let validationRule

  // buyer and corporate_admin uses the same validation rule
  switch (accountType) {
    case helpers.constants.BUYER:
    case helpers.constants.CORPORATE_ADMIN:
      validationRule = buyerRules
      break
    case helpers.constants.SELLER:
      validationRule = sellerRules
      break
    case helpers.constants.SUPER_ADMIN:
      validationRule = superAdminRules
      break
    default:
      validationRule = {}
  }
  reqBody.phoneNumber = null
  //  validation rule depends on the user registering
  Validator(reqBody, validationRule, customMessages, (error, status) => {
    if (!status) {
      res.send({
        success: false,
        message: 'Validation failed',
        data: error
      })
        .status(400)
    } else {
      next()
    }
  })
}

const validateUserLogin = (req, res, next) => {
  const { body: reqBody } = req
  const validationRule = {
    email: 'required|email',
    password: 'required'
  }
  Validator(reqBody, validationRule, {}, (error, status) => {
    if (!status) {
      res.send({
        success: false,
        message: 'Validation failed',
        data: error
      })
        .status(400)
    } else {
      next()
    }
  })
}

const validateForgotPassword = (req, res, next) => {
  const { body: reqBody } = req

  Validator(reqBody, { email: 'required|email' }, {}, (error, status) => {
    if (!status) {
      res.send({
        success: false,
        message: 'Validation failed',
        data: error
      })
        .status(400)
    } else {
      next()
    }
  })
}

const validatePasswordReset = (req, res, next) => {
  const { body, query } = req
  const bodyBody = { ...body, ...query }

  const validationRule = {
    token: 'required',
    password: 'required|confirmed'
  }

  Validator(bodyBody, validationRule, {}, (error, status) => {
    if (!status) {
      res.send({
        success: false,
        message: 'Validation failed',
        data: error
      })
        .status(400)
    } else {
      next()
    }
  })
}


module.exports = {
  validateUserCreation,
  validateUserLogin,
  validateForgotPassword,
  validatePasswordReset
}