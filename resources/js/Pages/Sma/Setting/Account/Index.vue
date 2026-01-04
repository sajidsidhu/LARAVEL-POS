<script setup>
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';

import Form from './Form.vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Modal } from '@/Components/Jet';
import { Actions, Button, Pagination } from '@/Components/Common';

defineOptions({ layout: AdminLayout });
defineProps(['pagination', 'types']);

const add = ref(false);
const current = ref(null);
const deleted = ref(false);
const deleting = ref(false);

function editRow(row) {
  current.value = row;
  add.value = true;
}

function deleteRow(row) {
  deleting.value = true;
  router.delete(route('accounts.destroy', row.id), {
    preserveScroll: true,
    onSuccess: () => (deleted.value = true),
    onFinish: () => (deleting.value = false),
  });
}

function hideForm() {
  current.value = null;
  add.value = false;
}
</script>

<template>
  <Head>
    <title>{{ $t('Accounts') }}</title>
  </Head>
  <Header>
    {{ $t('Accounts') }}
    <template #subheading> {{ $t('Please review the data below') }} </template>
    <template #menu>
      <Button v-if="$can('create-accounts')" type="button" @click="add = true">
        {{ $t('Add {x}', { x: $t('Account') }) }}
      </Button>
    </template>
  </Header>

  <div class="flex grow flex-col items-stretch justify-stretch self-stretch bg-white px-4 sm:px-6 lg:px-8 dark:bg-gray-800">
    <div class="flow-root grow">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle">
          <table class="fixed-actions min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th scope="col" class="text-focus py-3.5 pr-3 pl-4 text-left text-sm font-semibold sm:pl-6 lg:pl-8">{{ $t('Title') }}</th>
                <th scope="col" class="text-focus px-3 py-3.5 text-left text-sm font-semibold">{{ $t('Type') }}</th>
                <th scope="col" class="text-focus px-3 py-3.5 text-left text-sm font-semibold">{{ $t('Reference') }}</th>
                <th scope="col" class="text-focus px-3 py-3.5 text-left text-sm font-semibold">{{ $t('Balance') }}</th>
                <th scope="col" class="text-focus px-3 py-3.5 text-left text-sm font-semibold">{{ $t('Details') }}</th>
                <th scope="col" class="text-focus px-3 py-3.5 text-left text-sm font-semibold">{{ $t('Active') }}</th>
                <th scope="col" class="text-focus px-3 py-3.5 text-left text-sm font-semibold">{{ $t('Offline') }}</th>
                <th scope="col" class="text-focus px-3 py-3.5 text-left text-sm font-semibold">{{ $t('Fees') }}</th>
                <th scope="col" class="text-focus px-3 py-3.5 text-left text-sm font-semibold">{{ $t('Fixed') }}</th>
                <th scope="col" class="text-focus px-3 py-3.5 text-left text-sm font-semibold">{{ $t('Percentage') }}</th>
                <th scope="col" class="text-focus px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap">{{ $t('Apply to') }}</th>
                <th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-6 lg:pr-8">
                  <span class="sr-only">{{ $t('Actions') }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              <template v-if="pagination && pagination.data && pagination.data.length">
                <tr v-for="row in pagination.data" :key="row.id">
                  <td class="text-focus py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap sm:pl-6 lg:pl-8">{{ row.title }}</td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap">{{ row.type }}</td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap">{{ row.reference }}</td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap">{{ $number(row.balance) }}</td>
                  <td class="px-3 py-4 text-sm">
                    <div class="line-clamp-2 max-w-xs min-w-56">
                      {{ row.details }}
                    </div>
                  </td>
                  <td class="w-16 px-3 py-4 text-sm whitespace-nowrap">
                    <span v-html="$boolean(row.active, true)"></span>
                  </td>
                  <td class="w-16 px-3 py-4 text-sm whitespace-nowrap">
                    <span v-html="$boolean(row.offline, true)"></span>
                  </td>
                  <td class="w-16 px-3 py-4 text-sm whitespace-nowrap">
                    <span v-html="$boolean(row.fees, true)"></span>
                  </td>
                  <td class="px-3 py-4 text-center text-sm whitespace-nowrap">{{ $number(row.fixed) }}</td>
                  <td class="px-3 py-4 text-center text-sm whitespace-nowrap">{{ $number(row.percentage) }}</td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap">{{ row.apply_to }}</td>
                  <td class="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6 lg:pr-8">
                    <div class="text-mute flex items-center gap-4">
                      <Link :href="route('accounts.statement', row.id)" class="link">
                        <Icon name="bars" class="size-5" />
                      </Link>
                      <Actions
                        :row="row"
                        :editRow="editRow"
                        :deleted="deleted"
                        :deleting="deleting"
                        permission="accounts"
                        :deleteRow="deleteRow"
                        :record="$t('Account')"
                      />
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="100%">
                  <div class="text-mute py-3.5 pr-3 pl-4 text-sm font-light whitespace-nowrap sm:pl-2 lg:pl-4">
                    {{ $t('There is no data to display!') }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="-mx-4 sm:-mx-6 lg:-mx-8">
      <Pagination class="mx-4 mt-auto py-2 text-sm sm:mx-6" :meta="pagination.meta" :links="pagination.links" />
    </div>

    <Modal :show="add" :backdrop="false" max-width="2xl" :closeable="true" @close="hideForm">
      <Form :current="current" :types="types" @close="hideForm" @done="hideForm" />
    </Modal>
  </div>
</template>
