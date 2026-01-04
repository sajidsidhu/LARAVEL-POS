<script setup>
import { axios } from '@/Core';
import { onMounted, ref } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { Attachments, Loading, ViewCustomFields } from '@/Components/Common';

const props = defineProps(['current', 'custom_fields', 'editRow']);

const page = usePage();
const loading = ref(true);
const adjustment = ref(null);

onMounted(async () => {
  await axios
    .get(route('adjustments.show', { adjustment: props.current.id, json: true }))
    .then(res => {
      adjustment.value = res.data;
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
  <template v-else-if="adjustment">
    <span class="absolute top-4 right-12 inline-flex items-center gap-x-4 sm:right-14">
      <button type="button" @click="print" class="link -m-2 p-2">
        <Icon name="print-o" class="size-5" />
      </button>
      <button v-if="editRow && $can('update-adjustments')" type="button" @click="() => editRow(adjustment)" class="link -m-2 p-2">
        <Icon name="edit-o" class="size-5" />
      </button>
    </span>

    <div class="border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700">
      <div class="sm:flex sm:items-baseline sm:justify-between">
        <div class="sm:w-0 sm:flex-1">
          <h1 class="text-focus text-base font-semibold">{{ $t('Adjustment') }} #{{ adjustment?.id }} ({{ adjustment?.reference }})</h1>
          <p class="text-mute mt-1 truncate text-sm">
            {{ $t('Please view the details below') }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 px-6 py-4 print:m-0 print:py-0">
      <div class="mb-1 max-h-16 max-w-[250px]">
        <img v-if="adjustment.store.logo" class="h-16 max-w-full" :src="adjustment.store.logo" :alt="adjustment.store.name" />
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
          <div class="text-lg font-semibold">{{ adjustment.store.name }}</div>
          <div class="text-sm">{{ $address(adjustment.store) }}</div>
          <div class="text-sm" v-if="adjustment.store.phone">{{ $t('Phone') }}: {{ adjustment.store.phone }}</div>
          <div class="text-sm" v-if="adjustment.store.email">{{ $t('Email') }}: {{ adjustment.store.email }}</div>
        </div>
        <div class="w-2/5">
          <div class="mb-1 text-lg font-extrabold uppercase">{{ $t('Adjustment') }}</div>
          <div class="text-sm">{{ $t('Adjustment No. {x}', { x: adjustment?.id }) }}</div>
          <div class="text-sm">{{ $t('Date') }}: {{ $datetime(adjustment.created_at) }}</div>
          <div class="flex gap-1 text-sm">
            {{ $t('Reference') }}:
            <p class="truncate hover:text-clip print:block print:text-clip" dir="rtl">{{ adjustment.reference }}</p>
          </div>
        </div>
      </div>
      <!-- <div class="pb-8">
        <h2 class="text-xs font-bold mb-1">{{ $t('Order To') }}</h2>
        <div class="mb-1 font-bold">{{ adjustment.supplier.name }}</div>
        <div class="text-sm" v-if="adjustment.supplier.phone">{{ $t('Phone') }}: {{ adjustment.supplier.phone }}</div>
        <div class="text-sm" v-if="adjustment.supplier.email">{{ $t('Email') }}: {{ adjustment.supplier.email }}</div>
      </div> -->

      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 dark:divide-gray-700 print:divide-gray-400 dark:print:divide-gray-400">
          <thead>
            <tr>
              <th class="w-7 p-2 text-right font-bold uppercase">#</th>
              <th class="p-2 text-left font-bold uppercase">{{ $t('Description') }}</th>
              <th class="w-[80px] p-2 text-center font-bold uppercase">{{ $t('Qty') }}</th>
            </tr>
          </thead>

          <template v-for="(item, index) in adjustment.items" :key="item.id">
            <template v-if="item.variations && item.variations.length">
              <tbody>
                <tr>
                  <td class="w-7 p-2 text-right">{{ index + 1 }}</td>
                  <td class="p-2">
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
                  <td class="p-2 text-right">{{ $number_qty(item.quantity) }}</td>
                </tr>
              </tbody>
            </template>
          </template>
          <tfoot>
            <tr>
              <td colspan="2" class="px-2 pt-1 pb-2 text-right font-bold">{{ $t('Total Quantity') }}</td>
              <td class="w-[80px] px-2 pt-1 pb-2 text-right font-bold">
                {{ $number_qty(adjustment.items.reduce((a, i) => Number(i.quantity) + a, 0)) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <ViewCustomFields
        :modal="false"
        :fields="custom_fields"
        :title="$t('Custom Fields')"
        :extra_attributes="adjustment.extra_attributes"
      />
      <!-- <template
        v-if="
          adjustment.extra_attributes && Object.keys(adjustment.extra_attributes).length && custom_fields.filter(f => f.show_on_details_view == 1)
        "
      >
        <div class="pt-8">
          <template v-for="key in Object.keys(adjustment.extra_attributes)" :key="key">
            <div v-if="custom_fields.find(f => f.name == key)?.show_on_details_view == 1">
              {{ key }}:
              {{
                Array.isArray(adjustment.extra_attributes[key])
                  ? adjustment.extra_attributes[key].join(', ')
                  : $isValidDate(adjustment.extra_attributes[key])
                  ? $date(adjustment.extra_attributes[key])
                  : adjustment.extra_attributes[key] || ''
              }}
            </div>
          </template>
        </div>
      </template> -->

      <div v-if="adjustment.details" class="mb-4 pt-8">
        {{ adjustment.details }}
      </div>

      <div v-if="adjustment.attachments && adjustment.attachments.length" class="mt-8 w-full py-2 print:hidden">
        <Attachments :attachments="adjustment.attachments" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="flex min-h-64 items-center justify-center p-6 text-lg font-thin">
      {{ $t('No data found, the record might not belong to the selected store.') }}
    </div>
  </template>
</template>
