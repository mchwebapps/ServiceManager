export class Billing {
  id?: string;
  companyName?: string;
  companyStreet?: string;
  companyBuildingNo?: string;
  companyHouseNo?: string;
  companyPostcode?: string;
  companyCity?: string;
  companyBankAccount?: string;
  defaultAddress?: boolean;
}

const billings = ref<Billing[]>([
  {
    id: 'dgjku7672',
    companyName: 'XNET Telefony komórkowe',
    companyStreet: 'Serwisowa',
    companyBuildingNo: '1',
    companyHouseNo: '15',
    companyPostcode: '26-600',
    companyCity: 'Radom',
    companyBankAccount: '26 7773 8888 7842 8343 3481 3413',
    defaultAddress: true
  },
  {
    id: 'fadsksag7',
    companyName: 'XNET Telefony komórkowe Oddział w Koluszkach',
    companyStreet: 'Józefa Grzecznarowskiego',
    companyBuildingNo: '12',
    companyHouseNo: '56',
    companyPostcode: '35-400',
    companyCity: 'Koluszki',
    companyBankAccount: '26 7773 8888 7842 8343 3481 3413',
    defaultAddress: false
  }
])

import { ref } from 'vue'
export default billings