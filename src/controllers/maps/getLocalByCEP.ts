import { RequestHandler } from 'express'
import axios from 'axios'

const key = process.env.MAPS_KEY

export const getLocalByCEP: RequestHandler = async (req, res, next) => {
  try {
    const { CEP } = req.params
    if (CEP.length !== 8) {
      return res.status(400).json({
        error: 'InvalidCEPError',
        message: 'CEP must be 8 numbers.'
      })
    }
    const { data: { results } } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${CEP}&key=${key}`)
    if (results.length > 0) {
      const { address_components: addressComponents, geometry } = results[0]
      const parsedAddress = addressComponents.reduce((address: any, field: any) => {
        if (field.types.includes('route')) {
          return { ...address, thoroughfare: field.long_name }
        } else if (field.types.includes('sublocality_level_1')) {
          return { ...address, district: field.long_name }
        } else if (field.types.includes('administrative_area_level_2')) {
          return { ...address, city: field.long_name }
        } else if (field.types.includes('administrative_area_level_1')) {
          return { ...address, state: field.short_name }
        } else {
          return address
        }
      }, {})
      return res.status(200).json({
        address: parsedAddress,
        geometry: {
          lat: geometry.location.lat,
          lng: geometry.location.lng
        }
      })
    } else {
      return res.status(404).json({
        error: 'NotFoundError',
        message: 'cep not found.'
      })
    }
  } catch (err: any) {
    next(err)
  }
}
