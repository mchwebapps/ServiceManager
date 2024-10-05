export class OrderCreateForm {
  id!: number
  rma!: string
  admissionDate!: string
  deadline!: string
  priority!: string
  customerId!: string
  customerName!: string
  status!: string
  salesDocument!: string
  paymentTerm!: string
  payment!: number
  delivery!: string
  devices!: Device[]
  workerId!: string
  workerName!: string
}

export class Device {
  id!: number
  type!: string
  parameters!: DeviceParameter[]
  services!: DeviceService[]
}

export class DeviceParameter {
  id!: number
  name!: string
  value!: string
}

export class DeviceService {
  id!: number
  name!: string
  price!: string
}