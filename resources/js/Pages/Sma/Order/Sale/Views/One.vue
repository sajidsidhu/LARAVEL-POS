<script setup>
import { usePage } from '@inertiajs/vue3';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { nextTick, onMounted, ref } from 'vue';

import { Loading, ViewCustomFields } from '@/Components/Common';
import { Modal } from '@/Components/Jet';
import { axios } from '@/Core';

import PackingList from './PackingList.vue';

const page = usePage();
const props = defineProps(['current', 'custom_fields', 'editRow', 'xfetch', 'force']);

const colspan = ref(4);
const sale = ref(null);
const qrcode = ref(null);
const loading = ref(true);
const packing = ref(false);

onMounted(async () => {
  if (props.xfetch) {
    sale.value = props.current;
    loading.value = false;
  } else {
    await axios
      .get(props.force ? route('sales.report.show', { id: props.current.id }) : route('sales.show', { sale: props.current.id, json: true }))
      .then(async res => {
        sale.value = res.data;
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

  await nextTick();
  qrcode.value = await generateQR(route('sale.url', { id: sale.value.id, hash: sale.value.hash || 'hash' }));
  JsBarcode('.barcode').init();
});

async function generateQR(text) {
  try {
    return await QRCode.toString(text, { type: 'svg' });
  } catch (err) {
    console.error(err);
    return `<span class="text-red-500">${err.toString()}</span>`;
  }
}

function print() {
  window.print();
}
</script>

<template>
  <div v-if="loading" class="relative h-64">
    <Loading />
  </div>
  <template v-else-if="sale">
    <template v-if="!xfetch">
      <span class="absolute top-4 right-12 inline-flex items-center gap-x-4 sm:right-14 print:hidden">
        <button type="button" @click="print" class="link -m-2 p-2">
          <Icon name="print-o" class="size-5" />
        </button>
        <button type="button" @click="packing = true" class="link -m-2 p-2">
          <Icon name="archive" class="size-5" />
        </button>
        <button v-if="editRow && $can('update-sales')" type="button" @click="() => editRow(sale)" class="link -m-2 p-2">
          <Icon name="edit-o" class="size-5" />
        </button>
      </span>

      <div class="border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700 print:hidden">
        <div class="sm:flex sm:items-baseline sm:justify-between">
          <div class="sm:w-0 sm:flex-1">
            <h1 class="text-focus text-base font-semibold">{{ $t('Sale') }} #{{ sale?.id }} ({{ sale?.reference }})</h1>
            <p class="text-mute mt-1 truncate text-sm">
              {{ $t('Please view the details below') }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="mt-4 px-6 py-4 print:m-0 print:py-0">
      <div v-if="sale.shop == 1 && $page.props.auth.user?.employee" class="col-span-full pb-6 print:hidden">
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
                {{ $t('This sale was added from shop module') }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-1 max-h-16 max-w-[250px]">
        <img v-if="sale.store.logo" class="h-16 max-w-full" :src="sale.store.logo" :alt="sale.store.name" />
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
          <div class="text-lg font-semibold">{{ sale.store.name }}</div>
          <div class="text-sm">{{ $address(sale.store) }}</div>
          <div class="text-sm" v-if="sale.store.phone">{{ $t('Phone') }}: {{ sale.store.phone }}</div>
          <div class="text-sm" v-if="sale.store.email">{{ $t('Email') }}: {{ sale.store.email }}</div>
        </div>
        <div class="w-2/5">
          <div class="mb-1 text-lg font-extrabold uppercase">{{ $t('Sale') }}</div>
          <div class="text-sm">{{ $t('Sale No. {x}', { x: sale?.id }) }}</div>
          <div class="text-sm">{{ $t('Date') }}: {{ $date(sale.date) }}</div>
          <div class="text-sm">{{ $t('Created at') }}: {{ $datetime(sale.created_at) }}</div>
          <div class="flex gap-1 text-sm">
            {{ $t('Reference') }}:
            <p class="truncate hover:text-clip print:block print:text-clip" dir="rtl">{{ sale.reference }}</p>
          </div>
          <div v-if="sale.due_date" class="text-sm">{{ $t('Due Date') }}: {{ $date(sale.due_date) }}</div>
        </div>
      </div>

      <div class="col-span-full pb-8" v-if="sale.return_orders_count > 0">
        <a
          :href="route('return_orders.index', { filters: { sale_id: sale.id } })"
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
                  $t('This sale has {x}', {
                    x: sale.return_orders_count == 1 ? '1 ' + $t('return order') : sale.return_orders_count + ' ' + $t('return orders'),
                  })
                }}
              </h3>
            </div>
          </div>
        </a>
      </div>

      <!-- barcodes -->
      <div class="flex items-center justify-center gap-6">
        <div class="bc-image h-[80px] overflow-hidden rounded">
          <svg
            class="barcode"
            :jsbarcode-width="1"
            :jsbarcode-margin="5"
            :jsbarcode-height="70"
            :jsbarcode-fontsize="12"
            :jsbarcode-textmargin="3"
            jsbarcode-format="CODE128"
            jsbarcode-fontoptions="bold"
            :jsbarcode-displayvalue="false"
            :jsbarcode-value="sale.reference"
          />
        </div>
        <div v-html="qrcode" class="qr-image qrcode h-[80px] overflow-hidden rounded" />
      </div>

      <div class="flex w-full gap-6 py-6">
        <div class="">
          <h2 class="mb-1 text-xs font-bold">{{ $t('Sell To') }}</h2>
          <div class="text-lg font-semibold">{{ sale.customer.company || sale.customer.name }}</div>
          <div class="text-sm">{{ $address(sale.customer) }}</div>
          <div class="text-sm" v-if="sale.customer.phone">{{ $t('Phone') }}: {{ sale.customer.phone }}</div>
          <div class="text-sm" v-if="sale.customer.email">{{ $t('Email') }}: {{ sale.customer.email }}</div>
        </div>
        <div v-if="sale.address">
          <h2 class="mb-1 text-xs font-bold">{{ $t('Ship To') }}</h2>
          <div class="text-lg font-semibold">{{ sale.address.company || sale.address.name }}</div>
          <div class="text-sm">{{ $address(sale.address) }}</div>
          <div class="text-sm" v-if="sale.address.phone">{{ $t('Phone') }}: {{ sale.address.phone }}</div>
          <div class="text-sm" v-if="sale.address.email">{{ $t('Email') }}: {{ sale.address.email }}</div>
        </div>
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

          <template v-for="(item, index) in sale.items" :key="item.id">
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
                      <div>
                        {{ item.product.name }}
                        <div v-if="item.comment" class="text-xs">{{ item.comment }}</div>
                      </div>
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
                      <div>
                        {{ item.product.name }}
                        <div v-if="item.comment" class="text-xs">{{ item.comment }}</div>
                      </div>
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
          <tfoot class="break-inside-avoid divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="page.props.settings.show_tax == 1">
              <th colspan="3" class="p-2 text-right text-lg font-bold">{{ $t('Total') }}</th>
              <th class="p-2 text-right text-lg font-bold">
                <!-- {{ sale.items.length }} -->
                {{ $decimal_qty(sale.items.reduce((a, i) => Number(i.quantity) + a, 0)) }}
              </th>
              <th v-if="page.props.settings.show_discount == 1" class="p-2 text-right text-lg font-bold">
                {{ $currency(sale.total_discount_amount) }}
              </th>
              <th v-if="page.props.settings.show_tax == 1" class="p-2 text-right text-lg font-bold">
                {{ $currency(sale.total_tax_amount) }}
              </th>
              <th class="p-2 text-right text-lg font-bold">{{ $currency(sale.total) }}</th>
            </tr>
            <template v-else>
              <template v-if="page.props.settings.show_discount == 1 && Number(sale.total_discount_amount) > 0">
                <tr>
                  <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Discount') }}</th>
                  <th class="p-2 text-right text-lg font-bold">
                    {{ $currency(sale.total_discount_amount) }}
                  </th>
                </tr>
              </template>
              <template v-if="$decimal(sale.total_tax_amount, true) > 0">
                <tr>
                  <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Subtotal') }}</th>
                  <th class="p-2 text-right text-lg font-bold">
                    {{ $currency(sale.subtotal) }}
                  </th>
                </tr>
                <tr>
                  <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Tax') }}</th>
                  <th class="p-2 text-right text-lg font-bold">
                    {{ $currency(sale.total_tax_amount) }}
                  </th>
                </tr>
              </template>
              <template v-else-if="page.props.settings.show_zero_taxes == 1">
                <tr>
                  <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Tax') }}</th>
                  <th class="p-2 text-right text-lg font-bold">
                    {{ $currency(sale.total_tax_amount) }}
                  </th>
                </tr>
              </template>
              <tr>
                <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Total') }}</th>
                <th class="p-2 text-right text-lg font-bold">
                  {{ $currency(sale.grand_total) }}
                </th>
              </tr>
              <tr>
                <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Paid') }}</th>
                <th class="p-2 text-right text-lg font-bold">
                  {{ $currency(sale.paid) }}
                </th>
              </tr>
              <tr>
                <th :colspan="colspan" class="p-2 text-right text-lg font-bold">{{ $t('Balance') }}</th>
                <th class="p-2 text-right text-lg font-bold">
                  {{ $currency(sale.grand_total - sale.paid) }}
                </th>
              </tr>
            </template>
          </tfoot>
        </table>
      </div>

      <ViewCustomFields :modal="false" :fields="custom_fields" :title="$t('Custom Fields')" :extra_attributes="sale.extra_attributes" />

      <div v-if="sale.details" class="mb-4 pt-8">
        {{ sale.details }}
      </div>

      <div v-if="sale.attachments && sale.attachments.length" class="mt-8 w-full py-2 print:hidden">
        <Attachments :attachments="sale.attachments" />
      </div>
    </div>

    <div v-if="sale.payments && sale.payments.length" class="mx-6 mb-6 rounded-sm border border-gray-200 dark:border-gray-700 print:hidden">
      <h4 class="border-b border-gray-200 px-4 py-2 text-base font-extrabold dark:border-gray-700">{{ $t('Payments') }}</h4>
      <div class="overflow-x-auto py-1">
        <table class="w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
          <thead>
            <tr>
              <th class="w-[140px] p-2 text-left font-bold uppercase">{{ $t('Date') }}</th>
              <th class="p-2 text-left font-bold uppercase">{{ $t('Reference') }}</th>
              <th class="w-[100px] p-2 text-left font-bold uppercase">{{ $t('Method') }}</th>
              <th class="w-[120px] p-2 text-center font-bold uppercase">{{ $t('Amount') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in sale.payments" :key="p.id">
              <td class="p-2 whitespace-nowrap">{{ $date(p.date) }}</td>
              <td class="p-2">{{ p.reference }}</td>
              <td class="p-2 whitespace-nowrap">{{ $t(p.method) }}</td>
              <td class="p-2 text-right">{{ $currency(p.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Modal :show="packing" max-width="2xl" @close="packing = false" class="modal-2">
      <PackingList :sale="sale" />
    </Modal>
  </template>
  <template v-else>
    <div class="flex min-h-64 items-center justify-center p-6 text-lg font-thin">
      {{ $t('No data found, the record might not belong to the selected store.') }}
    </div>
  </template>
</template>
