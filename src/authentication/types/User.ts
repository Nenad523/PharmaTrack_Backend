/* eslint-disable prettier/prettier */

export type User = {
    id: number
    fullName: string
    email: string
    passwordHash: string
    role: string | null
    pharmacy_id: string | null
    isVerified: number
}
