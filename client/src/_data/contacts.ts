export class Contact {
  id?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  defaultContact?: boolean;
}

const contacts = ref<Contact[]>([
  {
    id: 'dgjku7672',
    firstName: 'Piotr',
    lastName: 'Bińko',
    phone: '722020202',
    email: 'binkopiotr@gmail.com',
    defaultContact: true
  },
  {
    id: 'fadsksag7',
    firstName: 'Maciej',
    lastName: 'Kaniowski',
    phone: '501747804',
    email: 'maciejkaniowski@gmail.com',
    defaultContact: false
  }
])

import { ref } from 'vue'
export default contacts