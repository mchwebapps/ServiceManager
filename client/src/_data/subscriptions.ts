export class Subscription {
  id?: string;
  planId?: string;
  planName?: string;
  created?: string;
  startDate?: string;
  endDate?: string;
  nextPaymentDate?: string;
  organizationName?: string;
  organizationOwnerEmail?: string;
  organizationId?: string;
}

const subscriptions = ref<Subscription[]>([
  {
    id: 'jh276f9d',
    planId: 'j2ir9983',
    planName: 'Podstawowy',
    created: '2022-05-05',
    startDate: '2022-05-05',
    endDate: '2022-06-05',
    nextPaymentDate: '2022-06-01',
    organizationName: 'Izabela Brzozowska-Świątek',
    organizationOwnerEmail: 'ibs@poczta.onet.pl',
    organizationId: 'jhashf98'
  }
])

import { ref } from 'vue'
export default subscriptions
