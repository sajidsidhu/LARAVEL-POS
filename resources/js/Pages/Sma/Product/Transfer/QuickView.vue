<script setup>
import { axios } from '@/Core';
import { onMounted, ref } from 'vue';
import { Attachments, Loading, ViewCustomFields } from '@/Components/Common';

const props = defineProps(['current', 'custom_fields', 'editRow', 'xfetch']);

const loading = ref(true);
const transfer = ref(null);

onMounted(async () => {
  if (props.xfetch) {
    transfer.value = props.current;
    loading.value = false;
  } else {
    await axios
      .get(route('transfers.show', { transfer: props.current.id, json: true }))
      .then(res => {
        transfer.value = res.data;
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
  <template v-else-if="transfer">
    <template v-if="!xfetch">
      <span class="absolute top-4 right-12 inline-flex items-center gap-x-4 sm:right-14">
        <button type="button" @click="print" class="link -m-2 p-2">
          <Icon name="print-o" class="size-5" />
        </button>
        <button v-if="editRow && $can('update-transfers')" type="button" @click="() => editRow(transfer)" class="link -m-2 p-2">
          <Icon name="edit-o" class="size-5" />
        </button>
      </span>

      <div class="border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700">
        <div class="sm:flex sm:items-baseline sm:justify-between">
          <div class="sm:w-0 sm:flex-1">
            <h1 class="text-focus text-base font-semibold">{{ $t('Transfer') }} #{{ transfer?.id }} ({{ transfer?.reference }})</h1>
            <p class="text-mute mt-1 truncate text-sm">
              {{ $t('Please view the details below') }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="mt-4 px-6 py-4 print:m-0 print:py-0">
      <div class="mb-1 max-h-16 max-w-[250px]">
        <img v-if="transfer.store.logo" class="h-16 max-w-full" :src="transfer.store.logo" :alt="transfer.store.name" />
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
          <div class="text-lg font-semibold">{{ transfer.store.name }}</div>
          <div class="text-sm">{{ $address(transfer.store) }}</div>
          <div class="text-sm" v-if="transfer.store.phone">{{ $t('Phone') }}: {{ transfer.store.phone }}</div>
          <div class="text-sm" v-if="transfer.store.email">{{ $t('Email') }}: {{ transfer.store.email }}</div>
        </div>
        <div class="w-2/5">
          <div class="mb-1 text-lg font-extrabold uppercase">{{ $t('Transfer') }}</div>
          <div class="text-sm">{{ $t('Transfer No. {x}', { x: transfer?.id }) }}</div>
          <div class="text-sm">{{ $t('Date') }}: {{ $datetime(transfer.created_at) }}</div>
          <div class="flex gap-1 text-sm">
            {{ $t('Reference') }}:
            <p class="truncate hover:text-clip print:block print:text-clip" dir="rtl">{{ transfer.reference }}</p>
          </div>
        </div>
      </div>
      <div class="pb-8">
        <h2 class="mb-1 text-xs font-bold">{{ $t('Transfer To') }}</h2>
        <div class="text-lg font-semibold">{{ transfer.to_store.name }}</div>
        <div class="text-sm">{{ $address(transfer.to_store) }}</div>
        <div class="text-sm" v-if="transfer.to_store.phone">{{ $t('Phone') }}: {{ transfer.to_store.phone }}</div>
        <div class="text-sm" v-if="transfer.to_store.email">{{ $t('Email') }}: {{ transfer.to_store.email }}</div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 dark:divide-gray-700 print:divide-gray-400 dark:print:divide-gray-400">
          <thead>
            <tr>
              <th class="w-7 p-2 text-right font-bold uppercase">#</th>
              <th class="p-2 text-left font-bold uppercase">{{ $t('Description') }}</th>
              <th class="w-[80px] p-2 text-center font-bold uppercase">{{ $t('Qty') }}</th>
            </tr>
          </thead>

          <template v-for="(item, index) in transfer.items" :key="item.id">
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
                  <td class="p-2 text-right">
                    <!-- {{ $number_qty(item.quantity) }} -->
                  </td>
                </tr>

                <tr v-for="variation in item.variations" :key="variation.id">
                  <td class="w-7"></td>
                  <td class="p-2">{{ $meta(variation.meta) }}</td>
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
                  <td class="p-2 text-right">{{ $number_qty(item.quantity) }}</td>
                </tr>
              </tbody>
            </template>
          </template>
          <tfoot>
            <tr>
              <td colspan="2" class="px-2 pt-1 pb-2 text-right font-bold">{{ $t('Total Quantity') }}</td>
              <td class="w-[80px] px-2 pt-1 pb-2 text-right font-bold">
                {{ $number_qty(transfer.items.reduce((a, i) => Number(i.quantity) + a, 0)) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <ViewCustomFields :modal="false" :fields="custom_fields" :title="$t('Custom Fields')" :extra_attributes="transfer.extra_attributes" />

      <div v-if="transfer.details" class="mb-4 pt-8">
        {{ transfer.details }}
      </div>

      <div v-if="transfer.attachments && transfer.attachments.length" class="mt-8 w-full py-2 print:hidden">
        <Attachments :attachments="transfer.attachments" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="flex min-h-64 items-center justify-center p-6 text-lg font-thin">
      {{ $t('No data found, the record might not belong to the selected store.') }}
    </div>
  </template>
</template>
