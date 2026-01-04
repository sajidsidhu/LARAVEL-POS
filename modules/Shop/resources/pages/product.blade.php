<x-slot name="title">{{ $product->title ?? $product->name }}</x-slot>
<x-slot name="metaDesc">{{ $product->description ?? ($seo['products_description'] ?? '') }}</x-slot>
<x-slot name="ogMetaData">
  <meta name="og:site_name" content="{{ $product->title ?? $product->name }}" />
  <meta name="og:title" content="{{ $product->title ?? $product->name }}" />
  <meta name="og:url" content="{{ route('shop.product', $product->slug) }}" />
  <meta name="og:image" content="{{ $product->photo }}" />
  <meta name="twitter:card" content="summary" />
</x-slot>

<nav class="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto whitespace-nowrap"
  aria-label="Breadcrumb">
  <ol role="list" class="mx-auto flex w-full max-w-(--breakpoint-xl) space-x-4 px-4 sm:px-6 lg:px-8">
    <li class="flex">
      <div class="flex items-center">
        <a href="{{ route('shop.home') }}" class="text-mute hover:text-prominent x-focus">
          <svg class="size-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path fill-rule="evenodd"
              d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
              clip-rule="evenodd" />
          </svg>
          <span class="sr-only">{{ __('Home') }}</span>
        </a>
      </div>
    </li>
    <li class="flex">
      <div class="flex items-center">
        <svg class="h-full w-6 shrink-0 text-gray-200 dark:text-gray-800" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor"
          aria-hidden="true">
          <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
        </svg>
        <a href="{{ route('shop.products') }}"
          class="ml-4 text-sm font-medium text-mute hover:text-prominent x-focus">{{ __('Products') }}</a>
      </div>
    </li>
    <li class="flex">
      <div class="flex items-center">
        <svg class="h-full w-6 shrink-0 text-gray-200 dark:text-gray-800" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor"
          aria-hidden="true">
          <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
        </svg>
        <a href="{{ route('shop.brand', $product->brand->slug) }}" class="ml-4 text-sm font-medium text-mute hover:text-prominent x-focus"
          aria-current="page">{{ $product->brand->name }}</a>
      </div>
    </li>
    <li class="flex">
      <div class="flex items-center">
        <svg class="h-full w-6 shrink-0 text-gray-200 dark:text-gray-800" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor"
          aria-hidden="true">
          <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
        </svg>
        <a href="{{ route('shop.category', $product->category->slug) }}"
          class="ml-4 text-sm font-medium text-mute hover:text-prominent x-focus" aria-current="page">{{ $product->category->name }}</a>
      </div>
    </li>
    @if ($product->subcategory ?? null)
      <li class="flex">
        <div class="flex items-center">
          <svg class="h-full w-6 shrink-0 text-gray-200 dark:text-gray-800" viewBox="0 0 24 44" preserveAspectRatio="none"
            fill="currentColor" aria-hidden="true">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>
          <a href="{{ route('shop.subcategory', [$product->category->slug, $product->subcategory->slug]) }}"
            class="ml-4 text-sm font-medium text-mute hover:text-prominent x-focus"
            aria-current="page">{{ $product->subcategory->name }}</a>
        </div>
      </li>
    @endif
    <li class="flex">
      <div class="flex items-center">
        <svg class="h-full w-6 shrink-0 text-gray-200 dark:text-gray-800" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor"
          aria-hidden="true">
          <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
        </svg>
        <span class="ml-4 text-sm font-medium text-mute" aria-current="page">{{ $product->code }}</span>
      </div>
    </li>
  </ol>
</nav>

<div class="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
  <div class="mx-auto max-w-2xl lg:max-w-none">
    <!-- Product -->
    <div x-data="{ selectedIndex: 0 }" class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      <!-- Image gallery -->
      <div class="flex flex-col-reverse">
        <!-- Image selector -->
        <div class="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
          <div class="grid grid-cols-4 gap-6">
            <button id="photo-0" @click="selectedIndex = 0"
              class="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white dark:bg-gray-900"
              aria-controls="photo-0" role="tab" type="button">
              <span class="sr-only">{{ $product->name }}</span>
              <span class="absolute inset-0 overflow-hidden rounded-md">
                <img src="{{ $product->photo }}" alt="" class="size-full object-cover">
              </span>
              <span class="pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                :class="selectedIndex === 0 ? 'ring-blue-500' : 'ring-transparent'" aria-hidden="true"></span>
            </button>
            @if (!empty($product->photos))
              @foreach ($product->photos as $photo)
                <button id="photo-{{ $loop->iterate }}" @click="selectedIndex = {{ $loop->iterate }}"
                  class="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white dark:bg-gray-900"
                  aria-controls="photo-{{ $loop->iterate }}" role="tab" type="button">
                  <span class="sr-only">{{ $photo['name'] ?? '' }}</span>
                  <span class="absolute inset-0 overflow-hidden rounded-md">
                    <img src="/logo.png" alt="" class="size-full object-cover">
                  </span>
                  <span class="pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                    :class="selectedIndex === {{ $loop->iterate }} ? 'ring-blue-500' : 'ring-transparent'" aria-hidden="true"></span>
                </button>
              @endforeach
            @endif
          </div>
        </div>

        <div>
          <div :id="'panel-' + selectedIndex" :aria-controls="'panel-' + selectedIndex" role="tabpanel">
            <img src="{{ $product->photo }}" alt="{{ $product->name }}"
              class="aspect-square w-full object-cover sm:rounded-lg bg-gray-100
              dark:bg-gray-700">
          </div>

          <!-- More images... -->
        </div>
      </div>

      <!-- Product info -->
      <div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <h1 class="text-3xl font-bold tracking-tight ">{{ $product->name }} <small>({{ $product->code }})</small></h1>

        <div class="mt-3">
          <h2 class="sr-only">{{ __('Product information') }}</h2>
          <p class="text-3xl tracking-tight ">{{ currency_value($product->price) }}</p>
        </div>

        <!-- Reviews -->
        {{-- <div class="mt-3">
          <h3 class="sr-only">Reviews</h3>
          <div class="flex items-center">
            <div class="flex items-center">
              <!-- Active: "text-blue-500", Inactive: "text-gray-300" -->
              <svg class="size-5 shrink-0 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fill-rule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                  clip-rule="evenodd" />
              </svg>
              <svg class="size-5 shrink-0 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fill-rule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                  clip-rule="evenodd" />
              </svg>
              <svg class="size-5 shrink-0 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fill-rule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                  clip-rule="evenodd" />
              </svg>
              <svg class="size-5 shrink-0 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fill-rule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                  clip-rule="evenodd" />
              </svg>
              <svg class="size-5 shrink-0 text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fill-rule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <p class="sr-only">4 out of 5 stars</p>
          </div>
        </div> --}}

        <div class="mt-6">
          <h3 class="sr-only">{{ __('Description') }}</h3>

          <div class="space-y-6 text-base text-mute">
            <p>{{ $product->description }}</p>
          </div>
        </div>

        <form class="mt-6">
          <!-- Colors -->
          {{-- <div>
            <h3 class="text-sm text-mute">Color</h3>

            <fieldset aria-label="Choose a color" class="mt-2">
              <div class="flex items-center gap-x-3">
                <!-- Active and Checked: "ring ring-offset-1" -->
                <label aria-label="Washed Black"
                  class="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-700 focus:outline-none">
                  <input type="radio" name="color-choice" value="Washed Black" class="sr-only">
                  <span aria-hidden="true" class="size-8 rounded-full border border-black/10 bg-gray-700"></span>
                </label>
                <!-- Active and Checked: "ring ring-offset-1" -->
                <label aria-label="White"
                  class="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-400 focus:outline-none">
                  <input type="radio" name="color-choice" value="White" class="sr-only">
                  <span aria-hidden="true" class="size-8 rounded-full border border-black/10 bg-white"></span>
                </label>
                <!-- Active and Checked: "ring ring-offset-1" -->
                <label aria-label="Washed Gray"
                  class="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-500 focus:outline-none">
                  <input type="radio" name="color-choice" value="Washed Gray" class="sr-only">
                  <span aria-hidden="true" class="size-8 rounded-full border border-black/10 bg-gray-500"></span>
                </label>
              </div>
            </fieldset>
          </div> --}}

          <div class="mt-6 flex">
            <livewire:components.cart.add :product="$product" :key="$product->id" size="lg" />
            {{-- <button type="submit" class="btn-primary btn-lg">{{ __('Add to Cart') }}</button>
            <button type="button"
              class="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
              <svg class="size-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <span class="sr-only">{{ __('Add to wishlist') }}</span>
            </button> --}}
          </div>
        </form>

        @if ($product->features)
          <section aria-labelledby="details-heading" class="mt-6">
            <h2 id="details-heading" class="sr-only">{{ __('Product Features') }}</h2>

            <div class="border-t border-gray-200 dark:border-gray-700">
              <h3>
                <div class="group x-focus relative flex w-full items-center justify-between pt-6 text-left pb-3">
                  <span class="text-sm font-medium">{{ __('Features') }}</span>
                </div>
              </h3>
              <div class="pb-6 html">{{ str($product->features)->markdown()->toHtmlString() }}</div>
            </div>
          </section>
        @endif
      </div>
    </div>

    @if ($product->details)
      <div class="my-8" x-data="{
          selectedTab: 'details',
          tabs: [
              { id: 'details', name: '{{ __('Product Details') }}' },
              @if ($shipping_policy) { id: 'shipping', name: '{{ __('Shipping Policy') }}' }, @endif @if ($return_policy) { id: 'return', name: '{{ __('Return Policy') }}' } @endif
          ]
      }">
        <div class="grid grid-cols-1 sm:hidden px-4">
          <x-shop::jet.select aria-label="Select a tab" class="col-start-1 row-start-1 w-full appearance-none input"
            x-model="selectedTab">
            <template x-for="tab in tabs" :key="tab.id">
              <option :value="tab.id" x-text="tab.name"></option>
            </template>
          </x-shop::jet.select>
        </div>
        <div class="hidden sm:block">
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav aria-label="Tabs" class="-mb-px flex space-x-8">
              <template x-for="tab in tabs" :key="tab.id">
                <a href="#" @click.prevent="selectedTab = tab.id"
                  :class="selectedTab === tab.id ? 'border-primary-500 dark:border-primary-300 text-primary-600 dark:text-primary-400' :
                      'border-transparent text-mute hover:border-gray-300 hover:text-prominent'"
                  class="border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap x-focus" x-text="tab.name"></a>
              </template>
            </nav>
          </div>
        </div>

        <div class="mt-6 px-4 sm:px-0">
          <div x-show="selectedTab === 'details'">
            <div class="isolate html whitespace-pre-wrap">{{ str($product->details)->markdown()->toHtmlString() }}</div>
          </div>
          @if ($shipping_policy)
            <div x-show="selectedTab === 'shipping'">
              <div class="isolate html whitespace-pre-wrap">{{ str($shipping_policy)->markdown()->toHtmlString() }}</div>
            </div>
          @endif
          @if ($return_policy)
            <div x-show="selectedTab === 'return'">
              <div class="isolate html whitespace-pre-wrap">{{ str($return_policy)->markdown()->toHtmlString() }}</div>
            </div>
          @endif
        </div>
      </div>
      {{-- <section aria-labelledby="details-heading" class="mt-10 border-t px-4 py-16 sm:px-0">
        <h2 id="details-heading" class="text-xl font-bold">{{ __('Product Details') }}</h2>
      </section> --}}
    @endif

    @if ($related_products->count())
      <section aria-labelledby="related-heading" class="mt-10 border-t px-4 py-16 sm:px-0">
        <h2 id="related-heading" class="text-xl font-bold">{{ __('Related Products') }}</h2>

        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 xl:gap-8">
          @foreach ($related_products as $related_product)
            <x-shop::product :product="$related_product" />
          @endforeach
        </div>
      </section>
    @endif
  </div>
  </section>
</div>

</div>
