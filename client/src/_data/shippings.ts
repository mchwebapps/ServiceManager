export class Shipping {
  id?: string;
  companyName?: string;
  companyStreet?: string;
  companyBuildingNo?: string;
  companyHouseNo?: string;
  companyPostcode?: string;
  companyCity?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  defaultAddress?: boolean;
}

const shippings = ref<Shipping[]>([
  {
    id: 'dgjku7672',
    companyName: 'XNET Telefony komórkowe',
    companyStreet: 'Jana III Sobieskiego',
    companyBuildingNo: '1',
    companyHouseNo: '150',
    companyPostcode: '44-200',
    companyCity: 'Rybnik',
    firstName: 'Piotr',
    lastName: 'Bińko',
    phone: '722020202',
    email: 'binkopiotr@gmail.com',
    defaultAddress: true
  },
  {
    id: 'fadsksag7',
    companyName: 'XNET Telefony komórkowe Oddział w Koluszkach',
    companyStreet: 'Jagiellońska',
    companyBuildingNo: '28',
    companyHouseNo: '41',
    companyPostcode: '41-902',
    companyCity: 'Bytom',
    firstName: 'Maciej',
    lastName: 'Kaniowski',
    phone: '501747804',
    email: 'maciejkaniowski@gmail.com',
    defaultAddress: false
  }
])

import { ref } from 'vue'
export default shippings