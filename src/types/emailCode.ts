export interface EmailCodeModel {
  createdAt: Date
  email: string
  code: string
  tries: number
}
