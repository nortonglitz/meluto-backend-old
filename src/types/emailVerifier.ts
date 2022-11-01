export interface EmailVerifierModel {
  createdAt: Date
  updatedAt: Date
  email: string
  code: string
  verified: Boolean
}
