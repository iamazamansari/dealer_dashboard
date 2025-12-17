export interface Dealer {
  id: number
  name: string
  location: string
  contact: string
  status: "Active" | "Inactive" | "Pending"
  lat?: number
  lng?: number
  address?: string
  email?: string
  phone?: string
  operatingHours?: string
}
