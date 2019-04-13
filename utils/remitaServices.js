/* eslint-disable require-jsdoc */
const request = require('request-promise')
const sha512 = require('crypto-js/sha512')

// TODO replace with correct valid credentials
const remitaConfig = {
  baseUrl: 'https://remitademo.net/remita',
  serviceTypeId: '4430731',
  apiKey: '1946',
  merchantId: '2547916',
}

// Remita JSONP padding ishh
const jsonp = json => json

const _generateRRR = async (payload, apiHash) => {
  try {
    const { merchantId, serviceTypeId } = remitaConfig
    payload = { ...payload, serviceTypeId }
    const options = {
      method: 'POST',
      uri: `${remitaConfig.baseUrl}/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit`,
      body: payload,
      json: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`
      }
    }
    const response = await request(options)
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

const _getRRRStatus = async (rrr, apiHash) => {
  try {
    const { merchantId } = remitaConfig
    const options = {
      method: 'GET',
      uri: `${remitaConfig.baseUrl}/ecomm/${merchantId}/${rrr}/${apiHash}/status.reg`,
      json: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`
      }
    }
    const response = await request(options)
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

const _setUpMandate = async (body) => {
  try {
    const {
      merchantId, serviceTypeId, apiKey, baseUrl
    } = remitaConfig
    body.merchantId = merchantId
    body.serviceTypeId = serviceTypeId
    body.hash = sha512(`${remitaConfig.merchantId}${serviceTypeId}${body.requestId}${body.amount}${apiKey}`).toString()
    const options = {
      method: 'POST',
      uri: `${baseUrl}/exapp/api/v1/send/api/echannelsvc/echannel/mandate/setup`,
      body,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await request(options)
    return Promise.resolve(eval(response))
  } catch (error) {
    return Promise.reject(error)
  }
}

const _mandateStatus = async (orderNumber) => {
  try {
    const { merchantId, apiKey, baseUrl } = remitaConfig
    const hash = sha512(`${orderNumber}${apiKey}${merchantId}`).toString()
    const options = {
      method: 'GET',
      uri: `${baseUrl}/ecomm/mandate/${merchantId}/${orderNumber}/${hash}/status.reg`,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await request(options)
    return Promise.resolve(eval(response))
  } catch (error) {
    return Promise.reject(error)
  }
}

const _mandatePaymentHistory = async (body) => {
  try {
    const { merchantId, apiKey, baseUrl } = remitaConfig
    body.hash = sha512(`${body.mandateId}${merchantId}${body.requestId}${apiKey}`).toString()
    const options = {
      method: 'POST',
      uri: `${baseUrl}/exapp/api/v1/send/api/echannelsvc/echannel/mandate/payment/history`,
      json: true,
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await request(options)
    return Promise.resolve(eval(response))
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = {
  _generateRRR,
  _getRRRStatus,
  _setUpMandate,
  _mandateStatus,
  _mandatePaymentHistory
}
