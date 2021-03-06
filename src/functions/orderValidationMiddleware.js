const Validator = require('./../functions/Validator')

const create = (req, res, next) => {
  const requestBody = { ...req.params, ...req.body }

  const validationRule = {
    address: 'required|mongoId|exists:AddressBook,_id'
  }

  Validator(requestBody, validationRule, {}, (err, status) => {
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

const updateApprovalStatus = (req, res, next) => {
  const validationRule = {
    token: 'required',
    adminId: 'required|mongoId',
    status: 'required|valid_order_status'
  }

  Validator(req.params, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400)
        .send({
          success: false,
          message: 'Validation Failed',
          data: err
        })
    } else {
      next()
    }
  })
}

const updateOrderStatus = (req, res, next) => {
  const validationRule = {
    orderId: 'required|mongoId',
    status: 'required|valid_order_status'
  }

  Validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400)
        .send({
          success: false,
          message: 'Validation Failed',
          data: err
        })
    } else {
      next()
    }
  })
}

const get = (req, res, next) => {
  const validationRule = {
    _id: 'mongoId',
    startDate: 'date',
    endDate: 'date'
  }

  Validator(req.query, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400)
        .send({
          success: false,
          message: 'Validation Failed',
          data: err
        })
    } else {
      next()
    }
  })
}

const createInstallmentOrder = (req, res, next) => {
  const validationRule = {
    cartId: 'required|mongoId|exists:Cart,_id',
    addressId: 'required|mongoId|exists:AddressBook,_id',
    bankAccountId: 'required|mongoId|exists:BankAccount,_id',
  }

  Validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400)
        .send({
          success: false,
          message: 'Validation Failed',
          data: err
        })
    } else {
      next()
    }
  })
}

module.exports = {
  create,
  updateApprovalStatus,
  updateOrderStatus,
  get,
  createInstallmentOrder
}
