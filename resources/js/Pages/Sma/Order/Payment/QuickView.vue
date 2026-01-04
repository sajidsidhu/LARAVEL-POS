<script setup>
import { axios } from '@/Core';
import { onMounted, ref } from 'vue';
import { Attachments, Loading, ViewCustomFields } from '@/Components/Common';

const props = defineProps(['current', 'custom_fields', 'editRow', 'xfetch', 'force']);

const loading = ref(true);
const payment = ref(null);

onMounted(async () => {
  if (props.xfetch) {
    payment.value = props.current;
    loading.value = false;
  } else {
    await axios
      .get(
        props.force
          ? route('payments.report.show', { id: props.current.id })
          : route('payments.show', { payment: props.current.id, json: true })
      )
      .then(res => {
        payment.value = res.data;
        loading.value = false;
      })
      .catch(() => (loading.value = false));
  }
});

function print() {
  window.print();
}
</script>

<template>
  <div v-if="loading" class="relative h-64">
    <Loading />
  </div>
  <template v-else-if="payment">
    <template v-if="!xfetch">
      <span class="absolute top-4 right-12 inline-flex items-center gap-x-4 sm:right-14 print:hidden">
        <button type="button" @click="print" class="link -m-2 p-2">
          <Icon name="print-o" class="size-5" />
        </button>
        <button v-if="$can('update-payments')" type="button" @click="() => editRow(payment)" class="link -m-2 p-2">
          <Icon name="edit-o" class="size-5" />
        </button>
      </span>

      <div class="border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700 print:hidden">
        <div class="sm:flex sm:items-baseline sm:justify-between">
          <div class="sm:w-0 sm:flex-1">
            <h1 class="text-focus text-base font-semibold">{{ $t('Payment') }} #{{ payment?.id }} ({{ payment?.reference }})</h1>
            <p class="text-mute mt-1 truncate text-sm">
              {{ $t('Please view the details below') }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="mt-4 px-6 py-4 text-gray-600 dark:text-gray-400 print:m-0 print:py-0">
      <div v-if="payment.received != 1" class="col-span-full pb-6">
        <div
          class="block rounded-md border border-yellow-700 bg-yellow-50 px-4 py-2.5 dark:bg-yellow-800 print:border print:border-yellow-700"
        >
          <div class="flex">
            <div class="shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {{ $t('This payment is not yet received') }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-1 max-h-16 max-w-[250px]">
        <img v-if="payment.store.logo" class="h-16 max-w-full" :src="payment.store.logo" :alt="payment.store.name" />
        <template v-else>
          <img
            v-if="$page.props.settings?.logo"
            :src="$page.props.settings?.logo"
            :alt="$page.props.settings?.name"
            class="h-16 max-w-full dark:hidden print:block!"
          />
          <img
            :alt="$page.props.settings?.name"
            v-if="$page.props.settings?.logo_dark"
            :src="$page.props.settings?.logo_dark"
            class="hidden h-16 max-w-full dark:block print:hidden!"
          />
        </template>
      </div>
      <div v-if="payment.store" class="mb-8 flex items-start justify-between gap-3">
        <div class="flex w-3/5 flex-col">
          <div class="text-lg font-semibold">{{ payment.store.name }}</div>
          <div class="text-sm">{{ $address(payment.store) }}</div>
          <div class="text-sm" v-if="payment.store.phone">{{ $t('Phone') }}: {{ payment.store.phone }}</div>
          <div class="text-sm" v-if="payment.store.email">{{ $t('Email') }}: {{ payment.store.email }}</div>
        </div>
        <div class="w-2/5">
          <div class="mb-1 text-lg font-extrabold uppercase">{{ payment.received ? $t('Payment Receipt') : $t('Payment Request') }}</div>
          <div class="text-sm">{{ $t('Payment No. {x}', { x: payment?.id }) }}</div>
          <div v-if="payment?.sale_id" class="text-sm">{{ $t('Sale No. {x}', { x: payment.sale_id }) }}</div>
          <div class="text-sm">{{ $t('Date') }}: {{ $date(payment.date) }}</div>
          <div class="text-sm">{{ $t('Created at') }}: {{ $datetime(payment.created_at) }}</div>
          <div class="flex gap-1 text-sm">
            {{ $t('Reference') }}:
            <p class="truncate hover:text-clip print:block print:text-clip" dir="rtl">{{ payment.reference }}</p>
          </div>
        </div>
      </div>

      <div v-if="payment.payment_for == 'Customer' && payment.customer" class="pb-8">
        <h2 class="mb-1 text-xs font-bold">{{ $t('From') }}</h2>
        <div class="text-lg font-semibold">{{ payment.customer.company || payment.customer.name }}</div>
        <div class="text-sm">{{ $address(payment.customer) }}</div>
        <div class="text-sm" v-if="payment.customer.phone">{{ $t('Phone') }}: {{ payment.customer.phone }}</div>
        <div class="text-sm" v-if="payment.customer.email">{{ $t('Email') }}: {{ payment.customer.email }}</div>
      </div>
      <div v-if="payment.payment_for == 'Supplier' && payment.supplier" class="pb-8">
        <h2 class="mb-1 text-xs font-bold">{{ $t('To') }}</h2>
        <div class="text-lg font-semibold">{{ payment.supplier.company || payment.supplier.name }}</div>
        <div class="text-sm">{{ $address(payment.supplier) }}</div>
        <div class="text-sm" v-if="payment.supplier.phone">{{ $t('Phone') }}: {{ payment.supplier.phone }}</div>
        <div class="text-sm" v-if="payment.supplier.email">{{ $t('Email') }}: {{ payment.supplier.email }}</div>
      </div>

      <div class="rounded-md border border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-950">
        <div class="flex items-center justify-between text-lg font-bold">
          {{ $t('Amount') }}: <span>{{ $currency(payment.amount) }}</span>
        </div>
        <div v-if="payment.method" class="mt-3 flex items-center justify-start gap-1">
          {{ $t('Method') }}:
          <div class="font-bold">
            {{ $t(payment.method) }}
          </div>
        </div>
        <div v-if="payment.method_data && Object.keys(payment.method_data).length" class="mt-2 flex items-center justify-start gap-1">
          <!-- {{ $t('Method Details') }}: -->

          <div class="capitalize">
            {{
              payment.method_data && Object.keys(payment.method_data)
                ? Object.keys(payment.method_data)
                    .map(k => $t(k.replaceAll('_', ' ')) + ': ' + payment.method_data[k])
                    .join(', ')
                : ''
            }}
          </div>
        </div>
      </div>

      <ViewCustomFields :modal="false" :fields="custom_fields" :title="$t('Custom Fields')" :extra_attributes="payment.extra_attributes" />

      <div v-if="payment.details" class="mb-4 pt-8">
        {{ payment.details }}
      </div>

      <!-- <div class="mt-2">{{ $t('By') }}: {{ payment.user?.name }}</div> -->

      <div v-if="payment.attachments && payment.attachments.length" class="mt-8 w-full py-2 print:hidden">
        <Attachments :attachments="payment.attachments" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="flex min-h-64 items-center justify-center p-6 text-lg font-thin">
      {{ $t('No data found, the record might not belong to the selected store.') }}
    </div>
  </template>
</template>
