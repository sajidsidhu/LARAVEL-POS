<script setup>
import dayjs from 'dayjs';
import { usePage } from '@inertiajs/vue3';
import { onMounted, ref, watch } from 'vue';

import { $random } from '@/Core';
import { Modal } from '@/Components/Jet';
import { Input, LoadingButton } from '@/Components/Common';

const page = usePage();
const props = defineProps(['show']);
const emit = defineEmits(['close', 'showOpenOrders', 'viewRegisterDetails']);

const details = ref({});
const loading = ref(false);
const reference = ref(null);

watch(
  () => props.show,
  value => {
    if (value) {
      reference.value = getNewReference();
    }
  }
);

onMounted(() => {
  reference.value = getNewReference();
});

function getNewReference() {
  let no = localStorage.getItem('pos_order_number');
  if (!no) {
    no = 1;
    localStorage.setItem('pos_order_number', no);
  }

  return 'Order ' + dayjs().format('M.D') + '.' + (no < 10 ? '00' + no : no < 100 ? '0' + no : no).toString();
}

async function openOrderNow() {
  loading.value = true;

  if (reference.value) {
    details.value.tendered = 0;
    details.value.discount = 0;
    details.value.reference = reference.value;
    details.value.user_id = page.props.auth.user.id;
    details.value.customer_id = page.props.settings.default_customer;
    details.value.payments = [{ amount: null, method: 'Cash', method_data: {} }];
    details.value.number = dayjs().format('YYMD') + '-' + String($random(0, 9999)).padStart(4, '0');
    const no = localStorage.getItem('pos_order_number');
    localStorage.setItem('pos_order_number', Number(no) + 1);
    emit('close', details.value);
  }
  loading.value = false;
}
</script>

<template>
  <Modal :show="show" maxWidth="sm" :closeable="true" @close="emit('close')">
    <div class="print:hidden">
      <div class="border-b border-gray-200 p-4 sm:px-6 dark:border-gray-700">
        <h3 class="text-base leading-6 font-semibold text-gray-900 dark:text-gray-100">
          {{ $t('Open New Order') }}
        </h3>
        <p class="mt-1 text-sm">{{ $t('Please type the reference to open form.') }}</p>
      </div>

      <div class="rounded-b-lg bg-gray-100 p-6 dark:bg-gray-800">
        <form @submit.prevent="openOrderNow" autocomplete="off" class="flex flex-col items-stretch gap-4">
          <Input keyboard v-model="reference" id="order-reference" />
          <LoadingButton class="justify-center" :loading="loading">{{ $t('Open') }}</LoadingButton>
        </form>
        <div class="mt-6 grid grid-cols-2 gap-2">
          <button type="button" @click="emit('showOpenOrders')" class="btn-secondary justify-center">
            {{ $t('Opened Orders') }}
          </button>
          <button type="button" @click="emit('viewRegisterDetails')" class="btn-secondary justify-center">
            {{ $t('Register Details') }}
          </button>
          <Link :href="route('dashboard')" class="btn-secondary justify-center">
            {{ $t('Dashboard') }}
          </Link>
          <Link :href="route('sales.index')" class="btn-secondary justify-center">
            {{ $t('List Sales') }}
          </Link>
        </div>
      </div>
    </div>
  </Modal>
</template>
