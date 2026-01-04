<script setup>
import { axios } from '@/Core';
import { onMounted, ref } from 'vue';
import { Attachments, Loading, ViewCustomFields } from '@/Components/Common';

const props = defineProps(['current', 'custom_fields', 'editRow', 'xfetch']);

const loading = ref(true);
const delivery = ref(null);

onMounted(async () => {
  if (props.xfetch) {
    delivery.value = props.current;
    loading.value = false;
  } else {
    await axios
      .get(route('deliveries.show', { delivery: props.current.id, json: true }))
      .then(res => {
        delivery.value = res.data;
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
  <template v-else-if="delivery">
    <template v-if="!xfetch">
      <span class="absolute top-4 right-12 inline-flex items-center gap-x-4 sm:right-14 print:hidden">
        <button type="button" @click="print" class="link -m-2 p-2">
          <Icon name="print-o" class="size-5" />
        </button>
        <button type="button" v-if="editRow" @click="() => editRow(delivery)" class="link -m-2 p-2">
          <Icon name="edit-o" class="size-5" />
        </button>
      </span>

      <div class="border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700 print:hidden">
        <div class="sm:flex sm:items-baseline sm:justify-between">
          <div class="sm:w-0 sm:flex-1">
            <h1 class="text-focus text-base font-semibold">{{ $t('Delivery') }} #{{ delivery?.id }} ({{ delivery?.reference }})</h1>
            <p class="text-mute mt-1 truncate text-sm">
              {{ $t('Please view the details below') }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="mt-4 px-6 py-4 text-gray-600 dark:text-gray-400 print:m-0 print:py-0">
      <div class="mb-1 max-h-16 max-w-[250px]">
        <img v-if="delivery.store.logo" class="h-16 max-w-full" :src="delivery.store.logo" :alt="delivery.store.name" />
        <template v-else>
          <img
            :alt="$page.props.settings?.name"
            :src="$page.props.settings?.logo"
            v-if="$page.props.settings?.logo"
            class="h-16 max-w-full dark:hidden print:block!"
          />
          <img
            :alt="$page.props.settings?.name"
            :src="$page.props.settings?.logo_dark"
            v-if="$page.props.settings?.logo_dark"
            class="hidden h-16 max-w-full dark:block print:hidden!"
          />
        </template>
      </div>
      <div class="mb-8 flex items-start justify-between gap-3">
        <div class="flex w-3/5 flex-col">
          <div class="text-lg font-semibold">{{ delivery.store.name }}</div>
          <div class="text-sm">{{ $address(delivery.store) }}</div>
          <div class="text-sm" v-if="delivery.store.phone">{{ $t('Phone') }}: {{ delivery.store.phone }}</div>
          <div class="text-sm" v-if="delivery.store.email">{{ $t('Email') }}: {{ delivery.store.email }}</div>
        </div>
        <div class="w-2/5">
          <div class="mb-1 text-lg font-extrabold uppercase">{{ $t('Delivery') }}</div>
          <div class="text-sm">{{ $t('Delivery Order No. {x}', { x: delivery?.id }) }}</div>
          <div class="text-sm">{{ $t('Date') }}: {{ $date(delivery.date) }}</div>
          <div class="text-sm">{{ $t('Created at') }}: {{ $datetime(delivery.created_at) }}</div>
          <div class="flex gap-1 text-sm">
            {{ $t('Reference') }}:
            <p class="truncate hover:text-clip print:block print:text-clip" dir="rtl">{{ delivery.reference }}</p>
          </div>
          <div class="flex gap-1 text-sm">
            {{ $t('Sale Reference') }}:
            <p class="truncate hover:text-clip print:block print:text-clip" dir="rtl">{{ delivery.sale.reference }}</p>
          </div>
        </div>
      </div>

      <div v-if="delivery.customer" class="pb-8">
        <h2 class="mb-1 text-xs font-bold">{{ $t('Order To') }}</h2>
        <div class="text-lg font-semibold">{{ delivery.customer.company || delivery.customer.name }}</div>
        <div class="text-sm">{{ $address(delivery.customer) }}</div>
        <div class="text-sm" v-if="delivery.customer.phone">{{ $t('Phone') }}: {{ delivery.customer.phone }}</div>
        <div class="text-sm" v-if="delivery.customer.email">{{ $t('Email') }}: {{ delivery.customer.email }}</div>
      </div>

      <div class="rounded-md border border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-950">
        <div class="flex gap-1 text-lg">
          {{ $t('Address') }}: <span class="font-bold">{{ $address(delivery.address) }}</span>
        </div>
        <template v-if="delivery.delivered_at">
          <div class="mt-1">
            {{ $t('Delivered at') }}: <span class="font-bold">{{ $datetime(delivery.delivered_at) }}</span>
          </div>
          <div class="mt-1">
            {{ $t('Delivered by') }}: <span class="font-bold">{{ delivery.delivered_by || '' }}</span>
          </div>
          <div class="mt-1">
            {{ $t('Received by') }}: <span class="font-bold">{{ delivery.received_by || '' }}</span>
          </div>
        </template>
      </div>
      <!-- <div class="mt-2">{{ $t('By') }}: {{ delivery.user?.name }}</div> -->

      <ViewCustomFields :modal="false" :fields="custom_fields" :title="$t('Custom Fields')" :extra_attributes="delivery.extra_attributes" />

      <div v-if="delivery.details" class="mb-4 pt-8">
        {{ delivery.details }}
      </div>

      <div v-if="delivery.attachments && delivery.attachments.length" class="mt-8 w-full py-2 print:hidden">
        <Attachments :attachments="delivery.attachments" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="flex min-h-64 items-center justify-center p-6 text-lg font-thin">
      {{ $t('No data found, the record might not belong to the selected store.') }}
    </div>
  </template>
</template>
