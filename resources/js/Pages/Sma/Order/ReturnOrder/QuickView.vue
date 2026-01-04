<script setup>
import { axios } from '@/Core';
import { onMounted, ref } from 'vue';
import { Attachments, Loading, ViewCustomFields } from '@/Components/Common';

const props = defineProps(['current', 'custom_fields', 'editRow', 'xfetch']);

const loading = ref(true);
const return_order = ref(null);

onMounted(async () => {
  if (props.xfetch) {
    return_order.value = props.current;
    loading.value = false;
  } else {
    await axios
      .get(route('return_orders.show', { return_order: props.current.id, json: true }))
      .then(res => {
        return_order.value = res.data;
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
  <template v-else-if="return_order">
    <template v-if="!xfetch">
      <span class="absolute top-4 right-12 inline-flex items-center gap-x-4 sm:right-14 print:hidden">
        <button type="button" @click="print" class="link -m-2 p-2">
          <Icon name="print-o" class="size-5" />
        </button>
        <button v-if="$can('update-return-orders')" type="button" @click="() => editRow(return_order)" class="link -m-2 p-2">
          <Icon name="edit-o" class="size-5" />
        </button>
      </span>

      <div class="border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700 print:hidden">
        <div class="sm:flex sm:items-baseline sm:justify-between">
          <div class="sm:w-0 sm:flex-1">
            <h1 class="text-focus text-base font-semibold">
              {{ $t('Return Order') }} #{{ return_order?.id }} ({{ return_order?.reference }})
            </h1>
            <p class="text-mute mt-1 truncate text-sm">
              {{ $t('Please view the details below') }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="mt-4 px-6 py-4 print:m-0 print:py-0">
      <div class="mb-1 max-h-16 max-w-[250px]">
        <img v-if="return_order.store.logo" class="h-16 max-w-full" :src="return_order.store.logo" :alt="return_order.store.name" />
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
      <div class="mb-8 flex items-start justify-between gap-6">
        <div class="flex w-3/5 flex-col">
          <div class="text-lg font-semibold">{{ return_order.store.name }}</div>
          <div class="text-sm">{{ $address(return_order.store) }}</div>
          <div class="text-sm" v-if="return_order.store.phone">{{ $t('Phone') }}: {{ return_order.store.phone }}</div>
          <div class="text-sm" v-if="return_order.store.email">{{ $t('Email') }}: {{ return_order.store.email }}</div>
        </div>
        <div class="w-2/5">
          <div class="mb-1 text-lg font-extrabold uppercase">{{ $t('Return Order') }} ({{ return_order.type }})</div>
          <div class="text-sm">{{ $t('Return Order No. {x}', { x: return_order?.id }) }}</div>
          <div class="text-sm">{{ $t('Date') }}: {{ $date(return_order.date) }}</div>
          <div class="text-sm">{{ $t('Created at') }}: {{ $datetime(return_order.created_at) }}</div>
          <div class="flex gap-1 text-sm">
            {{ $t('Reference') }}:
            <p class="truncate hover:text-clip print:block print:text-clip" dir="rtl">{{ return_order.reference }}</p>
          </div>
        </div>
      </div>

      <div class="pb-8" v-if="return_order.type == 'Purchase'">
        <h2 class="mb-1 text-xs font-bold">{{ $t('Returned To') }}</h2>
        <div class="text-lg font-semibold">{{ return_order.supplier.company || return_order.supplier.name }}</div>
        <div class="text-sm">{{ $address(return_order.supplier) }}</div>
        <div class="text-sm" v-if="return_order.supplier.phone">{{ $t('Phone') }}: {{ return_order.supplier.phone }}</div>
        <div class="text-sm" v-if="return_order.supplier.email">{{ $t('Email') }}: {{ return_order.supplier.email }}</div>
      </div>
      <div class="pb-8" v-if="return_order.type == 'Sale'">
        <h2 class="mb-1 text-xs font-bold">{{ $t('Returned From') }}</h2>
        <div class="text-lg font-semibold">{{ return_order.customer.company || return_order.customer.name }}</div>
        <div class="text-sm">{{ $address(return_order.customer) }}</div>
        <div class="text-sm" v-if="return_order.customer.phone">{{ $t('Phone') }}: {{ return_order.customer.phone }}</div>
        <div class="text-sm" v-if="return_order.customer.email">{{ $t('Email') }}: {{ return_order.customer.email }}</div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 dark:divide-gray-700 print:divide-gray-400 dark:print:divide-gray-400">
          <thead>
            <tr>
              <th class="w-7 p-2 text-center font-bold uppercase">#</th>
              <th class="p-2 text-left font-bold uppercase">{{ $t('Description') }}</th>
              <th class="w-[120px] p-2 text-center font-bold uppercase">
                <template v-if="return_order.type == 'Purchase'">
                  {{ $page.props.settings.show_tax == 1 ? $t('Cost') : $t('Unit Cost') }}
                </template>
                <template v-else>
                  {{ $page.props.settings.show_tax == 1 ? $t('Price') : $t('Unit Price') }}
                </template>
              </th>
              <th class="w-[80px] p-2 text-center font-bold uppercase">{{ $t('Qty') }}</th>
              <th v-if="$page.props.settings.show_tax == 1" class="w-[80px] p-2 text-center font-bold uppercase">{{ $t('Tax') }}</th>
              <th class="w-[120px] p-2 text-center font-bold uppercase">{{ $t('Total') }}</th>
            </tr>
          </thead>

          <template v-for="(item, index) in return_order.items" :key="item.id">
            <template v-if="item.variations && item.variations.length">
              <tbody>
                <tr>
                  <td class="w-7 p-2 text-right">{{ index + 1 }}</td>
                  <td class="p-2">
                    <div class="flex items-center gap-2">
                      <template v-if="$page.props.settings.show_image == 1">
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
                  <td v-if="$page.props.settings.show_tax == 1" class="p-2"></td>
                  <td class="p-2"></td>
                </tr>

                <tr v-for="variation in item.variations" :key="variation.id">
                  <td class="w-7"></td>
                  <td class="p-2">{{ $meta(variation.meta) }}</td>
                  <td class="p-2 text-right">{{ $number(variation.pivot.cost) }}</td>
                  <td class="p-2 text-right">
                    <div class="flex items-center justify-end">
                      {{ $number_qty(variation.pivot.quantity) }}{{ variation.pivot?.unit?.code || '' }}
                    </div>
                  </td>
                  <td v-if="$page.props.settings.show_tax == 1" class="p-2 text-right">{{ $number(variation.pivot.tax_amount) }}</td>
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
                  <td class="p-2">
                    <div class="flex items-center gap-2">
                      <template v-if="$page.props.settings.show_image == 1">
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
                  <td class="p-2 text-right">{{ $number(item.cost) }}</td>
                  <td class="p-2 text-right">
                    <div class="flex items-center justify-end">{{ $number_qty(item.quantity) }}{{ item.unit?.code || '' }}</div>
                  </td>
                  <td v-if="$page.props.settings.show_tax == 1" class="p-2 text-right">{{ $number(item.tax_amount) }}</td>
                  <td class="p-2 text-right font-bold">{{ $number(item.total) }}</td>
                </tr>
              </tbody>
            </template>
          </template>
          <tfoot class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="$page.props.settings.show_tax == 1">
              <th colspan="3" class="p-2 text-right text-lg font-bold">{{ $t('Total') }}</th>
              <th class="p-2 text-right text-lg font-bold">
                <!-- {{ return_order.items.length }} -->
                {{ $decimal_qty(return_order.items.reduce((a, i) => Number(i.quantity) + a, 0)) }}
              </th>
              <th class="p-2 text-right text-lg font-bold">
                {{ $currency(return_order.total_tax_amount) }}
              </th>
              <th class="p-2 text-right text-lg font-bold">{{ $currency(return_order.total) }}</th>
            </tr>
            <template v-else>
              <template v-if="$decimal(return_order.total_tax_amount, true) > 0">
                <tr>
                  <th colspan="4" class="p-2 text-right text-lg font-bold">{{ $t('Subtotal') }}</th>
                  <th class="p-2 text-right text-lg font-bold">
                    {{ $currency(return_order.subtotal) }}
                  </th>
                </tr>
                <tr>
                  <th colspan="4" class="p-2 text-right text-lg font-bold">{{ $t('Tax') }}</th>
                  <th class="p-2 text-right text-lg font-bold">
                    {{ $currency(return_order.total_tax_amount) }}
                  </th>
                </tr>
              </template>
              <template v-else-if="$page.props.settings.show_zero_taxes == 1">
                <tr>
                  <th colspan="4" class="p-2 text-right text-lg font-bold">{{ $t('Tax') }}</th>
                  <th class="p-2 text-right text-lg font-bold">
                    {{ $currency(return_order.total_tax_amount) }}
                  </th>
                </tr>
              </template>
              <tr>
                <th colspan="4" class="p-2 text-right text-lg font-bold">{{ $t('Total') }}</th>
                <th class="p-2 text-right text-lg font-bold">
                  {{ $currency(return_order.grand_total) }}
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
        :extra_attributes="return_order.extra_attributes"
      />

      <div v-if="return_order.details" class="mb-4 pt-8">
        {{ return_order.details }}
      </div>

      <div v-if="return_order.attachments && return_order.attachments.length" class="mt-8 w-full py-2 print:hidden">
        <Attachments :attachments="return_order.attachments" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="flex min-h-64 items-center justify-center p-6 text-lg font-thin">
      {{ $t('No data found, the record might not belong to the selected store.') }}
    </div>
  </template>
</template>
