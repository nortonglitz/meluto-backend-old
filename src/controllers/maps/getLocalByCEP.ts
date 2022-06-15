/* eslint-disable no-undef */
import { RequestHandler } from 'express'

const key = process.env.MAPS_KEY

export const getLocalByCEP: RequestHandler = async (req, res, next) => {
  const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address`)
}
