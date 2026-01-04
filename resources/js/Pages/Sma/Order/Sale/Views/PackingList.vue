<script setup>
defineProps(['sale']);

function print() {
  window.print();
}
</script>

<template>
  <template v-if="sale">
    <span class="absolute top-4 right-12 inline-flex items-center gap-x-4 sm:right-14 print:hidden">
      <button type="button" @click="print" class="link -m-2 p-2">
        <Icon name="print-o" class="size-5" />
      </button>
    </span>

    <div class="border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700 print:hidden">
      <div class="sm:flex sm:items-baseline sm:justify-between">
        <div class="sm:w-0 sm:flex-1">
          <h1 class="text-focus text-base font-semibold">
            {{ $t('Packing List') }} {{ $t('Sale') }} #{{ sale?.id }} ({{ sale?.reference }})
          </h1>
          <p class="text-mute mt-1 truncate text-sm">
            {{ $t('Please view the details below') }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 px-6 py-4 print:m-0 print:py-0">
      <div class="mb-1 max-h-16 max-w-[250px]">
        <img v-if="sale.store.logo" class="h-16 max-w-full" :src="sale.store.logo" :alt="sale.store.name" />
        <template v-else>
          <img
            class="h-16 max-w-full dark:hidden"
            v-if="$page.props.settings?.logo"
            :src="$page.props.settings?.logo"
            :alt="$page.props.settings?.name"
          />
          <img
            class="hidden h-16 max-w-full dark:block"
            v-if="$page.props.settings?.logo_dark"
            :src="$page.props.settings?.logo_dark"
            :alt="$page.props.settings?.name"
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
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 dark:divide-gray-700 print:divide-gray-400 dark:print:divide-gray-400">
          <thead>
            <tr>
              <th class="w-7 p-2 text-center font-bold uppercase">#</th>
              <th class="p-2 text-left font-bold uppercase">{{ $t('Description') }}</th>
              <th class="p-2 text-left font-bold uppercase">{{ $t('Rack') }}</th>
              <th class="w-[80px] p-2 text-center font-bold uppercase">{{ $t('Qty') }}</th>
            </tr>
          </thead>

          <template v-for="(item, index) in sale.items" :key="item.id">
            <template v-if="item.variations && item.variations.length">
              <tbody>
                <tr>
                  <td class="w-7 p-2 text-right">{{ index + 1 }}</td>
                  <td class="p-2">{{ item.product.name }}</td>
                  <td class="p-2"></td>
                  <td class="p-2"></td>
                </tr>

                <tr v-for="variation in item.variations" :key="variation.id">
                  <td class="w-7"></td>
                  <td class="p-2">{{ $meta(variation.meta) }}</td>
                  <td class="p-2 font-bold">{{ variation.pivot.rack_location || item.product.rack_location || '' }}</td>
                  <td class="p-2 text-right">
                    {{ $number_qty(variation.pivot.quantity) }}
                  </td>
                </tr>
              </tbody>
            </template>
            <template v-else>
              <tbody
                class="divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-700 dark:border-gray-700 print:divide-gray-400 dark:print:divide-gray-400"
              >
                <tr>
                  <td class="w-7 p-2 text-right">{{ index + 1 }}</td>
                  <td class="p-2">{{ item.product.name }}</td>
                  <td class="p-2 font-bold">{{ item.product.type == 'Service' ? '' : item.product.rack_location || '' }}</td>
                  <td class="p-2 text-right">{{ $number_qty(item.quantity) }}</td>
                </tr>
              </tbody>
            </template>
          </template>
          <tfoot class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <th colspan="3" class="p-2 text-right text-lg font-bold">{{ $t('Total Items') }}</th>
              <th class="p-2 text-right text-lg font-bold">
                <!-- {{ sale.items.length }} -->
                {{ $decimal_qty(sale.items.reduce((a, i) => Number(i.quantity) + a, 0)) }}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="flex min-h-64 items-center justify-center p-6 text-lg font-thin">
      {{ $t('No data found, the record might not belong to the selected store.') }}
    </div>
  </template>
</template>
