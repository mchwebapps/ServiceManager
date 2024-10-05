export interface Customer {
  id: string,
  name: string,
  phone: string,
  email: string,
  type: string
}

const customers = ref<Customer[]>([
  {
    id: 'hf63f9ha',
    name: 'Izabela Brzozowska-Świątek',
    phone: '793164445',
    email: 'ibs@poczta.onet.pl',
    type: 'Klient indywidualny'
  },
  {
    id: 'jh87f6dh',
    name: 'XNET',
    phone: '722020202',
    email: 'binkopiotr@gmail.com ',
    type: 'Klient biznesowy'
  }
])

import { ref } from 'vue'
export default customers