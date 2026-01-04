<script setup>
import { axios } from '@/Core';
import { onMounted, ref } from 'vue';
import { Attachments, Loading, ViewCustomFields } from '@/Components/Common';

const props = defineProps(['current', 'custom_fields', 'editRow', 'force']);

const loading = ref(true);
const expense = ref(null);

onMounted(async () => {
  await axios
    .get(
      props.force
        ? route('expenses.report.show', { id: props.current.id })
        : route('expenses.show', { expense: props.current.id, json: true })
    )
    .then(res => {
      expense.value = res.data;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
});

function print() {
  window.print();
}
</script>

<template>
  <div v-if="loading" class="relative h-64">
    <Loading />
  </div>
  <template v-else-if="expense">
    <span class="absolute top-4 right-12 inline-flex items-center gap-x-4 sm:right-14 print:hidden">
      <button type="button" @click="print" class="link -m-2 p-2">
        <Icon name="print-o" class="size-5" />
      </button>
      <button type="button" @click="() => editRow(expense)" class="link -m-2 p-2">
        <Icon name="edit-o" class="size-5" />
      </button>
    </span>

    <div class="border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700 print:hidden">
      <div class="sm:flex sm:items-baseline sm:justify-between">
        <div class="sm:w-0 sm:flex-1">
          <h1 class="text-focus text-base font-semibold">{{ $t('Expense') }} #{{ expense?.id }} ({{ expense?.reference }})</h1>
          <p class="text-mute mt-1 truncate text-sm">
            {{ $t('Please view the details below') }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 px-6 py-4 text-gray-600 dark:text-gray-400 print:m-0 print:py-0">
      <div class="mb-1 max-h-16 max-w-[250px]">
        <img v-if="expense.store.logo" class="h-16 max-w-full" :src="expense.store.logo" :alt="expense.store.name" />
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
          <!-- <img v-if="expense.store.logo" class="h-8 max-w-[200pc]" :src="expense.store.logo" alt="Logo" /> -->
          <div class="text-lg font-semibold">{{ expense.store.name }}</div>
          <div class="text-sm">{{ $address(expense.store) }}</div>
          <div class="text-sm" v-if="expense.store.phone">{{ $t('Phone') }}: {{ expense.store.phone }}</div>
          <div class="text-sm" v-if="expense.store.email">{{ $t('Email') }}: {{ expense.store.email }}</div>
        </div>
        <div class="w-2/5">
          <div class="mb-1 text-lg font-extrabold uppercase">{{ $t('Expense') }}</div>
          <div class="text-sm">{{ $t('Expense No. {x}', { x: expense?.id }) }}</div>
          <div class="text-sm">{{ $t('Date') }}: {{ $date(expense.date) }}</div>
          <div class="text-sm">{{ $t('Created at') }}: {{ $datetime(expense.created_at) }}</div>
          <div class="flex gap-1 text-sm">
            {{ $t('Reference') }}:
            <p class="truncate hover:text-clip print:block print:text-clip" dir="rtl">{{ expense.reference }}</p>
          </div>
        </div>
      </div>

      <div v-if="expense.supplier" class="pb-8">
        <h2 class="mb-1 text-xs font-bold">{{ $t('Order To') }}</h2>
        <div class="text-lg font-semibold">{{ expense.supplier.company || expense.supplier.name }}</div>
        <div class="text-sm">{{ $address(expense.supplier) }}</div>
        <div class="text-sm" v-if="expense.supplier.phone">{{ $t('Phone') }}: {{ expense.supplier.phone }}</div>
        <div class="text-sm" v-if="expense.supplier.email">{{ $t('Email') }}: {{ expense.supplier.email }}</div>
      </div>

      <div class="rounded-md border border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-950">
        <div class="flex items-center justify-between text-lg font-bold">
          {{ $t('Amount') }}: <span>{{ $currency(expense.amount) }}</span>
        </div>
        <div class="mt-2">{{ $t('By') }}: {{ expense.user?.name }}</div>
      </div>

      <ViewCustomFields :modal="false" :fields="custom_fields" :title="$t('Custom Fields')" :extra_attributes="expense.extra_attributes" />

      <div v-if="expense.details" class="mb-4 pt-8">
        {{ expense.details }}
      </div>

      <div v-if="expense.attachments && expense.attachments.length" class="mt-8 w-full py-2 print:hidden">
        <Attachments :attachments="expense.attachments" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="flex min-h-64 items-center justify-center p-6 text-lg font-thin">
      {{ $t('No data found, the record might not belong to the selected store.') }}
    </div>
  </template>
</template>
