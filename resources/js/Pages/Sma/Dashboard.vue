<script setup>
import dayjs from 'dayjs';
import { route } from 'ziggy-js';
import { useI18n } from 'vue-i18n';
import { usePage } from '@inertiajs/vue3';
import { onMounted, ref, watch } from 'vue';
import ApexCharts from 'vue3-apexcharts';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
// import LocalizedFormat from 'dayjs/plugin/LocalizedFormat';

import { axios, $currency } from '@/Core';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { AutoComplete, ClientOnly, Loading } from '@/Components/Common';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
// dayjs.extend(LocalizedFormat);

const page = usePage();
const { t } = useI18n({});
defineOptions({ layout: AdminLayout });
// const props = defineProps(['chart']);

const data = ref({});
const data_days = ref(null);
const loading = ref('true');
const chartData = ref(null);
const type = ref('annually');
const loadingChart = ref('true');
const year = ref(dayjs().year());
const month = ref(dayjs().month() + 1);
const sparkType = ref(page.props.settings?.chart_type || 'area');
// const theme = ref(document.querySelector('html').style.colorScheme);

const barSeries = ref([]);
const barChartOptions = ref({
  chart: {
    type: 'bar',
    height: 450,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return value;
      },
    },
  },
  fill: {
    opacity: [0.8, 0.8, 0.9, 1],
  },
  tooltip: {
    theme: false,
    shared: true,
    intersect: false,
    followCursor: false,
    marker: {
      show: false,
    },
    y: {
      formatter: function (val) {
        return $currency(val);
      },
    },
  },
});

const salesSpark = ref([]);
const paymentsSpark = ref([]);
const expensesSpark = ref([]);
const purchasesSpark = ref([]);
const salesSparkOptions = ref({});
const expensesSparkOptions = ref({});
const paymentsSparkOptions = ref({});
const purchasesSparkOptions = ref({});

const sparkChartOptions = ref({
  chart: {
    type: 'bar',
    height: 100,
    sparkline: { enabled: true },
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: function (value, timestamp) {
        // return new Date(timestamp).toUTCString();
        return new Date(timestamp).toLocaleString(window.Locale, { timeZone: 'UTC', dateStyle: 'medium' });
      },
    },
  },
  tooltip: {
    theme: false,
    marker: { show: false },
    y: {
      formatter: function (y) {
        return y ? $currency(y) : y;
      },
    },
  },
  labels: [],
});

watch(type, getChartData);
// watch(year, () => getChartData(year.value));

onMounted(() => {
  getChartData(year.value);
  getDashboardData(data_days.value);
});

async function getChartData() {
  //   year.value = year;
  loadingChart.value = true;
  await axios
    .post(route('dashboard.chart'), { month: month.value, year: year.value, type: type.value })
    .then(res => {
      chartData.value = res.data;

      barSeries.value = [
        {
          type: 'column',
          name: t('Sales'),
          data: Object.values(res.data?.sales || {}) || [],
        },
        {
          type: 'column',
          name: t('Purchases'),
          data: Object.values(res.data?.purchases || {}) || [],
        },
        {
          type: 'area',
          name: t('Payments'),
          data: Object.values(res.data?.payments || {}) || [],
        },
        {
          type: 'area',
          name: t('Expenses'),
          data: Object.values(res.data?.expenses || {}) || [],
        },
      ];
      barChartOptions.value = {
        ...barChartOptions.value,
        xaxis: { ...barChartOptions.value.xaxis, categories: res.data?.categories || [] },
      };
    })
    .finally(() => (loadingChart.value = false));
}

async function getDashboardData(days) {
  loading.value = true;
  data_days.value = days;
  await axios.get(route('dashboard.data') + '?days=' + (data_days.value || '')).then(res => (data.value = res.data));

  if (data_days.value) {
    // console.log(data.value?.spark);
    salesSpark.value = [
      {
        name: t('Sales'),
        data: Object.values(data.value?.spark?.sales || {}) || [],
      },
    ];
    salesSparkOptions.value = {
      ...sparkChartOptions.value,
      labels: Object.keys(data.value?.spark?.sales || {}) || [],
    };

    purchasesSpark.value = [
      {
        name: t('Purchases'),
        data: Object.values(data.value?.spark?.purchases || {}) || [],
      },
    ];
    purchasesSparkOptions.value = {
      ...sparkChartOptions.value,
      labels: Object.keys(data.value?.spark?.purchases || {}) || [],
    };

    paymentsSpark.value = [
      {
        name: t('Payments'),
        data: Object.values(data.value?.spark?.payments || {}) || [],
      },
    ];
    paymentsSparkOptions.value = {
      ...sparkChartOptions.value,
      labels: Object.keys(data.value?.spark?.payments || {}) || [],
      tooltip: {
        ...sparkChartOptions.value.tooltip,
        y: {
          formatter: function (y) {
            if (y !== undefined) {
              if (y < 0) {
                return t('Sent') + ': ' + $currency(0 - y);
              }
              return t('Received') + ': ' + $currency(y);
            }
            return y;
          },
        },
      },
    };

    expensesSpark.value = [
      {
        name: t('Expenses'),
        data: Object.values(data.value?.spark?.expenses || {}) || [],
      },
    ];
    expensesSparkOptions.value = {
      ...sparkChartOptions.value,
      labels: Object.keys(data.value?.spark?.expenses || {}) || [],
    };

    // expensesSpark.value = [
    //   {
    //     name: t('Expenses'),
    //     data: data.value?.spark?.expenses?.map(s => s.amount) || [],
    //   },
    // ];
    // expensesSparkOptions.value = {
    //   ...sparkChartOptions.value,
    //   labels: data.value?.spark?.expenses?.map(s => s.date) || [],
    // };

    // paymentsSpark.value = [
    //   {
    //     name: t('Payments'),
    //     data: data.value?.spark?.payments?.map(s => s.amount) || [],
    //   },
    // ];
    // paymentsSparkOptions.value = {
    //   ...sparkChartOptions.value,
    //   labels: data.value?.spark?.payments?.map(s => s.date) || [],
    // };

    // purchasesSpark.value = [
    //   {
    //     name: t('Purchases'),
    //     data: data.value?.spark?.purchases?.map(s => s.amount) || [],
    //   },
    // ];
    // purchasesSparkOptions.value = {
    //   ...sparkChartOptions.value,
    //   labels: data.value?.spark?.purchases?.map(s => s.date) || [],
    // };
  } else {
    salesSpark.value = [];
    expensesSpark.value = [];
    paymentsSpark.value = [];
    purchasesSpark.value = [];
    salesSparkOptions.value = { ...sparkChartOptions.value, labels: [] };
    expensesSparkOptions.value = { ...sparkChartOptions.value, labels: [] };
    paymentsSparkOptions.value = { ...sparkChartOptions.value, labels: [] };
    purchasesSparkOptions.value = { ...sparkChartOptions.value, labels: [] };
  }
  loading.value = false;
}
</script>

<template>
  <Head>
    <title>{{ $t('Dashboard') }}</title>
  </Head>
  <Header class="overflow-x-auto whitespace-nowrap">
    <div class="flex w-full flex-wrap items-center gap-6 sm:flex-nowrap">
      <div class="flex grow items-center justify-between">
        <h1 class="py-1 text-base leading-7 font-bold text-gray-900 dark:text-gray-100">{{ $t('Overview') }}</h1>
        <div class="flex items-center justify-end gap-4 sm:hidden">
          <Link
            v-if="$can('create-sales')"
            :href="route('sales.create')"
            class="flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {{ $t('Add new sale') }}
          </Link>
          <Link v-if="route().has('pos') && $can('read-pos')" :href="route('pos')" class="btn-primary">
            {{ $t('POS') }}
          </Link>
        </div>
      </div>
      <div
        class="order-last flex min-w-full gap-x-8 text-sm leading-6 font-semibold sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7 dark:sm:border-gray-700"
      >
        <button type="button" :disabled="data_days == 7" @click="getDashboardData(7)" :class="data_days == 7 ? 'link' : ''">
          {{ $t('Last 7 days') }}
        </button>
        <button type="button" :disabled="data_days == 30" @click="getDashboardData(30)" :class="data_days == 30 ? 'link' : ''">
          {{ $t('Last 30 days') }}
        </button>
        <button type="button" :disabled="data_days == 60" @click="getDashboardData(60)" :class="data_days == 60 ? 'link' : ''">
          {{ $t('Last 60 days') }}
        </button>
        <button type="button" @click="getDashboardData()" :disabled="!data_days" :class="!data_days ? 'link' : ''">
          {{ $t('All-time') }}
        </button>
      </div>
    </div>
    <template #menu>
      <div class="hidden items-center justify-end gap-4 sm:flex">
        <Link
          v-if="$can('create-sales')"
          :href="route('sales.create')"
          class="flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {{ $t('Add new sale') }}
        </Link>
        <Link v-if="route().has('pos') && $can('read-pos')" :href="route('pos')" class="btn-primary">
          {{ $t('POS') }}
        </Link>
      </div>
    </template>
  </Header>

  <ClientOnly>
    <div v-if="loading" class="relative flex h-64 items-center justify-center">
      <Loading loadingClass="h-10 w-10" />
    </div>
    <dl
      v-else
      class="grid w-full grid-cols-1 gap-px border-b border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-gray-700 dark:bg-gray-700"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-5 sm:px-6 xl:px-8 dark:bg-gray-900">
        <dt class="text-mute text-sm leading-6 font-medium">{{ $t('Sales') }}</dt>
        <!-- <dd class="text-xs font-medium">+4.75%</dd> -->
        <dd class="text-focus w-full flex-none text-2xl leading-10 font-bold tracking-tight">
          {{ $currency(data?.data?.sales || 0) }}
        </dd>
        <div v-if="data_days" class="min-w-full">
          <ApexCharts :type="sparkType" height="100" :options="salesSparkOptions" :series="salesSpark" />
        </div>
      </div>
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-5 sm:px-6 xl:px-8 dark:bg-gray-900">
        <dt class="text-mute text-sm leading-6 font-medium">{{ $t('Purchases') }}</dt>
        <!-- <dd class="text-xs font-medium text-rose-600">+54.02%</dd> -->
        <dd class="text-focus w-full flex-none text-2xl leading-10 font-bold tracking-tight">
          {{ $currency(data?.data?.purchases || 0) }}
        </dd>
        <div v-if="data_days" class="min-w-full">
          <ApexCharts :type="sparkType" height="100" :options="purchasesSparkOptions" :series="purchasesSpark" />
        </div>
      </div>
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-5 sm:px-6 xl:px-8 dark:bg-gray-900">
        <dt class="text-mute text-sm leading-6 font-medium">{{ $t('Payments') }}</dt>
        <!-- <dd class="text-xs font-medium">-1.39%</dd> -->
        <dd class="text-focus w-full flex-none text-2xl leading-10 font-bold tracking-tight">
          {{ $currency(data?.data?.paid || 0) }}
        </dd>
        <div v-if="data_days" class="min-w-full">
          <ApexCharts :type="sparkType" height="100" :options="paymentsSparkOptions" :series="paymentsSpark" />
        </div>
      </div>
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-5 sm:px-6 xl:px-8 dark:bg-gray-900">
        <dt class="text-mute text-sm leading-6 font-medium">{{ $t('Expenses') }}</dt>
        <!-- <dd class="text-xs font-medium text-rose-600">+10.18%</dd> -->
        <dd class="text-focus w-full flex-none text-2xl leading-10 font-bold tracking-tight">
          {{ $currency(data?.data?.expenses || 0) }}
        </dd>
        <div v-if="data_days" class="min-w-full">
          <ApexCharts :type="sparkType" height="100" :options="expensesSparkOptions" :series="expensesSpark" />
        </div>
      </div>
    </dl>

    <div class="bg-white dark:bg-gray-900">
      <div class="border-b border-gray-200 px-4 py-5 sm:px-6 dark:border-gray-700">
        <!-- <div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap"> -->
        <!-- <div class="ml-4 mt-2">
            <h3 class="text-base font-bold text-focused">{{ $t('Year Overview') }}</h3>
          </div> -->
        <!-- <div class="ml-4 mt-2 shrink-0 max-w-24">
            <AutoComplete
              label=""
              id="year"
              v-model="year"
              :suggestions="[...Array(dayjs().year() - 2023).keys()].map(i => 0 - (i - dayjs().year()))"
            />
          </div> -->
        <div class="relative z-1 dark:border-gray-800">
          <!-- <Loading v-if="loadingChart" /> -->
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div class="w-full grow">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ t('Statistics Chart') }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('Please view your sales, payments, purchases & expenses data in the chart below.') }}
              </p>
            </div>

            <div class="flex w-full flex-col items-end justify-end gap-2 lg:flex-row lg:items-stretch">
              <div class="order-1 flex w-full max-w-64 items-center justify-end gap-2 lg:order-0">
                <div v-if="type == 'monthly'" class="grow">
                  <AutoComplete
                    :json="true"
                    v-model="month"
                    :searchable="false"
                    @change="getChartData"
                    :placeholder="$t('Month')"
                    :suggestions="
                      [...Array(12).keys()].map(m => ({ label: dayjs().startOf('year').add(m, 'month').format('MMMM'), value: m + 1 }))
                    "
                  />
                </div>
                <div class="w-24 shrink-0">
                  <AutoComplete
                    :json="true"
                    v-model="year"
                    :searchable="false"
                    @change="getChartData"
                    :placeholder="$t('Year')"
                    :suggestions="[...Array(12).keys()].map(i => ({ label: dayjs().year() - i, value: dayjs().year() - i }))"
                  />
                </div>
              </div>

              <div
                class="order-0 flex items-center justify-end gap-0.5 rounded-lg border border-gray-100 bg-gray-100 p-0.5 lg:order-1 dark:border-gray-950 dark:bg-gray-950"
              >
                <button
                  @click="type = 'monthly'"
                  :class="
                    type == 'monthly'
                      ? 'bg-white text-gray-900 shadow-2xs dark:bg-gray-800 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  "
                  class="rounded-md px-3 py-2 text-sm font-medium hover:text-gray-900 hover:shadow-2xs dark:text-white dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  {{ t('Monthly') }}
                </button>

                <button
                  @click="type = 'annually'"
                  :class="
                    type == 'annually'
                      ? 'bg-white text-gray-900 shadow-2xs dark:bg-gray-800 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  "
                  class="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:shadow-2xs dark:text-gray-400 dark:hover:text-white"
                >
                  {{ t('Annually') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </div>

      <div class="flex gap-4 overflow-x-auto px-4 py-6 whitespace-nowrap sm:gap-12 sm:px-6 xl:px-8">
        <div class="flex items-start gap-2">
          <div>
            <h4 class="mb-0.5 text-base font-bold text-gray-800 sm:text-xl dark:text-white/90">
              {{ $currency(Object.values(chartData?.sales || {}).reduce((i, a) => Number(a) + Number(i), 0)) }}
            </h4>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('{x} Sales', { x: t('Total') }) }}</span>
          </div>
        </div>

        <div class="flex items-start gap-2">
          <div>
            <h4 class="mb-0.5 text-base font-bold text-gray-800 sm:text-xl dark:text-white/90">
              {{ $currency(Object.values(chartData?.purchases || {}).reduce((i, a) => Number(a) + Number(i), 0)) }}
            </h4>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('{x} Purchases', { x: t('Total') }) }}</span>
          </div>
        </div>

        <div class="flex items-start gap-2">
          <div>
            <h4 class="mb-0.5 text-base font-bold text-gray-800 sm:text-xl dark:text-white/90">
              {{ $currency(Object.values(chartData?.payments || {}).reduce((i, a) => Number(a) + Number(i), 0)) }}
            </h4>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('Payments {x}', { x: $t('Received/Sent') }) }}</span>
          </div>
        </div>

        <!-- <div class="flex items-start gap-2">
          <div>
            <h4 class="mb-0.5 text-base font-bold text-gray-800 sm:text-xl dark:text-white/90">
              {{ $currency(Object.values(chartData?.due || {}).reduce((i, a) => Number(a) + Number(i), 0)) }}
            </h4>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('{x} Sales', { x: t('Outstanding') }) }}</span>
          </div>
        </div> -->

        <div class="flex items-start gap-2">
          <div>
            <h4 class="mb-0.5 text-base font-bold text-gray-800 sm:text-xl dark:text-white/90">
              {{ $currency(Object.values(chartData?.expenses || {}).reduce((i, a) => Number(a) + Number(i), 0)) }}
            </h4>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('{x} Expenses', { x: t('Total') }) }}</span>
          </div>
        </div>
      </div>
      <div class="h-[475px]">
        <div v-if="loadingChart" class="relative z-0 flex h-[450px] items-center justify-center">
          <Loading loadingClass="h-10 w-10" />
        </div>
        <div v-else id="chart" class="px-6">
          <ApexCharts type="bar" height="450" :options="barChartOptions" :series="barSeries" />
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
