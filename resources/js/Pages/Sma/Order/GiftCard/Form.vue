<script setup>
import dayjs from 'dayjs';
import { ref } from 'vue';
import { route } from 'ziggy-js';
import { useForm } from '@inertiajs/vue3';

import { $random } from '@/Core';
import { Modal, SecondaryButton } from '@/Components/Jet';
import CustomerForm from '@/Pages/Sma/People/Customer/Form.vue';
import { AutoComplete, DateInput, Input, LoadingButton, Textarea } from '@/Components/Common';

const emits = defineEmits(['close', 'done']);
const props = defineProps(['current', 'countries', 'customer_fields']);

const add_customer = ref(false);
const form = useForm({
  _method: props.current?.id ? 'put' : 'post',

  number: props.current?.number,
  details: props.current?.details,
  customer_id: props.current?.customer_id,
  amount: props.current ? Number(props.current.amount) : null,
  expiry_date: props.current ? props.current.expiry_date : dayjs().add(2, 'year').format('YYYY-MM-DD'),
});

const close = () => {
  form.reset();
  emits('close');
};

function generate() {
  form.number = $random(100000000000, 9999999999999999);
}

function handleSubmit() {
  form.post(props.current?.id ? route('gift_cards.update', props.current.id) : route('gift_cards.store'), {
    onSuccess: () => {
      form.reset();
      emits('done');
      emits('close');
    },
  });
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
      <div class="sm:flex sm:items-baseline sm:justify-between">
        <div class="sm:w-0 sm:flex-1">
          <h1 class="text-focus text-base font-semibold">
            {{ current?.id ? $t('Edit {x}', { x: $t('Gift Card') }) : $t('Add {x}', { x: $t('Gift Card') }) }}
          </h1>
          <p class="text-mute mt-1 truncate text-sm">
            {{
              $t('Please fill the form below to {action} {record}.', {
                record: $t('gift card'),
                action: current?.id ? $t('edit') : $t('add'),
              })
            }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-6 gap-6 p-6">
      <!-- Number -->
      <div class="col-span-6 sm:col-span-3">
        <Input
          autofocus
          :action="generate"
          @change="saveForm"
          actionText="Generate"
          :label="$t('Number')"
          v-model="form.number"
          :error="$page.props.errors.number"
        />
      </div>
      <!-- Amount -->
      <div class="col-span-6 sm:col-span-3">
        <Input
          id="amount"
          type="number"
          @change="saveForm"
          :label="$t('Amount')"
          v-model="form.amount"
          :readonly="current?.id"
          :error="form.errors.amount"
        />
      </div>

      <!-- Date -->
      <div class="col-span-6 sm:col-span-3">
        <DateInput
          type="date"
          id="expiry_date"
          @change="saveForm"
          :label="$t('Expiry Date')"
          v-model="form.expiry_date"
          :error="form.errors.expiry_date"
        />
      </div>
      <!-- Customer -->
      <div class="col-span-6 sm:col-span-3">
        <AutoComplete
          :json="true"
          valueKey="id"
          id="customer_id"
          labelKey="company"
          @change="saveForm"
          :searchable="true"
          :label="$t('Customer')"
          v-model="form.customer_id"
          :action="() => (add_customer = true)"
          :error="$page.props.errors.customer_id"
          :suggestions="route('search.customers')"
          :action-text="$t('Add {x}', { x: $t('Customer') })"
        />
      </div>

      <!-- Details -->
      <div class="col-span-full">
        <Textarea :label="$t('Details')" @change="saveForm" v-model="form.details" :error="$page.props.errors.details" />
      </div>
    </div>

    <div class="flex flex-row justify-end rounded-b-lg bg-gray-100 px-6 py-4 text-end dark:bg-gray-950">
      <SecondaryButton @click="close"> {{ $t('Cancel') }} </SecondaryButton>

      <LoadingButton class="ms-3" :loading="form.processing">
        {{ $t('Save') }}
      </LoadingButton>
    </div>
  </form>

  <Modal :show="add_customer" :backdrop="false" :overflow="true" max-width="2xl" :closeable="true" @close="add_customer = false">
    <CustomerForm
      :countries="countries"
      :custom_fields="customer_fields"
      @close="add_customer = false"
      @done="
        e => {
          form.customer_id = e?.id;
          add_customer = false;
        }
      "
    />
  </Modal>
</template>
