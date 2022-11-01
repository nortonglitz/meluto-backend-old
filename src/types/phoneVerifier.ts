export interface PhoneVerifierModel {
  createdAt: Date
  updatedAt: Date
  phone: string
  code: string
  verified: Boolean
}
