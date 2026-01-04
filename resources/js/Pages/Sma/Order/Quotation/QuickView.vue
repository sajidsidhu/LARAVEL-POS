<script setup>
import { axios } from '@/Core';
import { onMounted, ref } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { Loading, ViewCustomFields } from '@/Components/Common';

const page = usePage();
const props = defineProps(['current', 'custom_fields', 'editRow', 'xfetch']);

const colspan = ref(4);
const loading = ref(true);
const quotation = ref(null);

onMounted(async () => {
  if (props.xfetch) {
    quotation.value = props.current;
    loading.value = false;
  } else {
    await axios
      .get(route('quotations.show', { quotation: props.current.id, json: true }))
      .then(res => {
        quotation.value = res.data;
        loading.value = false;
      })
      .catch(() => (loading.value = false));
  }
  if (page.props.settings.show_discount == 1) {
    colspan.value++;
  }
  if (page.props.settings.show_tax == 1) {
    colspan.value++;
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
  <template v-else-if="quotation">
    <template v-if="!xfetch">
      <span class="absolute top-4 right-12 inline-flex items-center gap-x-4 sm:right-14 print:hidden">
        <button type="button" @click="print" class="link -m-2 p-2">
          <Icon name="print-o" class="size-5" />
        </button>
        <button v-if="$can('update-quotations')" type="button" @click="() => editRow(quotation)" class="link -m-2 p-2">
          <Icon name="edit-o" class="size-5" />
        </button>
      </span>

      <div class="border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700 print:hidden">
        <div class="sm:flex sm:items-baseline sm:justify-between">
          <div class="sm:w-0 sm:flex-1">
            <h1 class="text-focus text-base font-semibold">{{ $t('Quotation') }} #{{ quotation?.id }} ({{ quotation?.reference }})</h1>
            <p class="text-mute mt-1 truncate text-sm">
              {{ $t('Please view the details below') }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="mt-4 px-6 py-4 print:m-0 print:py-0">
      <div class="mb-1 max-h-16 max-w-[250px]">
        <img v-if="quotation.store.logo" class="h-16 max-w-full" :src="quotation.store.logo" :alt="quotation.store.name" />
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
          <div class="text-lg font-semibold">{{ quotation.store.name }}</div>
          <div class="text-sm">{{ $address(quotation.store) }}</div>
          <div class="text-sm" v-if="quotation.store.phone">{{ $t('Phone') }}: {{ quotation.store.phone }}</div>
          <div class="text-sm" v-if="quotation.store.email">{{ $t('Email') }}: {{ quotation.store.email }}</div>
        </div>
        <div class="w-2/5">
          <div class="mb-1 text-lg font-extrabold uppercase">{{ $t('Quotation') }}</div>
          <div class="text-sm">{{ $t('Quotation No. {x}', { x: quotation?.id }) }}</div>
          <div class="text-sm">{{ $t('Date') }}: {{ $date(quotation.date) }}</div>
          <div class="text-sm">{{ $t('Created at') }}: {{ $datetime(quotation.created_at) }}</div>
          <div class="flex gap-1 text-sm">
            {{ $t('Reference') }}:
            <p class="truncate hover:text-clip print:block print:text-clip" dir="rtl">{{ quotation.reference }}</p>
          </div>
        </div>
      </div>

      <div class="col-span-full pb-8" v-if="quotation.return_orders_count > 0">
        <a
          :href="route('return_orders.index', { filters: { quotation_id: quotation.id } })"
          class="block rounded-md bg-red-50 p-4 dark:bg-red-800 print:border print:border-red-700"
        >
          <div class="flex">
            <div class="shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                {{
                  $t('This quotation has {x}', {
                    x:
                      quotation.return_orders_count == 1
                        ? '1 ' + $t('return order')
                        : quotation.return_orders_count + ' ' + $t('return orders'),
                  })
                }}
              </h3>
            </div>
          </div>
        </a>
      </div>

      <div class="pb-8">
        <h2 class="mb-1 text-xs font-bold">{{ $t('Quote To') }}</h2>
        <div class="text-lg font-semibold">{{ quotation.customer.company || quotation.customer.name }}</div>
        <div class="text-sm">{{ $address(quotation.customer) }}</div>
        <div class="text-sm" v-if="quotation.customer.phone">{{ $t('Phone') }}: {{ quotation.customer.phone }}</div>
        <div class="text-sm" v-if="quotation.customer.email">{{ $t('Email') }}: {{ quotation.customer.email }}</div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 dark:divide-gray-700 print:divide-gray-400 dark:print:divide-gray-400">
          <thead>
            <tr>
              <th class="w-7 p-2 text-center font-bold uppercase">#</th>
              <th class="p-2 text-left font-bold uppercase">{{ $t('Description') }}</th>
              <th class="w-[120px] p-2 text-center font-bold whitespace-nowrap uppercase">
                {{ page.props.settings.show_tax == 1 ? $t('Price') : $t('Unit Price') }}
              </th>
              <th class="w-[80px] p-2 text-center font-bold uppercase">{{ $t('Qty') }}</th>
              <th v-if="page.props.settings.show_discount == 1" class="w-[80px] p-2 text-center font-bold uppercase">
                {{ $t('Discount') }}
              </th>
              <th v-if="page.props.settings.show_tax == 1" class="w-[80px] p-2 text-center font-bold uppercase">{{ $t('Tax') }}</th>
              <th class="w-[120px] p-2 text-center font-bold uppercase">{{ $t('Total') }}</th>
            </tr>
          </thead>

          <template v-for="(item, index) in quotation.items" :key="item.id">
            <template v-if="item.variations && item.variations.length">
              <tbody>
                <tr>
                  <td class="w-7 p-2 text-right">{{ index + 1 }}</td>
                  <td class="px-2 py-1">
                    <div class="flex items-center gap-2">
                      <template v-if="page.props.settings.show_image == 1">
                        <template v-if="item.product.photo">
                          <img class="h-8 w-8 self-start rounded-xs" :src="item.product.photo" alt="Product Image" />
                        </template>
                        <template v-else>
                          <img class="mr-2 h-8 w-8 self-start rounded-xs" src="img/no-image.png" alt="No Image" />
                        </template>
                      </template>
                      {{ item.product.name }}
                    </div>
                  </td>
                  <td class="p-2"></td>
                  <td class="p-2 text-right">
                    <!-- {{ $number_qty(item.quantity) }} -->
                  </td>
                  <td v-if="page.props.settings.show_discount == 1" class="p-2 text-right"></td>
                  <td v-if="page.props.settings.show_tax == 1" class="p-2"></td>
                  <td class="p-2"></td>
                </tr>

                <tr v-for="variation in item.variations" :key="variation.id">
                  <td class="w-7"></td>
                  <td class="p-2">{{ $meta(variation.meta) }}</td>
                  <td class="p-2 text-right">
                    {{ $number(variation.pivot.price) }}
                    <!-- {{ page.props.settings.show_tax == 1 ? $number(variation.pivot.price) : $number(variation.pivot.unit_price) }} -->
                  </td>
                  <td class="p-2 text-right">
                    <div class="flex items-center justify-end">
                      {{ $number_qty(variation.pivot.quantity) }}{{ variation.pivot?.unit?.code || '' }}
                    </div>
                  </td>
                  <td v-if="page.props.settings.show_discount == 1" class="p-2 text-right">
                    {{ $number(variation.pivot.discount_amount) }}
                  </td>
                  <td v-if="page.props.settings.show_tax == 1" class="p-2 text-right">{{ $number(variation.pivot.tax_amount) }}</td>
                  <td class="p-2 text-right font-bold">{{ $number(variation.pivot.total) }}</td>
                </tr>
              </tbody>
            </template>
            <template v-else>
              <tbody
                class="divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-700 dark:border-gray-700 print:divide-gray-400 dark:print:divide-gray-400"
              >
                <tr>
                  <td class="w-7 p-2 text-right">{{ index + 1 }}</td>
                  <td class="px-2 py-1">
                    <div class="flex items-center gap-2">
                      <template v-if="page.props.settings.show_image == 1">
                        <template v-if="item.product.photo">
                          <img class="h-8 w-8 self-start rounded-xs" :src="item.product.photo" alt="Product Image" />
                        </template>
                        <template v-else>
                          <img class="mr-2 h-8 w-8 self-start rounded-xs" src="img/no-image.png" alt="No Image" />
                        </template>
                      </template>
                      {{ item.product.name }}
                    </div>
                  </td>
                  <td class="p-2 text-right">
                    {{ $number(item.price) }}
                    <!-- {{ page.props.settings.show_tax == 1 ? $number(item.price) : $number(item.unit_price) }} -->
                  </td>
                  <td class="p-2 text-right">
                    <div class="flex items-center justify-end">{{ $number_qty(item.quantity) }}{{ item.unit?.code || '' }}</div>
                  </td>
                  <td v-if="page.props.settings.show_discount == 1" class="p-2 text-right">{{ $number(item.discount_amount) }}</td>
                  <td v-if="page.props.settings.show_tax == 1" class="p-2 text-right">{{ $number(item.tax_amount) }}</td>
                  <td class="p-2 text-right font-bold">{{ $number(item.total) }}</td>
                </tr>
              </tbody>
            </template>
          </template>
          <tfoot class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="page.props.settings.show_tax == 1">
              <th colspan="3" class="p-2 text-right text-lg font-bold">{{ $t('Total') }}</th>
              <th class="p-2 text-right text-lg font-bold">
                <!-- {{ quotation.items.length }} -->
                {{ $decimal_qty(quotation.items.reduce((a, i) => Number(i.quantity) + a, 0)) }}
              </th>
              <th v-if="page.props.settings.show_discount == 1" class="p-2 text-right text-lg font-bold">
                {{ $currency(quotation.total_discount_amount) }}
              </th>
              <th v-if="page.props.settings.show_tax == 1" class="p-2 text-right text-lg font-bold">
                {{ $currency(quotation.total_tax_amount) }}
              </th>
              <th class="p-2 text-right text-lg font-bold">{{ $currency(quotation.total) }}</th>
            </tr>
            <template v-else>
              <template v-if="page.props.settings.show_discount == 1 && Number(quotation.total_discount_amount) > 0">
                <tr>
                  <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Discount') }}</th>
                  <th class="p-2 text-right text-lg font-bold">
                    {{ $currency(quotation.total_discount_amount) }}
                  </th>
                </tr>
              </template>
              <template v-if="$decimal(quotation.total_tax_amount, true) > 0">
                <tr>
                  <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Subtotal') }}</th>
                  <th class="p-2 text-right text-lg font-bold">
                    {{ $currency(quotation.subtotal) }}
                  </th>
                </tr>
                <tr>
                  <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Tax') }}</th>
                  <th class="p-2 text-right text-lg font-bold">
                    {{ $currency(quotation.total_tax_amount) }}
                  </th>
                </tr>
              </template>
              <template v-else-if="page.props.settings.show_zero_taxes == 1">
                <tr>
                  <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Tax') }}</th>
                  <th class="p-2 text-right text-lg font-bold">
                    {{ $currency(quotation.total_tax_amount) }}
                  </th>
                </tr>
              </template>
              <tr>
                <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Total') }}</th>
                <th class="p-2 text-right text-lg font-bold">
                  {{ $currency(quotation.grand_total) }}
                </th>
              </tr>
            </template>
          </tfoot>
        </table>
      </div>

      <ViewCustomFields
        :modal="false"
        :fields="custom_fields"
        :title="$t('Custom Fields')"
        :extra_attributes="quotation.extra_attributes"
      />

      <div v-if="quotation.details" class="mb-4 pt-8">
        {{ quotation.details }}
      </div>

      <div v-if="quotation.attachments && quotation.attachments.length" class="mt-8 w-full py-2 print:hidden">
        <Attachments :attachments="quotation.attachments" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="flex min-h-64 items-center justify-center p-6 text-lg font-thin">
      {{ $t('No data found, the record might not belong to the selected store.') }}
    </div>
  </template>
</template>
