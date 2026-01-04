import { createInertiaApp, Head, Link, router } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
import { renderToString } from '@vue/server-renderer';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import Notifications, { notify } from 'notiwind';
import { createSSRApp, h } from 'vue';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';

import { Icon } from '@/Components';
import i18n from '@/Core/i18n';
import mixin from '@/Core/mixin';
import checkShortcutKeys from '@/Core/shortcuts';
import AppLayout from '@/Layouts/AppLayout.vue';
import Header from '@/Layouts/Components/Header.vue';

createServer(
  page =>
    createInertiaApp({
      page,
      render: renderToString,
      title: title => `${title} - SMA`,
      // resolve: name => {
      //   const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
      //   let page = pages[`./Pages/${name}.vue`];
      //   page.default.layout = page.default.layout || AppLayout;
      //   return page;
      // },
      resolve: name => {
        const page = resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue'));
        page.then(p => {
          p.default.layout = p.default?.layout || AppLayout;
        });
        return page;
      },
      setup({ App, props, plugin }) {
        router.on('success', event => {
          if (event.detail.page.props.flash?.message) {
            notify({
              group: 'main',
              type: 'success',
              title: 'Success!',
              text: event.detail.page.props.flash.message,
            });
          }
          if (event.detail.page.props.flash?.error) {
            notify({
              group: 'main',
              type: 'error',
              title: 'Failed!',
              text: event.detail.page.props.flash.error,
            });
          }
        });

        router.on('error', errors => {
          notify(
            {
              group: 'main',
              type: 'error',
              title: 'Failed!',
              text: Object.values(errors.detail.errors).join('<br />'),
            },
            5000
          );
        });

        return (
          createSSRApp({
            render: () => h(App, props),
            mounted: () => {
              setTimeout(() => {
                document.addEventListener('keyup', checkShortcutKeys);
                document.getElementById('app-loading').style.display = 'none';
              }, 250);
            },
            beforeDestroy() {
              document.removeEventListener('keyup', checkShortcutKeys);
            },
          })
            .use(i18n)
            .use(plugin)
            .use(ZiggyVue)
            // .use(ZiggyVue, {
            //   ...page.props.ziggy,
            //   location: new URL(page.props.ziggy.location),
            // })
            .mixin(mixin)
            .use(Notifications)
            .component('Head', Head)
            .component('Icon', Icon)
            .component('Link', Link)
            .component('Header', Header)
        );
      },
    }),
  13715
);
