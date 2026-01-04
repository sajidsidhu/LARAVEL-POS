<script setup>
import { route } from 'ziggy-js';
import { useForm } from '@inertiajs/vue3';

import { SecondaryButton } from '@/Components/Jet';
import { Input, LoadingButton, Textarea } from '@/Components/Common';

const props = defineProps(['current']);
const emits = defineEmits(['close', 'done']);

const form = useForm({
  amount: null,
  description: null,
  gift_card_id: props.current.id,
});

const close = () => {
  form.reset();
  emits('close');
};

function handleSubmit() {
  console.log('gift_cards.topup', props.current);
  form.post(route('gift_cards.topup', props.current.id), {
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
            {{ $t('Topup Gift Card') }}
          </h1>
          <p class="text-mute mt-1 truncate text-sm">
            {{
              $t('Please fill the form below to {action} {record}.', {
                record: $t('gift card'),
                action: $t('add balance to'),
              })
            }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-6 gap-6 p-6">
      <!-- Amount -->
      <div class="col-span-full">
        <Input id="amount" type="number" :label="$t('Amount')" v-model="form.amount" :error="form.errors.amount" />
      </div>

      <!-- Description -->
      <div class="col-span-full">
        <Textarea :label="$t('Description')" v-model="form.description" :error="$page.props.errors.description" />
      </div>
    </div>

    <div class="flex flex-row justify-end rounded-b-lg bg-gray-100 px-6 py-4 text-end dark:bg-gray-950">
      <SecondaryButton @click="close"> {{ $t('Cancel') }} </SecondaryButton>

      <LoadingButton class="ms-3" :loading="form.processing">
        {{ $t('Save') }}
      </LoadingButton>
    </div>
  </form>
</template>
