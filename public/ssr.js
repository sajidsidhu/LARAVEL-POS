import {
  useSSRContext,
  mergeProps,
  withCtx,
  renderSlot,
  unref,
  createVNode,
  computed,
  ref,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  resolveComponent,
  createBlock,
  openBlock,
  reactive,
  createTextVNode,
  toDisplayString,
  withKeys,
  useSlots,
  createCommentVNode,
  Fragment,
  renderList,
  onBeforeUnmount,
  withDirectives,
  vModelRadio,
  createSSRApp,
  h as h$1,
} from 'vue';
import Notifications$1, { notify, NotificationGroup, Notification } from 'notiwind';
import createServer from '@inertiajs/vue3/server';
import { renderToString } from '@vue/server-renderer';
import { Link, router, usePage, Head, createInertiaApp } from '@inertiajs/vue3';
import { createI18n, useI18n } from 'vue-i18n';
import debounce from 'lodash.debounce';
import 'dayjs';
import {
  ssrRenderAttrs,
  ssrRenderStyle,
  ssrRenderSlot,
  ssrRenderComponent,
  ssrRenderAttr,
  ssrLooseContain,
  ssrGetDynamicModelProps,
  ssrRenderTeleport,
  ssrRenderClass,
  ssrInterpolate,
  ssrIncludeBooleanAttr,
  ssrRenderList,
  ssrLooseEqual,
} from 'vue/server-renderer';
import VueDatePicker from '@vuepic/vue-datepicker';
import axios$2 from 'axios';
import isequal from 'lodash.isequal';
function t() {
  return (
    (t = Object.assign
      ? Object.assign.bind()
      : function (t4) {
          for (var e2 = 1; e2 < arguments.length; e2++) {
            var r2 = arguments[e2];
            for (var n2 in r2) ({}).hasOwnProperty.call(r2, n2) && (t4[n2] = r2[n2]);
          }
          return t4;
        }),
    t.apply(null, arguments)
  );
}
var e = String.prototype.replace,
  r = /%20/g,
  n = 'RFC3986',
  o = {
    default: n,
    formatters: {
      RFC1738: function (t4) {
        return e.call(t4, r, '+');
      },
      RFC3986: function (t4) {
        return String(t4);
      },
    },
    RFC1738: 'RFC1738',
  },
  i = Object.prototype.hasOwnProperty,
  u = Array.isArray,
  a = (function () {
    for (var t4 = [], e2 = 0; e2 < 256; ++e2) t4.push('%' + ((e2 < 16 ? '0' : '') + e2.toString(16)).toUpperCase());
    return t4;
  })(),
  s = function (t4, e2) {
    for (var r2 = e2 && e2.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, n2 = 0; n2 < t4.length; ++n2)
      void 0 !== t4[n2] && (r2[n2] = t4[n2]);
    return r2;
  },
  f = {
    arrayToObject: s,
    assign: function (t4, e2) {
      return Object.keys(e2).reduce(function (t5, r2) {
        return (t5[r2] = e2[r2]), t5;
      }, t4);
    },
    combine: function (t4, e2) {
      return [].concat(t4, e2);
    },
    compact: function (t4) {
      for (var e2 = [{ obj: { o: t4 }, prop: 'o' }], r2 = [], n2 = 0; n2 < e2.length; ++n2)
        for (var o2 = e2[n2], i2 = o2.obj[o2.prop], a2 = Object.keys(i2), s2 = 0; s2 < a2.length; ++s2) {
          var f2 = a2[s2],
            c2 = i2[f2];
          'object' == typeof c2 && null !== c2 && -1 === r2.indexOf(c2) && (e2.push({ obj: i2, prop: f2 }), r2.push(c2));
        }
      return (
        (function (t5) {
          for (; t5.length > 1; ) {
            var e3 = t5.pop(),
              r3 = e3.obj[e3.prop];
            if (u(r3)) {
              for (var n3 = [], o3 = 0; o3 < r3.length; ++o3) void 0 !== r3[o3] && n3.push(r3[o3]);
              e3.obj[e3.prop] = n3;
            }
          }
        })(e2),
        t4
      );
    },
    decode: function (t4, e2, r2) {
      var n2 = t4.replace(/\+/g, ' ');
      if ('iso-8859-1' === r2) return n2.replace(/%[0-9a-f]{2}/gi, unescape);
      try {
        return decodeURIComponent(n2);
      } catch (t5) {
        return n2;
      }
    },
    encode: function (t4, e2, r2, n2, i2) {
      if (0 === t4.length) return t4;
      var u2 = t4;
      if (
        ('symbol' == typeof t4 ? (u2 = Symbol.prototype.toString.call(t4)) : 'string' != typeof t4 && (u2 = String(t4)),
        'iso-8859-1' === r2)
      )
        return escape(u2).replace(/%u[0-9a-f]{4}/gi, function (t5) {
          return '%26%23' + parseInt(t5.slice(2), 16) + '%3B';
        });
      for (var s2 = '', f2 = 0; f2 < u2.length; ++f2) {
        var c2 = u2.charCodeAt(f2);
        45 === c2 ||
        46 === c2 ||
        95 === c2 ||
        126 === c2 ||
        (c2 >= 48 && c2 <= 57) ||
        (c2 >= 65 && c2 <= 90) ||
        (c2 >= 97 && c2 <= 122) ||
        (i2 === o.RFC1738 && (40 === c2 || 41 === c2))
          ? (s2 += u2.charAt(f2))
          : c2 < 128
          ? (s2 += a[c2])
          : c2 < 2048
          ? (s2 += a[192 | (c2 >> 6)] + a[128 | (63 & c2)])
          : c2 < 55296 || c2 >= 57344
          ? (s2 += a[224 | (c2 >> 12)] + a[128 | ((c2 >> 6) & 63)] + a[128 | (63 & c2)])
          : ((c2 = 65536 + (((1023 & c2) << 10) | (1023 & u2.charCodeAt((f2 += 1))))),
            (s2 += a[240 | (c2 >> 18)] + a[128 | ((c2 >> 12) & 63)] + a[128 | ((c2 >> 6) & 63)] + a[128 | (63 & c2)]));
      }
      return s2;
    },
    isBuffer: function (t4) {
      return !(!t4 || 'object' != typeof t4 || !(t4.constructor && t4.constructor.isBuffer && t4.constructor.isBuffer(t4)));
    },
    isRegExp: function (t4) {
      return '[object RegExp]' === Object.prototype.toString.call(t4);
    },
    maybeMap: function (t4, e2) {
      if (u(t4)) {
        for (var r2 = [], n2 = 0; n2 < t4.length; n2 += 1) r2.push(e2(t4[n2]));
        return r2;
      }
      return e2(t4);
    },
    merge: function t2(e2, r2, n2) {
      if (!r2) return e2;
      if ('object' != typeof r2) {
        if (u(e2)) e2.push(r2);
        else {
          if (!e2 || 'object' != typeof e2) return [e2, r2];
          ((n2 && (n2.plainObjects || n2.allowPrototypes)) || !i.call(Object.prototype, r2)) && (e2[r2] = true);
        }
        return e2;
      }
      if (!e2 || 'object' != typeof e2) return [e2].concat(r2);
      var o2 = e2;
      return (
        u(e2) && !u(r2) && (o2 = s(e2, n2)),
        u(e2) && u(r2)
          ? (r2.forEach(function (r3, o3) {
              if (i.call(e2, o3)) {
                var u2 = e2[o3];
                u2 && 'object' == typeof u2 && r3 && 'object' == typeof r3 ? (e2[o3] = t2(u2, r3, n2)) : e2.push(r3);
              } else e2[o3] = r3;
            }),
            e2)
          : Object.keys(r2).reduce(function (e3, o3) {
              var u2 = r2[o3];
              return (e3[o3] = i.call(e3, o3) ? t2(e3[o3], u2, n2) : u2), e3;
            }, o2)
      );
    },
  },
  c = Object.prototype.hasOwnProperty,
  l = {
    brackets: function (t4) {
      return t4 + '[]';
    },
    comma: 'comma',
    indices: function (t4, e2) {
      return t4 + '[' + e2 + ']';
    },
    repeat: function (t4) {
      return t4;
    },
  },
  p = Array.isArray,
  h = String.prototype.split,
  y = Array.prototype.push,
  d = function (t4, e2) {
    y.apply(t4, p(e2) ? e2 : [e2]);
  },
  g = Date.prototype.toISOString,
  b = o.default,
  v = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: f.encode,
    encodeValuesOnly: false,
    format: b,
    formatter: o.formatters[b],
    indices: false,
    serializeDate: function (t4) {
      return g.call(t4);
    },
    skipNulls: false,
    strictNullHandling: false,
  },
  m = function t3(e2, r2, n2, o2, i2, u2, a2, s2, c2, l2, y2, g2, b2, m2) {
    var j2,
      w2 = e2;
    if (
      ('function' == typeof a2
        ? (w2 = a2(r2, w2))
        : w2 instanceof Date
        ? (w2 = l2(w2))
        : 'comma' === n2 &&
          p(w2) &&
          (w2 = f.maybeMap(w2, function (t4) {
            return t4 instanceof Date ? l2(t4) : t4;
          })),
      null === w2)
    ) {
      if (o2) return u2 && !b2 ? u2(r2, v.encoder, m2, 'key', y2) : r2;
      w2 = '';
    }
    if (
      'string' == typeof (j2 = w2) ||
      'number' == typeof j2 ||
      'boolean' == typeof j2 ||
      'symbol' == typeof j2 ||
      'bigint' == typeof j2 ||
      f.isBuffer(w2)
    ) {
      if (u2) {
        var $2 = b2 ? r2 : u2(r2, v.encoder, m2, 'key', y2);
        if ('comma' === n2 && b2) {
          for (var O2 = h.call(String(w2), ','), E2 = '', R2 = 0; R2 < O2.length; ++R2)
            E2 += (0 === R2 ? '' : ',') + g2(u2(O2[R2], v.encoder, m2, 'value', y2));
          return [g2($2) + '=' + E2];
        }
        return [g2($2) + '=' + g2(u2(w2, v.encoder, m2, 'value', y2))];
      }
      return [g2(r2) + '=' + g2(String(w2))];
    }
    var S2,
      x2 = [];
    if (void 0 === w2) return x2;
    if ('comma' === n2 && p(w2)) S2 = [{ value: w2.length > 0 ? w2.join(',') || null : void 0 }];
    else if (p(a2)) S2 = a2;
    else {
      var N2 = Object.keys(w2);
      S2 = s2 ? N2.sort(s2) : N2;
    }
    for (var T2 = 0; T2 < S2.length; ++T2) {
      var k2 = S2[T2],
        C = 'object' == typeof k2 && void 0 !== k2.value ? k2.value : w2[k2];
      if (!i2 || null !== C) {
        var _ = p(w2) ? ('function' == typeof n2 ? n2(r2, k2) : r2) : r2 + (c2 ? '.' + k2 : '[' + k2 + ']');
        d(x2, t3(C, _, n2, o2, i2, u2, a2, s2, c2, l2, y2, g2, b2, m2));
      }
    }
    return x2;
  },
  j = Object.prototype.hasOwnProperty,
  w = Array.isArray,
  $ = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: f.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1e3,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false,
  },
  O = function (t4) {
    return t4.replace(/&#(\d+);/g, function (t5, e2) {
      return String.fromCharCode(parseInt(e2, 10));
    });
  },
  E = function (t4, e2) {
    return t4 && 'string' == typeof t4 && e2.comma && t4.indexOf(',') > -1 ? t4.split(',') : t4;
  },
  R = function (t4, e2, r2, n2) {
    if (t4) {
      var o2 = r2.allowDots ? t4.replace(/\.([^.[]+)/g, '[$1]') : t4,
        i2 = /(\[[^[\]]*])/g,
        u2 = r2.depth > 0 && /(\[[^[\]]*])/.exec(o2),
        a2 = u2 ? o2.slice(0, u2.index) : o2,
        s2 = [];
      if (a2) {
        if (!r2.plainObjects && j.call(Object.prototype, a2) && !r2.allowPrototypes) return;
        s2.push(a2);
      }
      for (var f2 = 0; r2.depth > 0 && null !== (u2 = i2.exec(o2)) && f2 < r2.depth; ) {
        if (((f2 += 1), !r2.plainObjects && j.call(Object.prototype, u2[1].slice(1, -1)) && !r2.allowPrototypes)) return;
        s2.push(u2[1]);
      }
      return (
        u2 && s2.push('[' + o2.slice(u2.index) + ']'),
        (function (t5, e3, r3, n3) {
          for (var o3 = n3 ? e3 : E(e3, r3), i3 = t5.length - 1; i3 >= 0; --i3) {
            var u3,
              a3 = t5[i3];
            if ('[]' === a3 && r3.parseArrays) u3 = [].concat(o3);
            else {
              u3 = r3.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
              var s3 = '[' === a3.charAt(0) && ']' === a3.charAt(a3.length - 1) ? a3.slice(1, -1) : a3,
                f3 = parseInt(s3, 10);
              r3.parseArrays || '' !== s3
                ? !isNaN(f3) && a3 !== s3 && String(f3) === s3 && f3 >= 0 && r3.parseArrays && f3 <= r3.arrayLimit
                  ? ((u3 = [])[f3] = o3)
                  : '__proto__' !== s3 && (u3[s3] = o3)
                : (u3 = { 0: o3 });
            }
            o3 = u3;
          }
          return o3;
        })(s2, e2, r2, n2)
      );
    }
  },
  S = function (t4, e2) {
    var r2 = /* @__PURE__ */ (function (t5) {
      return $;
    })();
    if ('' === t4 || null == t4) return r2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
    for (
      var n2 =
          'string' == typeof t4
            ? (function (t5, e3) {
                var r3,
                  n3 = {},
                  o3 = (e3.ignoreQueryPrefix ? t5.replace(/^\?/, '') : t5).split(
                    e3.delimiter,
                    Infinity === e3.parameterLimit ? void 0 : e3.parameterLimit
                  ),
                  i3 = -1,
                  u3 = e3.charset;
                if (e3.charsetSentinel)
                  for (r3 = 0; r3 < o3.length; ++r3)
                    0 === o3[r3].indexOf('utf8=') &&
                      ('utf8=%E2%9C%93' === o3[r3] ? (u3 = 'utf-8') : 'utf8=%26%2310003%3B' === o3[r3] && (u3 = 'iso-8859-1'),
                      (i3 = r3),
                      (r3 = o3.length));
                for (r3 = 0; r3 < o3.length; ++r3)
                  if (r3 !== i3) {
                    var a3,
                      s3,
                      c2 = o3[r3],
                      l2 = c2.indexOf(']='),
                      p2 = -1 === l2 ? c2.indexOf('=') : l2 + 1;
                    -1 === p2
                      ? ((a3 = e3.decoder(c2, $.decoder, u3, 'key')), (s3 = e3.strictNullHandling ? null : ''))
                      : ((a3 = e3.decoder(c2.slice(0, p2), $.decoder, u3, 'key')),
                        (s3 = f.maybeMap(E(c2.slice(p2 + 1), e3), function (t6) {
                          return e3.decoder(t6, $.decoder, u3, 'value');
                        }))),
                      s3 && e3.interpretNumericEntities && 'iso-8859-1' === u3 && (s3 = O(s3)),
                      c2.indexOf('[]=') > -1 && (s3 = w(s3) ? [s3] : s3),
                      (n3[a3] = j.call(n3, a3) ? f.combine(n3[a3], s3) : s3);
                  }
                return n3;
              })(t4, r2)
            : t4,
        o2 = r2.plainObjects ? /* @__PURE__ */ Object.create(null) : {},
        i2 = Object.keys(n2),
        u2 = 0;
      u2 < i2.length;
      ++u2
    ) {
      var a2 = i2[u2],
        s2 = R(a2, n2[a2], r2, 'string' == typeof t4);
      o2 = f.merge(o2, s2, r2);
    }
    return f.compact(o2);
  };
class x {
  constructor(t4, e2, r2) {
    var n2, o2;
    (this.name = t4),
      (this.definition = e2),
      (this.bindings = null != (n2 = e2.bindings) ? n2 : {}),
      (this.wheres = null != (o2 = e2.wheres) ? o2 : {}),
      (this.config = r2);
  }
  get template() {
    const t4 = `${this.origin}/${this.definition.uri}`.replace(/\/+$/, '');
    return '' === t4 ? '/' : t4;
  }
  get origin() {
    return this.config.absolute
      ? this.definition.domain
        ? `${this.config.url.match(/^\w+:\/\//)[0]}${this.definition.domain}${this.config.port ? `:${this.config.port}` : ''}`
        : this.config.url
      : '';
  }
  get parameterSegments() {
    var t4, e2;
    return null !=
      (t4 =
        null == (e2 = this.template.match(/{[^}?]+\??}/g))
          ? void 0
          : e2.map(t5 => ({ name: t5.replace(/{|\??}/g, ''), required: !/\?}$/.test(t5) })))
      ? t4
      : [];
  }
  matchesUrl(t4) {
    var e2;
    if (!this.definition.methods.includes('GET')) return false;
    const r2 = this.template
        .replace(/[.*+$()[\]]/g, '\\$&')
        .replace(/(\/?){([^}?]*)(\??)}/g, (t5, e3, r3, n3) => {
          var o3;
          const i3 = `(?<${r3}>${(null == (o3 = this.wheres[r3]) ? void 0 : o3.replace(/(^\^)|(\$$)/g, '')) || '[^/?]+'})`;
          return n3 ? `(${e3}${i3})?` : `${e3}${i3}`;
        })
        .replace(/^\w+:\/\//, ''),
      [n2, o2] = t4.replace(/^\w+:\/\//, '').split('?'),
      i2 = null != (e2 = new RegExp(`^${r2}/?$`).exec(n2)) ? e2 : new RegExp(`^${r2}/?$`).exec(decodeURI(n2));
    if (i2) {
      for (const t5 in i2.groups) i2.groups[t5] = 'string' == typeof i2.groups[t5] ? decodeURIComponent(i2.groups[t5]) : i2.groups[t5];
      return { params: i2.groups, query: S(o2) };
    }
    return false;
  }
  compile(t4) {
    return this.parameterSegments.length
      ? this.template
          .replace(/{([^}?]+)(\??)}/g, (e2, r2, n2) => {
            var o2, i2;
            if (!n2 && [null, void 0].includes(t4[r2]))
              throw new Error(`Ziggy error: '${r2}' parameter is required for route '${this.name}'.`);
            if (this.wheres[r2] && !new RegExp(`^${n2 ? `(${this.wheres[r2]})?` : this.wheres[r2]}$`).test(null != (i2 = t4[r2]) ? i2 : ''))
              throw new Error(
                `Ziggy error: '${r2}' parameter '${t4[r2]}' does not match required format '${this.wheres[r2]}' for route '${this.name}'.`
              );
            return encodeURI(null != (o2 = t4[r2]) ? o2 : '')
              .replace(/%7C/g, '|')
              .replace(/%25/g, '%')
              .replace(/\$/g, '%24');
          })
          .replace(this.config.absolute ? /(\.[^/]+?)(\/\/)/ : /(^)(\/\/)/, '$1/')
          .replace(/\/+$/, '')
      : this.template;
  }
}
class N extends String {
  constructor(e2, r2, n2 = true, o2) {
    if (
      (super(),
      (this.t = null != o2 ? o2 : 'undefined' != typeof Ziggy ? Ziggy : null == globalThis ? void 0 : globalThis.Ziggy),
      (this.t = t({}, this.t, { absolute: n2 })),
      e2)
    ) {
      if (!this.t.routes[e2]) throw new Error(`Ziggy error: route '${e2}' is not in the route list.`);
      (this.i = new x(e2, this.t.routes[e2], this.t)), (this.u = this.l(r2));
    }
  }
  toString() {
    const e2 = Object.keys(this.u)
      .filter(t4 => !this.i.parameterSegments.some(({ name: e3 }) => e3 === t4))
      .filter(t4 => '_query' !== t4)
      .reduce((e3, r2) => t({}, e3, { [r2]: this.u[r2] }), {});
    return (
      this.i.compile(this.u) +
      (function (t4, e3) {
        var r2,
          n2 = t4,
          i2 = (function (t5) {
            if (!t5) return v;
            if (null != t5.encoder && 'function' != typeof t5.encoder) throw new TypeError('Encoder has to be a function.');
            var e4 = t5.charset || v.charset;
            if (void 0 !== t5.charset && 'utf-8' !== t5.charset && 'iso-8859-1' !== t5.charset)
              throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
            var r3 = o.default;
            if (void 0 !== t5.format) {
              if (!c.call(o.formatters, t5.format)) throw new TypeError('Unknown format option provided.');
              r3 = t5.format;
            }
            var n3 = o.formatters[r3],
              i3 = v.filter;
            return (
              ('function' == typeof t5.filter || p(t5.filter)) && (i3 = t5.filter),
              {
                addQueryPrefix: 'boolean' == typeof t5.addQueryPrefix ? t5.addQueryPrefix : v.addQueryPrefix,
                allowDots: void 0 === t5.allowDots ? v.allowDots : !!t5.allowDots,
                charset: e4,
                charsetSentinel: 'boolean' == typeof t5.charsetSentinel ? t5.charsetSentinel : v.charsetSentinel,
                delimiter: void 0 === t5.delimiter ? v.delimiter : t5.delimiter,
                encode: 'boolean' == typeof t5.encode ? t5.encode : v.encode,
                encoder: 'function' == typeof t5.encoder ? t5.encoder : v.encoder,
                encodeValuesOnly: 'boolean' == typeof t5.encodeValuesOnly ? t5.encodeValuesOnly : v.encodeValuesOnly,
                filter: i3,
                format: r3,
                formatter: n3,
                serializeDate: 'function' == typeof t5.serializeDate ? t5.serializeDate : v.serializeDate,
                skipNulls: 'boolean' == typeof t5.skipNulls ? t5.skipNulls : v.skipNulls,
                sort: 'function' == typeof t5.sort ? t5.sort : null,
                strictNullHandling: 'boolean' == typeof t5.strictNullHandling ? t5.strictNullHandling : v.strictNullHandling,
              }
            );
          })(e3);
        'function' == typeof i2.filter ? (n2 = (0, i2.filter)('', n2)) : p(i2.filter) && (r2 = i2.filter);
        var u2 = [];
        if ('object' != typeof n2 || null === n2) return '';
        var a2 = l[e3 && e3.arrayFormat in l ? e3.arrayFormat : e3 && 'indices' in e3 ? (e3.indices ? 'indices' : 'repeat') : 'indices'];
        r2 || (r2 = Object.keys(n2)), i2.sort && r2.sort(i2.sort);
        for (var s2 = 0; s2 < r2.length; ++s2) {
          var f2 = r2[s2];
          (i2.skipNulls && null === n2[f2]) ||
            d(
              u2,
              m(
                n2[f2],
                f2,
                a2,
                i2.strictNullHandling,
                i2.skipNulls,
                i2.encode ? i2.encoder : null,
                i2.filter,
                i2.sort,
                i2.allowDots,
                i2.serializeDate,
                i2.format,
                i2.formatter,
                i2.encodeValuesOnly,
                i2.charset
              )
            );
        }
        var h2 = u2.join(i2.delimiter),
          y2 = true === i2.addQueryPrefix ? '?' : '';
        return (
          i2.charsetSentinel && (y2 += 'iso-8859-1' === i2.charset ? 'utf8=%26%2310003%3B&' : 'utf8=%E2%9C%93&'),
          h2.length > 0 ? y2 + h2 : ''
        );
      })(t({}, e2, this.u._query), {
        addQueryPrefix: true,
        arrayFormat: 'indices',
        encodeValuesOnly: true,
        skipNulls: true,
        encoder: (t4, e3) => ('boolean' == typeof t4 ? Number(t4) : e3(t4)),
      })
    );
  }
  p(e2) {
    e2 ? this.t.absolute && e2.startsWith('/') && (e2 = this.h().host + e2) : (e2 = this.v());
    let r2 = {};
    const [n2, o2] = Object.entries(this.t.routes).find(([t4, n3]) => (r2 = new x(t4, n3, this.t).matchesUrl(e2))) || [void 0, void 0];
    return t({ name: n2 }, r2, { route: o2 });
  }
  v() {
    const { host: t4, pathname: e2, search: r2 } = this.h();
    return (this.t.absolute ? t4 + e2 : e2.replace(this.t.url.replace(/^\w*:\/\/[^/]+/, ''), '').replace(/^\/+/, '/')) + r2;
  }
  current(e2, r2) {
    const { name: n2, params: o2, query: i2, route: u2 } = this.p();
    if (!e2) return n2;
    const a2 = new RegExp(`^${e2.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`).test(n2);
    if ([null, void 0].includes(r2) || !a2) return a2;
    const s2 = new x(n2, u2, this.t);
    r2 = this.l(r2, s2);
    const f2 = t({}, o2, i2);
    if (Object.values(r2).every(t4 => !t4) && !Object.values(f2).some(t4 => void 0 !== t4)) return true;
    const c2 = (t4, e3) =>
      Object.entries(t4).every(([t5, r3]) =>
        Array.isArray(r3) && Array.isArray(e3[t5])
          ? r3.every(r4 => e3[t5].includes(r4))
          : 'object' == typeof r3 && 'object' == typeof e3[t5] && null !== r3 && null !== e3[t5]
          ? c2(r3, e3[t5])
          : e3[t5] == r3
      );
    return c2(r2, f2);
  }
  h() {
    var t4, e2, r2, n2, o2, i2;
    const { host: u2 = '', pathname: a2 = '', search: s2 = '' } = 'undefined' != typeof window ? window.location : {};
    return {
      host: null != (t4 = null == (e2 = this.t.location) ? void 0 : e2.host) ? t4 : u2,
      pathname: null != (r2 = null == (n2 = this.t.location) ? void 0 : n2.pathname) ? r2 : a2,
      search: null != (o2 = null == (i2 = this.t.location) ? void 0 : i2.search) ? o2 : s2,
    };
  }
  get params() {
    const { params: e2, query: r2 } = this.p();
    return t({}, e2, r2);
  }
  get routeParams() {
    return this.p().params;
  }
  get queryParams() {
    return this.p().query;
  }
  has(t4) {
    return this.t.routes.hasOwnProperty(t4);
  }
  l(e2 = {}, r2 = this.i) {
    null != e2 || (e2 = {}), (e2 = ['string', 'number'].includes(typeof e2) ? [e2] : e2);
    const n2 = r2.parameterSegments.filter(({ name: t4 }) => !this.t.defaults[t4]);
    return (
      Array.isArray(e2)
        ? (e2 = e2.reduce((e3, r3, o2) => t({}, e3, n2[o2] ? { [n2[o2].name]: r3 } : 'object' == typeof r3 ? r3 : { [r3]: '' }), {}))
        : 1 !== n2.length ||
          e2[n2[0].name] ||
          (!e2.hasOwnProperty(Object.values(r2.bindings)[0]) && !e2.hasOwnProperty('id')) ||
          (e2 = { [n2[0].name]: e2 }),
      t({}, this.m(r2), this.j(e2, r2))
    );
  }
  m(e2) {
    return e2.parameterSegments
      .filter(({ name: t4 }) => this.t.defaults[t4])
      .reduce((e3, { name: r2 }, n2) => t({}, e3, { [r2]: this.t.defaults[r2] }), {});
  }
  j(e2, { bindings: r2, parameterSegments: n2 }) {
    return Object.entries(e2).reduce((e3, [o2, i2]) => {
      if (!i2 || 'object' != typeof i2 || Array.isArray(i2) || !n2.some(({ name: t4 }) => t4 === o2)) return t({}, e3, { [o2]: i2 });
      if (!i2.hasOwnProperty(r2[o2])) {
        if (!i2.hasOwnProperty('id'))
          throw new Error(`Ziggy error: object passed as '${o2}' parameter is missing route model binding key '${r2[o2]}'.`);
        r2[o2] = 'id';
      }
      return t({}, e3, { [o2]: i2[r2[o2]] });
    }, {});
  }
  valueOf() {
    return this.toString();
  }
}
function T(t4, e2, r2, n2) {
  const o2 = new N(t4, e2, r2, n2);
  return t4 ? o2.toString() : o2;
}
const k = {
  install(t4, e2) {
    const r2 = (t5, r3, n2, o2 = e2) => T(t5, r3, n2, o2);
    parseInt(t4.version) > 2 ? ((t4.config.globalProperties.route = r2), t4.provide('route', r2)) : t4.mixin({ methods: { route: r2 } });
  },
};
async function resolvePageComponent(path, pages) {
  for (const p2 of Array.isArray(path) ? path : [path]) {
    const page = pages[p2];
    if (typeof page === 'undefined') {
      continue;
    }
    return typeof page === 'function' ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const account = 'account';
const Account = 'Account';
const Accounts = 'Accounts';
const Actions = 'Actions';
const Active = 'Active';
const Activities = 'Activities';
const add = 'add';
const Addition = 'Addition';
const Address = 'Address';
const ADJUSTMENT = 'ADJUSTMENT';
const Adjustment = 'Adjustment';
const adjustment = 'adjustment';
const Adjustments = 'Adjustments';
const Adv = 'Adv';
const Advance = 'Advance';
const Amount = 'Amount';
const and = 'and';
const Application = 'Application';
const Apply = 'Apply';
const attachment = 'attachment';
const Attachments = 'Attachments';
const Balance = 'Balance';
const barcode = 'barcode';
const Batch = 'Batch';
const Bill = 'Bill';
const Bookings = 'Bookings';
const brand = 'brand';
const Brand = 'Brand';
const Brands = 'Brands';
const BXGY = 'BXGY';
const By = 'By';
const Calendar = 'Calendar';
const Cancel = 'Cancel';
const Cash = 'Cash';
const Categories = 'Categories';
const category = 'category';
const Category = 'Category';
const Chanelog = 'Chanelog';
const Checkbox = 'Checkbox';
const City = 'City';
const Close = 'Close';
const Code = 'Code';
const Color = 'Color';
const color = 'color';
const Combo = 'Combo';
const Comment = 'Comment';
const Company = 'Company';
const Complete = 'Complete';
const complete = 'complete';
const Compound = 'Compound';
const Confirm = 'Confirm';
const Contact = 'Contact';
const Cost = 'Cost';
const Country = 'Country';
const Create = 'Create';
const created = 'created';
const Credit = 'Credit';
const Custom = 'Custom';
const Customer = 'Customer';
const Customers = 'Customers';
const Customize = 'Customize';
const Dark = 'Dark';
const Dashboard = 'Dashboard';
const Data = 'Data';
const Debit = 'Debit';
const Delete = 'Delete';
const deleted = 'deleted';
const delete_text = 'delete_text';
const Deliveries = 'Deliveries';
const Delivery = 'Delivery';
const delivery = 'delivery';
const Description = 'Description';
const Design = 'Design';
const Details = 'Details';
const Difference = 'Difference';
const Digital = 'Digital';
const Dimensions = 'Dimensions';
const Disable = 'Disable';
const Discount = 'Discount';
const Divide = 'Divide';
const Download = 'Download';
const Due = 'Due';
const edit = 'edit';
const Email = 'Email';
const Enable = 'Enable';
const Event = 'Event';
const Exclusive = 'Exclusive';
const Expanse = 'Expanse';
const Expected = 'Expected';
const expense = 'expense';
const Expense = 'Expense';
const Expenses = 'Expenses';
const Expiry = 'Expiry';
const Feature = 'Feature';
const Featured = 'Featured';
const Fees = 'Fees';
const File = 'File';
const Finalize = 'Finalize';
const Fixed = 'Fixed';
const For = 'For';
const Form = 'Form';
const Formula = 'Formula';
const Fraction = 'Fraction';
const From = 'From';
const Full = 'Full';
const General = 'General';
const Get = 'Get';
const GiftCard = 'GiftCard';
const Guide = 'Guide';
const Hide = 'Hide';
const Hold = 'Hold';
const Home = 'Home';
const Icon = 'Icon';
const Id = 'Id';
const Impersonated = 'Impersonated';
const Import = 'Import';
const Included = 'Included';
const Inclusive = 'Inclusive';
const Initiate = 'Initiate';
const item = 'item';
const Item = 'Item';
const items = 'items';
const Items = 'Items';
const Keywords = 'Keywords';
const Labels = 'Labels';
const Language = 'Language';
const Light = 'Light';
const Load = 'Load';
const Logo = 'Logo';
const Mail = 'Mail';
const Main = 'Main';
const Method = 'Method';
const Minus = 'Minus';
const Models = 'Models';
const Modern = 'Modern';
const more = 'more';
const Multiple = 'Multiple';
const Name = 'Name';
const New = 'New';
const NewLine = 'NewLine';
const Next = 'Next';
const Nofollow = 'Nofollow';
const Noindex = 'Noindex';
const Notifications = 'Notifications';
const Offline = 'Offline';
const Open = 'Open';
const Operator = 'Operator';
const Option = 'Option';
const optional = 'optional';
const Options = 'Options';
const Order = 'Order';
const Orders = 'Orders';
const Others = 'Others';
const Overview = 'Overview';
const Page = 'Page';
const Paid = 'Paid';
const Partial = 'Partial';
const Password = 'Password';
const Payable = 'Payable';
const payment = 'payment';
const Payment = 'Payment';
const Payments = 'Payments';
const People = 'People';
const Percentage = 'Percentage';
const Permissions = 'Permissions';
const Phone = 'Phone';
const Photo = 'Photo';
const Photos = 'Photos';
const Plus = 'Plus';
const points = 'points';
const Points = 'Points';
const POS = 'POS';
const Previous = 'Previous';
const Price = 'Price';
const Print = 'Print';
const product = 'product';
const Product = 'Product';
const Products = 'Products';
const Profile = 'Profile';
const Profit = 'Profit';
const Promotion = 'Promotion';
const Promotions = 'Promotions';
const purchase = 'purchase';
const Purchase = 'Purchase';
const Purchased = 'Purchased';
const Purchases = 'Purchases';
const Qty = 'Qty';
const quantity = 'quantity';
const Quantity = 'Quantity';
const Quotation = 'Quotation';
const quotation = 'quotation';
const Quotations = 'Quotations';
const Rack = 'Rack';
const Radio = 'Radio';
const Rate = 'Rate';
const Receipt = 'Receipt';
const Received = 'Received';
const Recipe = 'Recipe';
const Record = 'Record';
const record = 'record';
const Recoverable = 'Recoverable';
const Ref = 'Ref';
const Reference = 'Reference';
const Regards = 'Regards';
const Register = 'Register';
const Registers = 'Registers';
const Remove = 'Remove';
const Reports = 'Reports';
const Required = 'Required';
const Reset = 'Reset';
const Resetting = 'Resetting';
const return_order = 'return_order';
const Role = 'Role';
const Roles = 'Roles';
const Rounding = 'Rounding';
const sale = 'sale';
const Sale = 'Sale';
const Sales = 'Sales';
const Save = 'Save';
const saved = 'saved';
const Search = 'Search';
const Select = 'Select';
const Sent = 'Sent';
const Serial = 'Serial';
const Service = 'Service';
const Settings = 'Settings';
const Shop = 'Shop';
const Sidebar = 'Sidebar';
const Simple = 'Simple';
const Size = 'Size';
const size = 'size';
const SKU = 'SKU';
const Slug = 'Slug';
const Sold = 'Sold';
const Staff = 'Staff';
const Standard = 'Standard';
const start = 'start';
const state = 'state';
const State = 'State';
const Stock = 'Stock';
const Store = 'Store';
const store = 'store';
const Stores = 'Stores';
const Street = 'Street';
const Sub = 'Sub';
const Subcategory = 'Subcategory';
const Subtotal = 'Subtotal';
const Subtraction = 'Subtraction';
const Supplier = 'Supplier';
const Suppliers = 'Suppliers';
const Support = 'Support';
const Surcharge = 'Surcharge';
const SXGD = 'SXGD';
const Symbology = 'Symbology';
const Syncing = 'Syncing';
const System = 'System';
const Tax = 'Tax';
const tax = 'tax';
const Taxes = 'Taxes';
const Template = 'Template';
const Text = 'Text';
const Textarea = 'Textarea';
const The = 'The';
const Till = 'Till';
const Time = 'Time';
const Timezone = 'Timezone';
const Title = 'Title';
const To = 'To';
const Total = 'Total';
const transfer = 'transfer';
const Transfer = 'Transfer';
const Transfers = 'Transfers';
const Trashed = 'Trashed';
const Type = 'Type';
const Unit = 'Unit';
const unit = 'unit';
const Units = 'Units';
const Unknown = 'Unknown';
const Update = 'Update';
const updated = 'updated';
const Url = 'URL';
const User = 'User';
const Username = 'Username';
const Users = 'Users';
const Variant = 'Variant';
const Variants = 'Variants';
const Variation = 'Variation';
const variation = 'variation';
const variations = 'variations';
const Variations = 'Variations';
const View = 'View';
const Weight = 'Weight';
const en = {
  '10 per sheet (4in x 2in)': '10 per sheet (4in x 2in)',
  '12 per sheet (A4) (2.5in x 2.834in)': '12 per sheet (A4) (2.5in x 2.834in)',
  '18 per sheet (A4) (2.5in x 1.835in)': '18 per sheet (A4) (2.5in x 1.835in)',
  '20 per sheet (4in x 1in)': '20 per sheet (4in x 1in)',
  '24 per sheet (A4) (2.48in x 1.334in)': '24 per sheet (A4) (2.48in x 1.334in)',
  '30 per sheet (2.625in x 1in)': '30 per sheet (2.625in x 1in)',
  '40 per sheet (A4) (1.799in x 1.003in)': '40 per sheet (A4) (1.799in x 1.003in)',
  '403: Forbidden': '403: Forbidden',
  '404: Page Not Found': '404: Page Not Found',
  '500: Server Error': '500: Server Error',
  '503: Service Unavailable': '503: Service Unavailable',
  'Accept Invitation': 'Accept Invitation',
  account,
  Account,
  'Account is not active!': 'Account is not active!',
  Accounts,
  Actions,
  Active,
  Activities,
  'Activity Logs': 'Activity Logs',
  add,
  'Add Account': 'Add Account',
  'Add additional security to your account using two factor authentication.':
    'Add additional security to your account using two factor authentication.',
  'Add Address': 'Add Address',
  'Add another Payment': 'Add another Payment',
  'add balance to': 'add balance to',
  'Add Brand': 'Add Brand',
  'Add Category': 'Add Category',
  Addition,
  'Addition/Extra/Found': 'Addition/Extra/Found',
  'Add More Payment': 'Add More Payment',
  'Add New': 'Add New',
  'Add new sale': 'Add new sale',
  'Add New {x}': 'Add New {x}',
  'Add page break after each label': 'Add page break after each label',
  Address,
  'Address Line 1': 'Address Line 1',
  'Address Line 2': 'Address Line 2',
  'Address name with email already exists': 'Address name with email already exists',
  'Address name with phone already exists': 'Address name with phone already exists',
  'Add to Order': 'Add to Order',
  'Add {x}': 'Add {x}',
  ADJUSTMENT,
  Adjustment,
  adjustment,
  'Adjustment Items': 'Adjustment Items',
  'Adjustment No. {x}': 'Adjustment No. {x}',
  Adjustments,
  'Adjust Store Stock?': 'Adjust Store Stock?',
  Adv,
  Advance,
  'Advance Payment': 'Advance Payment',
  'after all payments': 'after all payments',
  'Alert (Low Stock) Quantity': 'Alert (Low Stock) Quantity',
  'All-time': 'All-time',
  'All of your data will be permanently changed.': 'All of your data will be permanently changed.',
  'Allow overselling': 'Allow overselling',
  'Allow to change price': 'Allow to change price',
  'Allow to change price while selling': 'Allow to change price while selling',
  'All Variations': 'All Variations',
  'Already registered?': 'Already registered?',
  Amount,
  'Amount Paid': 'Amount Paid',
  'Amount to spend': 'Amount to spend',
  'Amount Value': 'Amount Value',
  and,
  'A new verification link has been sent to the email address you provided in your profile settings.':
    'A new verification link has been sent to the email address you provided in your profile settings.',
  'A new verification link has been sent to your email address.': 'A new verification link has been sent to your email address.',
  'Any Notes': 'Any Notes',
  'Any sale details': 'Any sale details',
  'API Token': 'API Token',
  'API Token Permissions': 'API Token Permissions',
  'API Tokens': 'API Tokens',
  'API tokens allow third-party services to authenticate with our application on your behalf.':
    'API tokens allow third-party services to authenticate with our application on your behalf.',
  Application,
  'Application Settings': 'Application Settings',
  Apply,
  'Apply as discount': 'Apply as discount',
  'Apply to': 'Apply to',
  'Apply to same state customers': 'Apply to same state customers',
  'Apply transaction fees': 'Apply transaction fees',
  'Are you sure you want to delete the {record}?': 'Are you sure you want to delete the {record}?',
  'Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.':
    'Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.',
  'Are you sure you want to perform stock adjustments?': 'Are you sure you want to perform stock adjustments?',
  'Are you sure you would like to delete this API token?': 'Are you sure you would like to delete this API token?',
  'At least one brand or category should be selected for partial stock count.':
    'At least one brand or category should be selected for partial stock count.',
  attachment,
  'Attachment deleted!': 'Attachment deleted!',
  Attachments,
  'Authorize.net Login': 'Authorize.net Login',
  'Authorize.net Transaction Key': 'Authorize.net Transaction Key',
  'Auto open first order on POS': 'Auto open first order on POS',
  'Auto print or open browser print dialog': 'Auto print or open browser print dialog',
  'Awarded points for {sale}': 'Awarded points for {sale}',
  'Award Point': 'Award Point',
  'AWS SES Key': 'AWS SES Key',
  'AWS SES Region': 'AWS SES Region',
  'AWS SES Secret': 'AWS SES Secret',
  'Back to Homepage': 'Back to Homepage',
  'Back to Login': 'Back to Login',
  Balance,
  'Balance Amount': 'Balance Amount',
  barcode,
  'Barcode Contains': 'Barcode Contains',
  'Barcode Height': 'Barcode Height',
  'Barcode Length': 'Barcode Length',
  'Base Unit': 'Base Unit',
  Batch,
  'Batch No.': 'Batch No.',
  "Before continuing, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.":
    "Before continuing, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.",
  Bill,
  Bookings,
  'Both (credit & debit)': 'Both (credit & debit)',
  brand,
  Brand,
  Brands,
  'Browser Sessions': 'Browser Sessions',
  'Bulk Action': 'Bulk Action',
  'Bulk actions': 'Bulk actions',
  'Buy X get Y (BXGY)': 'Buy X get Y (BXGY)',
  BXGY,
  By,
  Calendar,
  'Can be impersonated': 'Can be impersonated',
  Cancel,
  'Can remove order items': 'Can remove order items',
  'Card Terminal': 'Card Terminal',
  Cash,
  'Cash Amount': 'Cash Amount',
  'Cash in Hand': 'Cash in Hand',
  'Cash in hand': 'Cash in hand',
  'Cash in register': 'Cash in register',
  'Cash Register': 'Cash Register',
  'Cash Submitted': 'Cash Submitted',
  Categories,
  category,
  Category,
  'CC Amount': 'CC Amount',
  Chanelog,
  'Change file': 'Change file',
  'Check/Uncheck All': 'Check/Uncheck All',
  Checkbox,
  'Check for Promotions': 'Check for Promotions',
  City,
  'Click here to re-send the verification email.': 'Click here to re-send the verification email.',
  Close,
  'Closed at': 'Closed at',
  'Closed by': 'Closed by',
  'Close Register': 'Close Register',
  'Close sidebar': 'Close sidebar',
  Code,
  Color,
  color,
  Combo,
  'Combo Products': 'Combo Products',
  Comment,
  Company,
  'Company already exists': 'Company already exists',
  Complete,
  complete,
  'Completed at': 'Completed at',
  'Completed by': 'Completed by',
  'Complete Stock Count': 'Complete Stock Count',
  Compound,
  'Compound: this tax should be applied after other taxes': 'Compound: this tax should be applied after other taxes',
  Confirm,
  'Confirm Password': 'Confirm Password',
  Contact,
  'Continuous Feed': 'Continuous Feed',
  'Converted at': 'Converted at',
  Cost,
  Country,
  Create,
  'Create Account': 'Create Account',
  'Create All': 'Create All',
  'Create API Token': 'Create API Token',
  created,
  'Created.': 'Created.',
  'Created at': 'Created at',
  'Created  by': 'Created  by',
  'Created by': 'Created by',
  'Create {x}': 'Create {x}',
  Credit,
  'Credit Card Amount': 'Credit Card Amount',
  'Credit Card Gateway': 'Credit Card Gateway',
  'Credit Card Value': 'Credit Card Value',
  'Current Password': 'Current Password',
  Custom,
  Customer,
  'Customer group': 'Customer group',
  'Customer Group': 'Customer Group',
  'Customer Group Price Group': 'Customer Group Price Group',
  'Customer Groups': 'Customer Groups',
  'Customer name with email already exists': 'Customer name with email already exists',
  'Customer name with phone already exists': 'Customer name with phone already exists',
  Customers,
  'Customer Statement': 'Customer Statement',
  'Custom field': 'Custom field',
  'Custom Field': 'Custom Field',
  'Custom Fieldes': 'Custom Fieldes',
  'Custom Fields': 'Custom Fields',
  Customize,
  'Customize Report': 'Customize Report',
  'Daily Sales': 'Daily Sales',
  Dark,
  'Dark Mode Icon': 'Dark Mode Icon',
  'Dark Mode Logo': 'Dark Mode Logo',
  'Dark side bar': 'Dark side bar',
  'Dark top bar': 'Dark top bar',
  Dashboard,
  Data,
  Date: 'Date',
  'Date & Number Locale': 'Date & Number Locale',
  'Date Format': 'Date Format',
  Debit,
  'Default Account': 'Default Account',
  'Default Category': 'Default Category',
  'Default Currency': 'Default Currency',
  'Default Customer': 'Default Customer',
  'Default Product Taxes': 'Default Product Taxes',
  'Default Store': 'Default Store',
  Delete,
  'Delete Account': 'Delete Account',
  'Delete All': 'Delete All',
  'Delete API Token': 'Delete API Token',
  deleted,
  'Delete Order': 'Delete Order',
  delete_text,
  'Delete {x}': 'Delete {x}',
  'Delivered at': 'Delivered at',
  'Delivered by': 'Delivered by',
  Deliveries,
  Delivery,
  delivery,
  'Delivery Order No. {x}': 'Delivery Order No. {x}',
  Description,
  'Description/Summary': 'Description/Summary',
  Design,
  Details,
  Difference,
  Digital,
  Dimensions,
  'Dimension Unit': 'Dimension Unit',
  Disable,
  Discount,
  Divide,
  'Done.': 'Done.',
  'Do not track stock for this product': 'Do not track stock for this product',
  Download,
  'Download excel file to complete': 'Download excel file to complete',
  'Download final excel file': 'Download final excel file',
  Due,
  'Due Amount': 'Due Amount',
  'Due Date': 'Due Date',
  'Due Limit': 'Due Limit',
  'Each sale amounting to': 'Each sale amounting to',
  edit,
  'Edit Account': 'Edit Account',
  'Edit all': 'Edit all',
  'Edit all records': 'Edit all records',
  'Edit Brand': 'Edit Brand',
  'Edit Category': 'Edit Category',
  'Editing payment': 'Editing payment',
  'Edit Profile': 'Edit Profile',
  'Edit {x}': 'Edit {x}',
  Email,
  'Emailed at': 'Emailed at',
  'Email Password Reset Link': 'Email Password Reset Link',
  'Email Verification': 'Email Verification',
  'Email {x}': 'Email {x}',
  Enable,
  'Enable impersonation': 'Enable impersonation',
  'Enable onscreen keyboard': 'Enable onscreen keyboard',
  'Enable PayPal Payments': 'Enable PayPal Payments',
  'Enable restaurant feature for POS i.e, halls, tables & recipes': 'Enable restaurant feature for POS i.e, halls, tables & recipes',
  'Enable Stripe Terminal': 'Enable Stripe Terminal',
  'End Date': 'End Date',
  'Ensure your account is using a long, random password to stay secure.':
    'Ensure your account is using a long, random password to stay secure.',
  'Estimated Profit': 'Estimated Profit',
  Event,
  'Excel File': 'Excel File',
  'Excel file should have name & parent_category columns.': 'Excel file should have name & parent_category columns.',
  'Excel file should have name, phone, email, company, due_limit, lot_no, street, address_line_1, address_line_2, city, postal_code, state and country columns.':
    'Excel file should have name, phone, email, company, due_limit, lot_no, street, address_line_1, address_line_2, city, postal_code, state and country columns.',
  'Excel file should have name, phone, email, company, due_limit, price_group, customer_group, lot_no, street, address_line_1, address_line_2, city, postal_code, state and country columns.':
    'Excel file should have name, phone, email, company, due_limit, price_group, customer_group, lot_no, street, address_line_1, address_line_2, city, postal_code, state and country columns.',
  'Excel file should have name column.': 'Excel file should have name column.',
  'Excel file should have {x} columns.': 'Excel file should have {x} columns.',
  Exclusive,
  Expanse,
  Expected,
  expense,
  Expense,
  'Expense No. {x}': 'Expense No. {x}',
  Expenses,
  Expiry,
  'Expiry Date': 'Expiry Date',
  'Export {x}': 'Export {x}',
  Feature,
  Featured,
  Fees,
  File,
  'file selected': 'file selected',
  'files selected': 'files selected',
  'Final File': 'Final File',
  Finalize,
  'Finalize Sale': 'Finalize Sale',
  'Finish enabling two factor authentication.': 'Finish enabling two factor authentication.',
  Fixed,
  'Fixed Fee Amount': 'Fixed Fee Amount',
  'Fixed Fees': 'Fixed Fees',
  'Flag Characters Length': 'Flag Characters Length',
  For,
  'For Customers': 'For Customers',
  'Forgot Password': 'Forgot Password',
  'Forgot your password?': 'Forgot your password?',
  'Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.':
    'Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.',
  Form,
  'Form Page': 'Form Page',
  Formula,
  'For Staff': 'For Staff',
  'For your security, please confirm your password to continue.': 'For your security, please confirm your password to continue.',
  Fraction,
  From,
  'From Store': 'From Store',
  Full,
  'Full Stock Count': 'Full Stock Count',
  General,
  'General Settings': 'General Settings',
  'General settings for the application use and views': 'General settings for the application use and views',
  'Generate Variations': 'Generate Variations',
  Get,
  'Gift Card': 'Gift Card',
  GiftCard,
  'gift card': 'gift card',
  'Gift card already exists': 'Gift card already exists',
  'Gift Card Amount': 'Gift Card Amount',
  'Gift card balance is not enough.': 'Gift card balance is not enough.',
  'Gift card does not belong to this customer.': 'Gift card does not belong to this customer.',
  'Gift card does not have enough balance.': 'Gift card does not have enough balance.',
  'Gift Card Logs': 'Gift Card Logs',
  'gift card number': 'gift card number',
  'Gift Card Number': 'Gift Card Number',
  'Gift Cards': 'Gift Cards',
  'Gift card used to make payment': 'Gift card used to make payment',
  'Go to {x}': 'Go to {x}',
  'Grand Total': 'Grand Total',
  Guide,
  'Has expiry date': 'Has expiry date',
  Hide,
  'Hide ID': 'Hide ID',
  'Hide in POS': 'Hide in POS',
  'Hide in Shop': 'Hide in Shop',
  Hold,
  Home,
  'HSN Number': 'HSN Number',
  'I agree to the': 'I agree to the',
  Icon,
  Id,
  'If necessary, you may log out of all of your other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.':
    'If necessary, you may log out of all of your other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.',
  'If you already have an account, you may accept this invitation by clicking the button below:':
    'If you already have an account, you may accept this invitation by clicking the button below:',
  'If you did not expect to receive an invitation to this team, you may discard this email.':
    'If you did not expect to receive an invitation to this team, you may discard this email.',
  'If you do not have an account, you may create one by clicking the button below. After creating an account, you may click the invitation acceptance button in this email to accept the team invitation:':
    'If you do not have an account, you may create one by clicking the button below. After creating an account, you may click the invitation acceptance button in this email to accept the team invitation:',
  'I have collected payment & saved receipt': 'I have collected payment & saved receipt',
  Impersonated,
  Import,
  'Import/Export': 'Import/Export',
  'Import {x}': 'Import {x}',
  'In Browser (Javascript)': 'In Browser (Javascript)',
  Included,
  Inclusive,
  'Inclusive Tax Calculation Formula': 'Inclusive Tax Calculation Formula',
  'Initial stock on adjustment': 'Initial stock on adjustment',
  Initiate,
  'Initiate Adjustments': 'Initiate Adjustments',
  'In Store': 'In Store',
  'Invalid pin code!': 'Invalid pin code!',
  'Inventory Accounting Method': 'Inventory Accounting Method',
  item,
  Item,
  'Item Code Characters Length': 'Item Code Characters Length',
  'Item Code Start Position': 'Item Code Start Position',
  items,
  Items,
  Keywords,
  'Label Height': 'Label Height',
  Labels,
  'Label Width': 'Label Width',
  Language,
  'Language has been changed.': 'Language has been changed.',
  'Language is not available yet.': 'Language is not available yet.',
  'Last 7 days': 'Last 7 days',
  'Last 30 days': 'Last 30 days',
  'Last 60 days': 'Last 60 days',
  'Last active': 'Last active',
  'Last used': 'Last used',
  Light,
  'List All {x}': 'List All {x}',
  'List Open Orders': 'List Open Orders',
  'List Orders': 'List Orders',
  'List Page': 'List Page',
  'List POS Orders': 'List POS Orders',
  'List Sales': 'List Sales',
  'List {x}': 'List {x}',
  Load,
  'Log in': 'Log in',
  Logo,
  'Log Out': 'Log Out',
  'Log Out Other Browser Sessions': 'Log Out Other Browser Sessions',
  'Lot No.': 'Lot No.',
  'Low Stock': 'Low Stock',
  'Loyalty Points': 'Loyalty Points',
  'L x  W x H': 'L x  W x H',
  Mail,
  'Mail Driver': 'Mail Driver',
  'MailerSend API Key': 'MailerSend API Key',
  'Mail From Email Address': 'Mail From Email Address',
  'Mail From Name': 'Mail From Name',
  'Mailgun Domain': 'Mailgun Domain',
  'Mailgun Endpoint': 'Mailgun Endpoint',
  'Mailgun Secret': 'Mailgun Secret',
  'Mail Settings': 'Mail Settings',
  'Mail settings successfully saved.': 'Mail settings successfully saved.',
  Main,
  'Manage Account': 'Manage Account',
  'Manage API Tokens': 'Manage API Tokens',
  'Mark as delivered': 'Mark as delivered',
  'Max. Discount': 'Max. Discount',
  'Max. Price': 'Max. Price',
  'Maximum 1000 labels can be printed at a time!': 'Maximum 1000 labels can be printed at a time!',
  'Maximum Discount': 'Maximum Discount',
  'Maximum Price': 'Maximum Price',
  Method,
  'Method Details': 'Method Details',
  'Min. Price': 'Min. Price',
  'Minimum Price': 'Minimum Price',
  Minus,
  Models,
  Modern,
  'Monthly Sales': 'Monthly Sales',
  more,
  Multiple,
  'N/A': 'N/A',
  Name,
  New,
  NewLine,
  'New Password': 'New Password',
  Next,
  'No data found, the record might not belong to the selected store.': 'No data found, the record might not belong to the selected store.',
  Nofollow,
  'No Follow': 'No Follow',
  Noindex,
  'No Index': 'No Index',
  'No product found with code {code}': 'No product found with code {code}',
  'No register is open!': 'No register is open!',
  'No suggestions to list.': 'No suggestions to list.',
  'No Suspended Orders': 'No Suspended Orders',
  Notifications,
  'Not Trashed': 'Not Trashed',
  Number: 'Number',
  'Official receipt will be issued after receiving payment.': 'Official receipt will be issued after receiving payment.',
  Offline,
  'Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.':
    'Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.',
  'Only Trashed': 'Only Trashed',
  'On Server Side (PHP)': 'On Server Side (PHP)',
  Open,
  'Opened at': 'Opened at',
  'Opened by': 'Opened by',
  'Opened Orders': 'Opened Orders',
  'Opening Balance': 'Opening Balance',
  'Open menu': 'Open menu',
  'Open New Order': 'Open New Order',
  'Open Orders': 'Open Orders',
  'Open Orders (on hold)': 'Open Orders (on hold)',
  'Open POS Orders': 'Open POS Orders',
  'Open Register': 'Open Register',
  'Open Sidebar': 'Open Sidebar',
  'Open user menu': 'Open user menu',
  'Operation Value': 'Operation Value',
  Operator,
  Option,
  optional,
  Options,
  'Option {x}': 'Option {x}',
  Order,
  'Order Details': 'Order Details',
  'Order Discount': 'Order Discount',
  'Order No.': 'Order No.',
  'Order No. {x}': 'Order No. {x}',
  'Order Number': 'Order Number',
  'Order Ref': 'Order Ref',
  Orders,
  'Order To': 'Order To',
  'or drag and drop': 'or drag and drop',
  'Other Amount': 'Other Amount',
  'Other Countries Percentage': 'Other Countries Percentage',
  'Other Payment Amount': 'Other Payment Amount',
  'Other Payments Value': 'Other Payments Value',
  Others,
  'Other Settigns': 'Other Settigns',
  'Overdue {x}': 'Overdue {x}',
  Overview,
  'Packing List': 'Packing List',
  Page,
  Paid,
  'Paid Amount': 'Paid Amount',
  'Parent Category': 'Parent Category',
  'parent_category is the name of the parent category.': 'parent_category is the name of the parent category.',
  Partial,
  'Partial Stock Count': 'Partial Stock Count',
  Password,
  Payable,
  'Payable Amount': 'Payable Amount',
  payment,
  Payment,
  'Payment deleted!': 'Payment deleted!',
  'Payment Gateways': 'Payment Gateways',
  'Payment No. {x}': 'Payment No. {x}',
  'Payment Note': 'Payment Note',
  'Payment Receipt': 'Payment Receipt',
  'Payment Received': 'Payment Received',
  'Payment Request': 'Payment Request',
  'Payment Requests': 'Payment Requests',
  'Payment restored!': 'Payment restored!',
  Payments,
  'Payment Settings': 'Payment Settings',
  'Payment settings successfully saved.': 'Payment settings successfully saved.',
  'Payments Sent': 'Payments Sent',
  'Paymes Public Key': 'Paymes Public Key',
  'Paymes Secret Key': 'Paymes Secret Key',
  'PayPal Client Id': 'PayPal Client Id',
  'PayPal Secret': 'PayPal Secret',
  People,
  Percentage,
  'Percentage Fees': 'Percentage Fees',
  'Perform bulk actions': 'Perform bulk actions',
  'Perform Bulk Actions': 'Perform Bulk Actions',
  'Permanently delete your account.': 'Permanently delete your account.',
  Permissions,
  Phone,
  Photo,
  Photos,
  'Play sound on order item': 'Play sound on order item',
  'Please add at least one item to form.': 'Please add at least one item to form.',
  'Please add at least one item to the order.': 'Please add at least one item to the order.',
  'Please add at least one product!': 'Please add at least one product!',
  'Please add at least one product.': 'Please add at least one product.',
  'Please add card details below.': 'Please add card details below.',
  'Please add products the below to print label.': 'Please add products the below to print label.',
  'Please click the order below to load it.': 'Please click the order below to load it.',
  'Please configure the mail driver and settings.': 'Please configure the mail driver and settings.',
  'Please configure the payment settings.': 'Please configure the payment settings.',
  'Please configure the settings to parse scale barcodes.': 'Please configure the settings to parse scale barcodes.',
  'Please confirm access to your account by entering one of your emergency recovery codes.':
    'Please confirm access to your account by entering one of your emergency recovery codes.',
  'Please confirm access to your account by entering the authentication code provided by your authenticator application.':
    'Please confirm access to your account by entering the authentication code provided by your authenticator application.',
  'Please confirm that you would like to delete the record?': 'Please confirm that you would like to delete the record?',
  "Please copy your new API token. For your security, it won't be shown again.":
    "Please copy your new API token. For your security, it won't be shown again.",
  'Please edit the order item data below.': 'Please edit the order item data below.',
  'Please edit to complete the stock count with checked excel file.': 'Please edit to complete the stock count with checked excel file.',
  'Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices.':
    'Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices.',
  'Please fill the discount below to apply to form.': 'Please fill the discount below to apply to form.',
  'Please fill the form below to add new record.': 'Please fill the form below to add new record.',
  'Please fill the form below to {action} record.': 'Please fill the form below to {action} record.',
  'Please fill the form below to {action} {record}.': 'Please fill the form below to {action} {record}.',
  'Please fill the payment details to finalize.': 'Please fill the payment details to finalize.',
  'Please open a register first!': 'Please open a register first!',
  'Please prefer store name and email': 'Please prefer store name and email',
  'Please provide pin code to remove item from order': 'Please provide pin code to remove item from order',
  'Please review the data below': 'Please review the data below',
  'Please review the day data below': 'Please review the day data below',
  'Please review the details below.': 'Please review the details below.',
  'Please review the year data below': 'Please review the year data below',
  'Please select a store first!': 'Please select a store first!',
  'Please select template!': 'Please select template!',
  'Please select the category to load products': 'Please select the category to load products',
  'Please select the desired filters below.': 'Please select the desired filters below.',
  'Please select the variant to add item to order list.': 'Please select the variant to add item to order list.',
  'Please set the settings to parse scale barcodes.': 'Please set the settings to parse scale barcodes.',
  'Please type the cash in hand to open register.': 'Please type the cash in hand to open register.',
  'Please type the reference to open form.': 'Please type the reference to open form.',
  'Please type to search': 'Please type to search',
  'Please update setting as you desire': 'Please update setting as you desire',
  'Please update the details below': 'Please update the details below',
  'Please upload the excel file to import records.': 'Please upload the excel file to import records.',
  'Please view the app alerts below': 'Please view the app alerts below',
  'Please view the details below': 'Please view the details below',
  'Please view the payment by clicking the link below.': 'Please view the payment by clicking the link below.',
  'Please view the purchase order by clicking the link below.': 'Please view the purchase order by clicking the link below.',
  'Please view the quotation by clicking the link below.': 'Please view the quotation by clicking the link below.',
  'Please view the register details below.': 'Please view the register details below.',
  'Please view the return order by clicking the link below.': 'Please view the return order by clicking the link below.',
  'Please view your sale by clicking the link below.': 'Please view your sale by clicking the link below.',
  'Please view your transfer by clicking the link below.': 'Please view your transfer by clicking the link below.',
  Plus,
  'Point of Sale': 'Point of Sale',
  points,
  Points,
  POS,
  'POS Orders': 'POS Orders',
  'POS Sale': 'POS Sale',
  'POS Screen': 'POS Screen',
  'POS Settings': 'POS Settings',
  'Postal/ZIP Code': 'Postal/ZIP Code',
  'Postmark Token': 'Postmark Token',
  Previous,
  Price,
  'Price * Tax Rate / (100 + Tax Rate) = Tax Amount': 'Price * Tax Rate / (100 + Tax Rate) = Tax Amount',
  'Price * Tax Rate / 100 = Tax Amount': 'Price * Tax Rate / 100 = Tax Amount',
  'Price Characters Length': 'Price Characters Length',
  'Price Divide by': 'Price Divide by',
  'Price group': 'Price group',
  'Price Group': 'Price Group',
  'Price Groups': 'Price Groups',
  'Price Start Position': 'Price Start Position',
  Print,
  'Print Bill': 'Print Bill',
  'Printed at': 'Printed at',
  'Printed by': 'Printed by',
  'Print Order': 'Print Order',
  'Print Receipt': 'Print Receipt',
  'Print using POS Print Server': 'Print using POS Print Server',
  'Privacy Policy': 'Privacy Policy',
  product,
  Product,
  'Product Code': 'Product Code',
  'Product Details': 'Product Details',
  'Product Labels': 'Product Labels',
  'Product quantity sync for adjustment item.': 'Product quantity sync for adjustment item.',
  Products,
  'Product to buy': 'Product to buy',
  'Product to get': 'Product to get',
  'Product Tracks': 'Product Tracks',
  Profile,
  'Profile Information': 'Profile Information',
  Profit,
  Promotion,
  Promotions,
  purchase,
  Purchase,
  'Purchase Cost': 'Purchase Cost',
  Purchased,
  'Purchase Items': 'Purchase Items',
  'Purchase No. {x}': 'Purchase No. {x}',
  'Purchase Order': 'Purchase Order',
  'Purchase Return Orders': 'Purchase Return Orders',
  Purchases,
  'Purchases Amount': 'Purchases Amount',
  'Purchase Unit': 'Purchase Unit',
  Qty,
  'Qty:': 'Qty:',
  quantity,
  Quantity,
  'Quantity/Weight': 'Quantity/Weight',
  'Quantity Fraction': 'Quantity Fraction',
  'Quantity to buy': 'Quantity to buy',
  'Quantity to get': 'Quantity to get',
  Quotation,
  quotation,
  'Quotation Items': 'Quotation Items',
  'Quotation No. {x}': 'Quotation No. {x}',
  Quotations,
  'Quote To': 'Quote To',
  Rack,
  'Rack Location': 'Rack Location',
  Radio,
  Rate,
  'reached due limit': 'reached due limit',
  'Read all records': 'Read all records',
  'Read All Records': 'Read All Records',
  Receipt,
  'Receipt/Sale View': 'Receipt/Sale View',
  'Receipt Footer': 'Receipt Footer',
  'Receipt Header': 'Receipt Header',
  Received,
  'Received Amount': 'Received Amount',
  'Received by': 'Received by',
  'Received from': 'Received from',
  Recipe,
  Record,
  record,
  Recoverable,
  'Recovery Code': 'Recovery Code',
  Ref,
  Reference,
  Regards,
  'Regenerate Recovery Codes': 'Regenerate Recovery Codes',
  Register,
  'Register already opened!': 'Register already opened!',
  'Register Details': 'Register Details',
  Registers,
  'Registration Number': 'Registration Number',
  'Remember me': 'Remember me',
  Remove,
  'Removed from adjustment': 'Removed from adjustment',
  'Remove Icon': 'Remove Icon',
  'Remove Logo': 'Remove Logo',
  'Remove Photo': 'Remove Photo',
  'Remove {x}': 'Remove {x}',
  Reports,
  'Require Country & State': 'Require Country & State',
  Required,
  'Require this field': 'Require this field',
  'Resend Key': 'Resend Key',
  'Resend Verification Email': 'Resend Verification Email',
  Reset,
  'Reset balance for deleting {payment}': 'Reset balance for deleting {payment}',
  'Reset balance for Purchase #{id}': 'Reset balance for Purchase #{id}',
  'Reset balance for restoring {payment}': 'Reset balance for restoring {payment}',
  'Reset balance for Return Order #{id}': 'Reset balance for Return Order #{id}',
  'Reset balance for {expense}': 'Reset balance for {expense}',
  'Reset balance for {payment}': 'Reset balance for {payment}',
  'Reset balance for {purchase}': 'Reset balance for {purchase}',
  'Reset balance for {return_order}': 'Reset balance for {return_order}',
  'Reset balance for {sale}': 'Reset balance for {sale}',
  'Reset Password': 'Reset Password',
  'Reset store stock for {stock_count}': 'Reset store stock for {stock_count}',
  Resetting,
  'Return Amount': 'Return Amount',
  'Returned From': 'Returned From',
  'Returned To': 'Returned To',
  'Return From': 'Return From',
  'return order': 'return order',
  'Return Order': 'Return Order',
  'Return Order for Purchase': 'Return Order for Purchase',
  'Return Order for Sale': 'Return Order for Sale',
  'Return Order Items': 'Return Order Items',
  'Return Order No. {x}': 'Return Order No. {x}',
  'return orders': 'return orders',
  'Return Orders': 'Return Orders',
  'Return To': 'Return To',
  return_order,
  Role,
  'Role can not be modified.': 'Role can not be modified.',
  Roles,
  Rounding,
  'Row Per Page': 'Row Per Page',
  'SAC Number': 'SAC Number',
  sale,
  Sale,
  'Sale Items': 'Sale Items',
  'Sale items are loaded, please choose only return ones.': 'Sale items are loaded, please choose only return ones.',
  'Sale No.': 'Sale No.',
  'Sale No. {x}': 'Sale No. {x}',
  'Sale No/Ref': 'Sale No/Ref',
  'Sale not found with No./ref {x}.': 'Sale not found with No./ref {x}.',
  'Sale Reference': 'Sale Reference',
  'Sale Return Orders': 'Sale Return Orders',
  Sales,
  'Sales & Orders': 'Sales & Orders',
  'Sales & Purchases': 'Sales & Purchases',
  'Sales Amount': 'Sales Amount',
  'Sale Unit': 'Sale Unit',
  'Same Country Percentage': 'Same Country Percentage',
  'Same State': 'Same State',
  Save,
  'Save & go to listing': 'Save & go to listing',
  saved,
  'Saved.': 'Saved.',
  'Scale Barcdoe Settings': 'Scale Barcdoe Settings',
  'Scale Barcode': 'Scale Barcode',
  'Scale Barcode Settings': 'Scale Barcode Settings',
  'Scale barcode settings successfully saved.': 'Scale barcode settings successfully saved.',
  'Scan barcode or search items for next': 'Scan barcode or search items for next',
  'Scan Barcode or Search Product': 'Scan Barcode or Search Product',
  'Scan barcode or type the variation code': 'Scan barcode or type the variation code',
  'Scan barcode or type to search': 'Scan barcode or type to search',
  'Scroll to view on menu & page change': 'Scroll to view on menu & page change',
  Search,
  'Search Delay': 'Search Delay',
  'Searching for results': 'Searching for results',
  'Secondary Name': 'Secondary Name',
  'Secure Area': 'Secure Area',
  Select,
  'Select A New Icon': 'Select A New Icon',
  'Select A New Logo': 'Select A New Logo',
  'Select A New Photo': 'Select A New Photo',
  'Select a tab': 'Select a tab',
  'Selected File': 'Selected File',
  'Select file': 'Select file',
  'Select {x}': 'Select {x}',
  'Sell Gift Card': 'Sell Gift Card',
  'Selling Price': 'Selling Price',
  'Sell To': 'Sell To',
  'SendMail Path': 'SendMail Path',
  Sent,
  'Sent at': 'Sent at',
  'Sent by': 'Sent by',
  'Sent to': 'Sent to',
  'SEO Fields': 'SEO Fields',
  Serial,
  'Serial Number': 'Serial Number',
  'Serial Numbers': 'Serial Numbers',
  Service,
  'Set different price, quantity & taxes per stores': 'Set different price, quantity & taxes per stores',
  'Set store stock for {stock_count}': 'Set store stock for {stock_count}',
  Settings,
  'Setup Key': 'Setup Key',
  Shop,
  'Short Name': 'Short Name',
  'Show code as QRCode': 'Show code as QRCode',
  'Show discount column': 'Show discount column',
  'show expiry date input while purchasing': 'show expiry date input while purchasing',
  'Show Filters': 'Show Filters',
  'Show image': 'Show image',
  'Show in details': 'Show in details',
  'Showing from {from} to {to} of total {total} records': 'Showing from {from} to {to} of total {total} records',
  'Show in POS': 'Show in POS',
  'Show in Shop': 'Show in Shop',
  'Show menus as dropdown': 'Show menus as dropdown',
  'Show on details view': 'Show on details view',
  'Show Product Image': 'Show Product Image',
  'Show Product Name': 'Show Product Name',
  'Show Product Price': 'Show Product Price',
  'Show Recovery Codes': 'Show Recovery Codes',
  'Show Site Name': 'Show Site Name',
  'Show tax column': 'Show tax column',
  'Show taxes with zero value': 'Show taxes with zero value',
  'Show tax summary': 'Show tax summary',
  'Show this in offline payments': 'Show this in offline payments',
  Sidebar,
  Simple,
  Size,
  size,
  SKU,
  Slug,
  'SMTP Encryption': 'SMTP Encryption',
  'SMTP Host': 'SMTP Host',
  'SMTP Password': 'SMTP Password',
  'SMTP Port': 'SMTP Port',
  'SMTP Username': 'SMTP Username',
  Sold,
  'Sorry, the page you are looking for could not be found.': 'Sorry, the page you are looking for could not be found.',
  'Sorry, we are doing some maintenance. Please check back soon.': 'Sorry, we are doing some maintenance. Please check back soon.',
  'Sorry, you are forbidden from accessing this page.': 'Sorry, you are forbidden from accessing this page.',
  'So the net price will be 100 - 9.09 = 90.91': 'So the net price will be 100 - 9.09 = 90.91',
  'So the net price will be 100 - 10 = 90.00': 'So the net price will be 100 - 10 = 90.00',
  'Spend X Get Discount (SXGD)': 'Spend X Get Discount (SXGD)',
  Staff,
  Standard,
  start,
  'Start Date': 'Start Date',
  'Start Stock Count': 'Start Stock Count',
  state,
  State,
  Stock,
  'Stock Count': 'Stock Count',
  'stock count': 'stock count',
  'Stock count has already completed.': 'Stock count has already completed.',
  'Stock Count No. {x}': 'Stock Count No. {x}',
  'Stock Counts': 'Stock Counts',
  'Stock Tracking': 'Stock Tracking',
  Store,
  store,
  'Store Account': 'Store Account',
  'Store has been selected.': 'Store has been selected.',
  'Store has been unselected.': 'Store has been unselected.',
  'Store Price Group': 'Store Price Group',
  Stores,
  'Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.':
    'Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.',
  Street,
  'Stripe Amount': 'Stripe Amount',
  'Stripe Payments Value': 'Stripe Payments Value',
  'Stripe Publishable Key': 'Stripe Publishable Key',
  'Stripe Secret Key': 'Stripe Secret Key',
  'Stripe Terminal': 'Stripe Terminal',
  'Stripe Terminal Amount': 'Stripe Terminal Amount',
  Sub,
  Subcategory,
  Subtotal,
  Subtraction,
  'Subtraction/Damage/Expired/Lost': 'Subtraction/Damage/Expired/Lost',
  'Super Admin role can not be modified.': 'Super Admin role can not be modified.',
  Supplier,
  'Supplier Group': 'Supplier Group',
  'Supplier group': 'Supplier group',
  'Supplier name with email already exists': 'Supplier name with email already exists',
  'Supplier name with phone already exists': 'Supplier name with phone already exists',
  'Supplier Part Id': 'Supplier Part Id',
  Suppliers,
  'Suppliers Due': 'Suppliers Due',
  'Supplier Statement': 'Supplier Statement',
  Support,
  'Support Links': 'Support Links',
  Surcharge,
  SXGD,
  Symbology,
  'Sync balance for Purchase #{id}': 'Sync balance for Purchase #{id}',
  'Sync balance for Return Order #{id}': 'Sync balance for Return Order #{id}',
  'Sync balance for {expense}': 'Sync balance for {expense}',
  'Sync balance for {payment}': 'Sync balance for {payment}',
  'Sync balance for {purchase}': 'Sync balance for {purchase}',
  'Sync balance for {return_order}': 'Sync balance for {return_order}',
  'Sync balance for {sale}': 'Sync balance for {sale}',
  Syncing,
  'Sync {x} quantity for adjustment {id} item {i}': 'Sync {x} quantity for adjustment {id} item {i}',
  System,
  'System will update the customer if it has the same name, phone and email otherwise new customer will be added.':
    'System will update the customer if it has the same name, phone and email otherwise new customer will be added.',
  'System will update the supplier if it has the same name, phone and email otherwise new supplier will be added.':
    'System will update the supplier if it has the same name, phone and email otherwise new supplier will be added.',
  Tax,
  tax,
  'Tax (Purchase Return)': 'Tax (Purchase Return)',
  'Tax (Sale Return)': 'Tax (Sale Return)',
  Taxes,
  'Taxes are included in price': 'Taxes are included in price',
  'Tax is included in price': 'Tax is included in price',
  Template,
  'Tender Amount': 'Tender Amount',
  'Terms of Service': 'Terms of Service',
  Text,
  Textarea,
  'Thank you very much!': 'Thank you very much!',
  The,
  'The :attribute is required.': 'The :attribute is required.',
  'The gift card amount is required.': 'The gift card amount is required.',
  'The gift card number is required.': 'The gift card number is required.',
  'The locale length should be 2 or 5 characters e.g. en or en-US.': 'The locale length should be 2 or 5 characters e.g. en or en-US.',
  'The order has been deleted!': 'The order has been deleted!',
  'The order has been saved!': 'The order has been saved!',
  'The phone number is invalid.': 'The phone number is invalid.',
  'The provided password does not match your current password.': 'The provided password does not match your current password.',
  'The quantity is invalid.': 'The quantity is invalid.',
  'The quantity is not available.': 'The quantity is not available.',
  'The record can not be deleted.': 'The record can not be deleted.',
  'The register has been closed!': 'The register has been closed!',
  'There is no data to display!': 'There is no data to display!',
  'There is no product to display': 'There is no product to display',
  'There is no suspended order to display.': 'There is no suspended order to display.',
  'The store has been selected!': 'The store has been selected!',
  'The task has completed, {count} deleted and {failed} failed.': 'The task has completed, {count} deleted and {failed} failed.',
  'This action cannot be undone.': 'This action cannot be undone.',
  'This action is not reversible!': 'This action is not reversible!',
  'This action will delete the data permanently.': 'This action will delete the data permanently.',
  'This could result in email failure depending on your mail server and biller email address.':
    'This could result in email failure depending on your mail server and biller email address.',
  'This device': 'This device',
  'This discount will override any products discount.': 'This discount will override any products discount.',
  'This is a secure area of the application. Please confirm your password before continuing.':
    'This is a secure area of the application. Please confirm your password before continuing.',
  'This is not receipt but the bill to collect payment.': 'This is not receipt but the bill to collect payment.',
  'This is state tax': 'This is state tax',
  'This product has expiry date': 'This product has expiry date',
  'This product has serial numbers': 'This product has serial numbers',
  'This product has variants': 'This product has variants',
  'This quotation has {x}': 'This quotation has {x}',
  'This sale has {x}': 'This sale has {x}',
  'This tax is recoverable': 'This tax is recoverable',
  Till,
  Time,
  Timezone,
  Title,
  To,
  'To Buy': 'To Buy',
  "To finish enabling two factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key and provide the generated OTP code.":
    "To finish enabling two factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key and provide the generated OTP code.",
  'To Get': 'To Get',
  'Topup Gift Card': 'Topup Gift Card',
  'To Store': 'To Store',
  Total,
  'Total Items': 'Total Items',
  'Total Payment': 'Total Payment',
  'Total Payment Amount': 'Total Payment Amount',
  'Total Quantity': 'Total Quantity',
  'Total quantity': 'Total quantity',
  'Total Sales': 'Total Sales',
  'Track stock': 'Track stock',
  transfer,
  Transfer,
  'Transfer Items': 'Transfer Items',
  'Transfer No. {x}': 'Transfer No. {x}',
  'Transfer Order': 'Transfer Order',
  Transfers,
  'Transfer To': 'Transfer To',
  Trashed,
  'Two-factor Confirmation': 'Two-factor Confirmation',
  'Two Factor Authentication': 'Two Factor Authentication',
  "Two factor authentication is now enabled. Scan the following QR code using your phone's authenticator application or enter the setup key.":
    "Two factor authentication is now enabled. Scan the following QR code using your phone's authenticator application or enter the setup key.",
  Type,
  'Unable to close register!': 'Unable to close register!',
  'Unable to delete attachment!': 'Unable to delete attachment!',
  Unit,
  unit,
  'Unit Cost': 'Unit Cost',
  'Unit Price': 'Unit Price',
  Units,
  Unknown,
  'Unpaid {x}': 'Unpaid {x}',
  'Unselect {x}': 'Unselect {x}',
  Update,
  'Update All': 'Update All',
  'Update all records': 'Update all records',
  'Update All Records': 'Update All Records',
  updated,
  'Update Password': 'Update Password',
  "Update your account's profile information and email address.": "Update your account's profile information and email address.",
  'Update {x}': 'Update {x}',
  Url,
  'Use an authentication code': 'Use an authentication code',
  'Use a recovery code': 'Use a recovery code',
  User,
  'User :username has been logged in.': 'User :username has been logged in.',
  Username,
  Users,
  Variant,
  Variants,
  'Variant {x}': 'Variant {x}',
  Variation,
  variation,
  'Variation Code': 'Variation Code',
  variations,
  Variations,
  'Video URL': 'Video URL',
  View,
  'View Alerts': 'View Alerts',
  'View All': 'View All',
  'View all': 'View all',
  'View all records': 'View all records',
  'View Details': 'View Details',
  'View notifications': 'View notifications',
  'View Open Orders': 'View Open Orders',
  'View Orders': 'View Orders',
  'View Register Details': 'View Register Details',
  'View Sales': 'View Sales',
  'View {x}': 'View {x}',
  Weight,
  'Weight Characters Length': 'Weight Characters Length',
  'Weight Divide by': 'Weight Divide by',
  'Weight Start Position': 'Weight Start Position',
  'Weight Unit': 'Weight Unit',
  "When two factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application.":
    "When two factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application.",
  'Whoops, something went wrong on our servers.': 'Whoops, something went wrong on our servers.',
  'will earn': 'will earn',
  'With Trashed': 'With Trashed',
  'Year Overview': 'Year Overview',
  'Yes, delete': 'Yes, delete',
  'You already have opened register at {x}.': 'You already have opened register at {x}.',
  'You are not allowed to update yourself. Please use profile to update your account OR login with different user to update this account.':
    'You are not allowed to update yourself. Please use profile to update your account OR login with different user to update this account.',
  'You cannot apply discount more than {x}%': 'You cannot apply discount more than {x}%',
  'You have already added maximum number of variants.': 'You have already added maximum number of variants.',
  'You have already opened register at another store.!': 'You have already opened register at another store.!',
  'You have been invited to join the :team team!': 'You have been invited to join the :team team!',
  'You have enabled two factor authentication.': 'You have enabled two factor authentication.',
  'You have not enabled two factor authentication.': 'You have not enabled two factor authentication.',
  'You may accept this invitation by clicking the button below:': 'You may accept this invitation by clicking the button below:',
  'You may delete any of your existing tokens if they are no longer needed.':
    'You may delete any of your existing tokens if they are no longer needed.',
  'you must enable if you have state level taxes': 'you must enable if you have state level taxes',
  'You must fill the name column.': 'You must fill the name column.',
  'You must fill the {x} columns.': 'You must fill the {x} columns.',
  'Your email address is unverified.': 'Your email address is unverified.',
  '{a} {x} quantity for {id} item {i}': '{a} {x} quantity for {id} item {i}',
  '{models} have imported or updated.': '{models} have imported or updated.',
  '{model} cannot be {action}.': '{model} cannot be {action}.',
  '{model} cannot be {action}. The record is being used for relationships.':
    '{model} cannot be {action}. The record is being used for relationships.',
  '{model} has been successfully {action}.': '{model} has been successfully {action}.',
  '{name} does not have {quantity} in stock, available quantity {available}.':
    '{name} does not have {quantity} in stock, available quantity {available}.',
  '{name} have only {available} quantity available.': '{name} have only {available} quantity available.',
  '{record} has been {action}.': '{record} has been {action}.',
  '{record} has permanently deleted.': '{record} has permanently deleted.',
  '{x} added to order.': '{x} added to order.',
  '{x} Details': '{x} Details',
  '{x} Report': '{x} Report',
  '{x} Settings': '{x} Settings',
  '{x} will be deleted permanently from system.': '{x} will be deleted permanently from system.',
};
const available = [
  { value: 'en', label: 'English', flag: 'US' },
  { value: 'es', label: 'Spanish', flag: 'ES' },
  { value: 'fr', label: 'French', flag: 'FR' },
];
const languages = {
  available,
};
const messages = { en };
const LANGUAGES = languages.available;
languages.available.map(l2 => l2.value).filter(l2 => l2 != 'en');
const i18n = createI18n({
  messages,
  legacy: false,
  missingWarn: false,
  mode: 'composition',
  fallbackWarn: false,
  fallbackLocale: 'en',
  warnHtmlMessage: false,
  locale: typeof window === 'undefined' ? 'en' : window.Locale || 'en',
  missing: async (locale, key) => {
    console.log('Add to ' + locale + '.json => "' + key + '": "' + key + '",');
  },
});
const isClient = typeof window !== 'undefined';
const _sfc_main$M = {
  __name: 'ActionMessage',
  __ssrInlineRender: true,
  props: {
    on: Boolean,
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle(
          __props.on ? null : { display: 'none' }
        )}" class="text-sm text-gray-600 dark:text-gray-400">`
      );
      ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  },
};
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/ActionMessage.vue');
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$L = {};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs) {
  _push(
    `<div${ssrRenderAttrs(
      mergeProps({ class: 'md:col-span-1 lg:flex lg:justify-between' }, _attrs)
    )}><div class="px-4 sm:px-0"><h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">`
  );
  ssrRenderSlot(_ctx.$slots, 'title', {}, null, _push, _parent);
  _push(`</h3><p class="mt-1 text-sm text-gray-600 dark:text-gray-400">`);
  ssrRenderSlot(_ctx.$slots, 'description', {}, null, _push, _parent);
  _push(`</p></div><div class="px-4 sm:px-0">`);
  ssrRenderSlot(_ctx.$slots, 'aside', {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/SectionTitle.vue');
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const SectionTitle = /* @__PURE__ */ _export_sfc(_sfc_main$L, [['ssrRender', _sfc_ssrRender$5]]);
const _sfc_main$K = {
  __name: 'ActionSection',
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'md:grid md:grid-cols-3 md:gap-6' }, _attrs))}>`);
      _push(
        ssrRenderComponent(
          SectionTitle,
          null,
          {
            title: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderSlot(_ctx.$slots, 'title', {}, null, _push2, _parent2, _scopeId);
              } else {
                return [renderSlot(_ctx.$slots, 'title')];
              }
            }),
            description: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderSlot(_ctx.$slots, 'description', {}, null, _push2, _parent2, _scopeId);
              } else {
                return [renderSlot(_ctx.$slots, 'description')];
              }
            }),
            _: 3,
          },
          _parent
        )
      );
      _push(`<div class="mt-5 md:mt-0 md:col-span-2"><div class="px-4 py-5 sm:p-6 bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">`);
      ssrRenderSlot(_ctx.$slots, 'content', {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  },
};
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/ActionSection.vue');
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const _sfc_main$J = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  _push(
    `<!--[--><img${ssrRenderAttr('alt', _ctx.$page.props.settings.name || 'SMA')}${ssrRenderAttr(
      'src',
      _ctx.$page.props.settings.logo || '/img/sma.svg'
    )} class="dark:hidden h-full max-h-16 min-h-5 max-w-52"><img${ssrRenderAttr(
      'alt',
      _ctx.$page.props.settings.name || 'SMA'
    )}${ssrRenderAttr(
      'src',
      _ctx.$page.props.settings.logo_dark || '/img/sma-light.svg'
    )} class="hidden dark:block h-full max-h-16 min-h-5 max-w-52"><!--]-->`
  );
}
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/ApplicationLogo.vue');
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const ApplicationLogo = /* @__PURE__ */ _export_sfc(_sfc_main$J, [['ssrRender', _sfc_ssrRender$4]]);
const _sfc_main$I = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(
    `<!--[--><img${ssrRenderAttr('alt', _ctx.$page.props.settings.short_name || 'SMA')}${ssrRenderAttr(
      'src',
      _ctx.$page.props.settings.icon || '/img/sma-icon.svg'
    )} class="dark:hidden h-full max-h-16 min-h-5"><img${ssrRenderAttr(
      'alt',
      _ctx.$page.props.settings.short_name || 'SMA'
    )}${ssrRenderAttr(
      'src',
      _ctx.$page.props.settings.icon_dark || '/img/sma-icon-light.svg'
    )} class="hidden dark:block h-full max-h-16 min-h-5"><!--]-->`
  );
}
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/ApplicationMark.vue');
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const ApplicationMark = /* @__PURE__ */ _export_sfc(_sfc_main$I, [['ssrRender', _sfc_ssrRender$3]]);
const _sfc_main$H = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(
    `<div${ssrRenderAttrs(
      mergeProps({ class: 'min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900' }, _attrs)
    )}><div class="h-16">`
  );
  ssrRenderSlot(_ctx.$slots, 'logo', {}, null, _push, _parent);
  _push(`</div><div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">`);
  ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/AuthenticationCard.vue');
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const AuthenticationCard = /* @__PURE__ */ _export_sfc(_sfc_main$H, [['ssrRender', _sfc_ssrRender$2]]);
const _sfc_main$G = {
  __name: 'AuthenticationCardLogo',
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        ssrRenderComponent(
          unref(Link),
          mergeProps({ href: '/' }, _attrs),
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(ApplicationLogo, null, null, _parent2, _scopeId));
              } else {
                return [createVNode(ApplicationLogo)];
              }
            }),
            _: 1,
          },
          _parent
        )
      );
    };
  },
};
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/AuthenticationCardLogo.vue');
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const _sfc_main$F = {
  __name: 'Checkbox',
  __ssrInlineRender: true,
  props: {
    checked: {
      type: [Array, Boolean],
      default: false,
    },
    value: {
      type: String,
      default: null,
    },
  },
  emits: ['update:checked'],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const proxyChecked = computed({
      get() {
        return props.checked;
      },
      set(val) {
        emit('update:checked', val);
      },
    });
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(
        `<input${ssrRenderAttrs(
          ((_temp0 = mergeProps(
            {
              value: __props.value,
              type: 'checkbox',
              checked: Array.isArray(proxyChecked.value) ? ssrLooseContain(proxyChecked.value, __props.value) : proxyChecked.value,
              class:
                'rounded-sm dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-primary-600 shadow-xs focus:ring-primary-500 dark:focus:ring-primary-600 dark:focus:ring-offset-gray-800',
            },
            _attrs
          )),
          mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, proxyChecked.value)))
        )}>`
      );
    };
  },
};
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/Checkbox.vue');
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const _sfc_main$E = {
  __name: 'Modal',
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: '2xl',
    },
    closeable: {
      type: Boolean,
      default: true,
    },
    backdrop: {
      type: Boolean,
      default: true,
    },
    round: {
      type: Boolean,
      default: false,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    overflow: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    ref(null);
    const showSlot = ref(props.show);
    watch(
      () => props.show,
      async () => {
        if (props.show) {
          document.body.classList.add('modal-open');
          document.body.style.overflow = 'hidden';
          showSlot.value = true;
        } else {
          await nextTick();
          let rc = 0;
          document.querySelectorAll('body .modal').forEach(el => {
            if (el.checkVisibility()) {
              rc++;
            }
          });
          if (rc <= 0) {
            document.body.style.overflow = null;
            document.body.classList.remove('modal-open');
          }
          setTimeout(() => {
            showSlot.value = false;
          }, 200);
        }
      }
    );
    const close = backdrop => {
      if (props.closeable) {
        emit('close');
      }
    };
    const closeOnEscape = e2 => {
      if (e2.key === 'Escape') {
        e2.preventDefault();
        if (props.show) {
          close();
        }
      }
    };
    onMounted(() => document.addEventListener('keydown', closeOnEscape));
    onUnmounted(() => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = null;
    });
    const maxWidthClass = computed(() => {
      return {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
      }[props.maxWidth];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = resolveComponent('Icon');
      ssrRenderTeleport(
        _push,
        _push2 => {
          _push2(
            `<div style="${ssrRenderStyle(
              __props.show ? null : { display: 'none' }
            )}" class="modal m-0 min-h-full min-w-full overflow-y-auto bg-transparent backdrop:bg-transparent"><div class="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50 print:static" scroll-region><div style="${ssrRenderStyle(
              __props.show ? null : { display: 'none' }
            )}" class="backdrop-blur-xs fixed inset-0 transform transition-all print:hidden"><div class="absolute inset-0 bg-gray-100 dark:bg-gray-900 opacity-75"></div></div><div style="${ssrRenderStyle(
              __props.show ? null : { display: 'none' }
            )}" class="flex min-h-full justify-center items-center print:items-start sm:print:items-start sm:px-4 lg:px-0"><div style="${ssrRenderStyle(
              __props.show ? null : { display: 'none' }
            )}" class="${ssrRenderClass([
              [
                { 'overflow-hidden': !__props.overflow },
                __props.round ? 'rounded-2xl' : 'rounded-lg',
                __props.transparent ? 'bg-transparent max-w-fit' : 'bg-white dark:bg-gray-800 shadow-xl ' + maxWidthClass.value,
              ],
              'relative transform transition-all w-full sm:mx-auto sm:print:w-full sm:print:max-w-full print:shadow-none',
            ])}">`
          );
          if (__props.closeable) {
            _push2(
              `<div class="print:hidden absolute right-0 top-0 pr-4 pt-4"><button type="button" class="rounded-md text-mute hover:text-gray-700 dark:hover:text-gray-300 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"><span class="sr-only">${ssrInterpolate(
                _ctx.$t('Close')
              )}</span>`
            );
            _push2(
              ssrRenderComponent(
                _component_Icon,
                {
                  name: 'x',
                  size: 'size-6',
                },
                null,
                _parent
              )
            );
            _push2(`</button></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (showSlot.value) {
            ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push2, _parent);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div></div>`);
        },
        'body',
        false,
        _parent
      );
    };
  },
};
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/Modal.vue');
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const _sfc_main$D = {
  __name: 'ConfirmationModal',
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: '2xl',
    },
    closeable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close'],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const close = () => {
      emit('close');
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        ssrRenderComponent(
          _sfc_main$E,
          mergeProps(
            {
              show: __props.show,
              'max-width': __props.maxWidth,
              closeable: __props.closeable,
              onClose: close,
            },
            _attrs
          ),
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4"${_scopeId}><div class="sm:flex sm:items-start"${_scopeId}><div class="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"${_scopeId}><svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"${_scopeId}></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ms-4 sm:text-start"${_scopeId}><h3 class="text-lg font-medium text-gray-900 dark:text-gray-100"${_scopeId}>`
                );
                ssrRenderSlot(_ctx.$slots, 'title', {}, null, _push2, _parent2, _scopeId);
                _push2(`</h3><div class="mt-4 text-sm text-gray-600 dark:text-gray-400"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, 'content', {}, null, _push2, _parent2, _scopeId);
                _push2(
                  `</div></div></div></div><div class="flex flex-row justify-end px-6 py-4 bg-gray-100 dark:bg-gray-800 text-end"${_scopeId}>`
                );
                ssrRenderSlot(_ctx.$slots, 'footer', {}, null, _push2, _parent2, _scopeId);
                _push2(`</div>`);
              } else {
                return [
                  createVNode('div', { class: 'bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4' }, [
                    createVNode('div', { class: 'sm:flex sm:items-start' }, [
                      createVNode(
                        'div',
                        {
                          class:
                            'mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10',
                        },
                        [
                          (openBlock(),
                          createBlock(
                            'svg',
                            {
                              class: 'h-6 w-6 text-red-600 dark:text-red-400',
                              xmlns: 'http://www.w3.org/2000/svg',
                              fill: 'none',
                              viewBox: '0 0 24 24',
                              'stroke-width': '1.5',
                              stroke: 'currentColor',
                            },
                            [
                              createVNode('path', {
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round',
                                d: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
                              }),
                            ]
                          )),
                        ]
                      ),
                      createVNode('div', { class: 'mt-3 text-center sm:mt-0 sm:ms-4 sm:text-start' }, [
                        createVNode('h3', { class: 'text-lg font-medium text-gray-900 dark:text-gray-100' }, [
                          renderSlot(_ctx.$slots, 'title'),
                        ]),
                        createVNode('div', { class: 'mt-4 text-sm text-gray-600 dark:text-gray-400' }, [
                          renderSlot(_ctx.$slots, 'content'),
                        ]),
                      ]),
                    ]),
                  ]),
                  createVNode('div', { class: 'flex flex-row justify-end px-6 py-4 bg-gray-100 dark:bg-gray-800 text-end' }, [
                    renderSlot(_ctx.$slots, 'footer'),
                  ]),
                ];
              }
            }),
            _: 3,
          },
          _parent
        )
      );
    };
  },
};
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/ConfirmationModal.vue');
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const _sfc_main$C = {
  __name: 'DialogModal',
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: 'lg',
    },
    closeable: {
      type: Boolean,
      default: true,
    },
    round: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const close = () => {
      emit('close');
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        ssrRenderComponent(
          _sfc_main$E,
          mergeProps(
            {
              show: __props.show,
              'max-width': __props.maxWidth,
              round: __props.round,
              closeable: __props.closeable,
              onClose: close,
            },
            _attrs
          ),
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="px-6 py-4"${_scopeId}><div class="text-lg font-medium text-focus"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, 'title', {}, null, _push2, _parent2, _scopeId);
                _push2(`</div><div class="mt-4 text-sm text-mute"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, 'content', {}, null, _push2, _parent2, _scopeId);
                _push2(`</div></div><div class="flex flex-row justify-end px-6 py-4 bg-gray-100 dark:bg-gray-950 text-end"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, 'footer', {}, null, _push2, _parent2, _scopeId);
                _push2(`</div>`);
              } else {
                return [
                  createVNode('div', { class: 'px-6 py-4' }, [
                    createVNode('div', { class: 'text-lg font-medium text-focus' }, [renderSlot(_ctx.$slots, 'title')]),
                    createVNode('div', { class: 'mt-4 text-sm text-mute' }, [renderSlot(_ctx.$slots, 'content')]),
                  ]),
                  createVNode('div', { class: 'flex flex-row justify-end px-6 py-4 bg-gray-100 dark:bg-gray-950 text-end' }, [
                    renderSlot(_ctx.$slots, 'footer'),
                  ]),
                ];
              }
            }),
            _: 3,
          },
          _parent
        )
      );
    };
  },
};
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/DialogModal.vue');
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const _sfc_main$B = {
  __name: 'InputError',
  __ssrInlineRender: true,
  props: {
    message: String,
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(
          mergeProps(
            {
              style: __props.message ? null : { display: 'none' },
            },
            _attrs
          )
        )}><p class="text-sm text-red-500 dark:text-red-500">${ssrInterpolate(__props.message)}</p></div>`
      );
    };
  },
};
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/InputError.vue');
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const _sfc_main$A = {
  __name: 'PrimaryButton',
  __ssrInlineRender: true,
  props: {
    type: {
      type: String,
      default: 'submit',
    },
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<button${ssrRenderAttrs(
          mergeProps(
            {
              type: __props.type,
              class: 'btn-primary',
            },
            _attrs
          )
        )}>`
      );
      ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      _push(`</button>`);
    };
  },
};
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/PrimaryButton.vue');
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const _sfc_main$z = {
  __name: 'SecondaryButton',
  __ssrInlineRender: true,
  props: {
    type: {
      type: String,
      default: 'button',
    },
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<button${ssrRenderAttrs(
          mergeProps(
            {
              type: __props.type,
              class: 'btn-secondary',
            },
            _attrs
          )
        )}>`
      );
      ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      _push(`</button>`);
    };
  },
};
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/SecondaryButton.vue');
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const _sfc_main$y = {
  __name: 'TextInput',
  __ssrInlineRender: true,
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue'],
  setup(__props, { expose: __expose }) {
    const input = ref(null);
    onMounted(() => {
      if (input.value.hasAttribute('autofocus')) {
        input.value.focus();
      }
    });
    __expose({ focus: () => input.value.focus() });
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<input${ssrRenderAttrs(
          mergeProps(
            {
              ref_key: 'input',
              ref: input,
              value: __props.modelValue,
              class:
                'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-xs',
            },
            _attrs
          )
        )}>`
      );
    };
  },
};
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/TextInput.vue');
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const _sfc_main$x = {
  __name: 'ConfirmsPassword',
  __ssrInlineRender: true,
  props: {
    title: { type: String },
    content: { type: String },
    button: { type: String },
  },
  emits: ['confirmed'],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const confirmingPassword = ref(false);
    const form = reactive({
      password: '',
      error: '',
      processing: false,
    });
    const passwordInput = ref(null);
    const confirmPassword = () => {
      form.processing = true;
      axios
        .post(route('password.confirm'), {
          password: form.password,
        })
        .then(() => {
          form.processing = false;
          closeModal();
          nextTick().then(() => emit('confirmed'));
        })
        .catch(error => {
          form.processing = false;
          form.error = error.response.data.errors.password[0];
          passwordInput.value.focus();
        });
    };
    const closeModal = () => {
      confirmingPassword.value = false;
      form.password = '';
      form.error = '';
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(_attrs)}><span>`);
      ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      _push(`</span>`);
      _push(
        ssrRenderComponent(
          _sfc_main$C,
          {
            show: confirmingPassword.value,
            onClose: closeModal,
            maxWidth: 'md',
          },
          {
            title: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(__props.title || _ctx.$t('Confirm Password'))}`);
              } else {
                return [createTextVNode(toDisplayString(__props.title || _ctx.$t('Confirm Password')), 1)];
              }
            }),
            content: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `${ssrInterpolate(
                    __props.content || _ctx.$t('For your security, please confirm your password to continue.')
                  )} <div class="mt-4"${_scopeId}>`
                );
                _push2(
                  ssrRenderComponent(
                    _sfc_main$y,
                    {
                      type: 'password',
                      ref_key: 'passwordInput',
                      ref: passwordInput,
                      placeholder: 'Password',
                      modelValue: form.password,
                      'onUpdate:modelValue': $event => (form.password = $event),
                      class: 'mt-1 block w-full',
                      autocomplete: 'current-password',
                      onKeyup: confirmPassword,
                    },
                    null,
                    _parent2,
                    _scopeId
                  )
                );
                _push2(
                  ssrRenderComponent(
                    _sfc_main$B,
                    {
                      message: form.error,
                      class: 'mt-2',
                    },
                    null,
                    _parent2,
                    _scopeId
                  )
                );
                _push2(`</div>`);
              } else {
                return [
                  createTextVNode(
                    toDisplayString(__props.content || _ctx.$t('For your security, please confirm your password to continue.')) + ' ',
                    1
                  ),
                  createVNode('div', { class: 'mt-4' }, [
                    createVNode(
                      _sfc_main$y,
                      {
                        type: 'password',
                        ref_key: 'passwordInput',
                        ref: passwordInput,
                        placeholder: 'Password',
                        modelValue: form.password,
                        'onUpdate:modelValue': $event => (form.password = $event),
                        class: 'mt-1 block w-full',
                        autocomplete: 'current-password',
                        onKeyup: withKeys(confirmPassword, ['enter']),
                      },
                      null,
                      8,
                      ['modelValue', 'onUpdate:modelValue']
                    ),
                    createVNode(
                      _sfc_main$B,
                      {
                        message: form.error,
                        class: 'mt-2',
                      },
                      null,
                      8,
                      ['message']
                    ),
                  ]),
                ];
              }
            }),
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(
                    _sfc_main$z,
                    { onClick: closeModal },
                    {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`${ssrInterpolate(_ctx.$t('Cancel'))}`);
                        } else {
                          return [createTextVNode(toDisplayString(_ctx.$t('Cancel')), 1)];
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                );
                _push2(
                  ssrRenderComponent(
                    _sfc_main$A,
                    {
                      class: ['ms-3', { 'opacity-25': form.processing }],
                      disabled: form.processing,
                      onClick: confirmPassword,
                    },
                    {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`${ssrInterpolate(__props.button || _ctx.$t('Confirm'))}`);
                        } else {
                          return [createTextVNode(toDisplayString(__props.button || _ctx.$t('Confirm')), 1)];
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                );
              } else {
                return [
                  createVNode(
                    _sfc_main$z,
                    { onClick: closeModal },
                    {
                      default: withCtx(() => [createTextVNode(toDisplayString(_ctx.$t('Cancel')), 1)]),
                      _: 1,
                    }
                  ),
                  createVNode(
                    _sfc_main$A,
                    {
                      class: ['ms-3', { 'opacity-25': form.processing }],
                      disabled: form.processing,
                      onClick: confirmPassword,
                    },
                    {
                      default: withCtx(() => [createTextVNode(toDisplayString(__props.button || _ctx.$t('Confirm')), 1)]),
                      _: 1,
                    },
                    8,
                    ['class', 'disabled']
                  ),
                ];
              }
            }),
            _: 1,
          },
          _parent
        )
      );
      _push(`</span>`);
    };
  },
};
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/ConfirmsPassword.vue');
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const _sfc_main$w = {
  __name: 'DangerButton',
  __ssrInlineRender: true,
  props: {
    type: {
      type: String,
      default: 'button',
    },
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<button${ssrRenderAttrs(
          mergeProps(
            {
              type: __props.type,
              class: 'btn-danger',
            },
            _attrs
          )
        )}>`
      );
      ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      _push(`</button>`);
    };
  },
};
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/DangerButton.vue');
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const _sfc_main$v = {
  __name: 'Dropdown',
  __ssrInlineRender: true,
  props: {
    align: {
      type: String,
      default: 'right',
    },
    valign: {
      type: String,
      default: 'bottom',
    },
    width: {
      type: String,
      default: '48',
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
    contentClasses: {
      type: Array,
      default: () => ['py-1', 'bg-white dark:bg-gray-700'],
    },
  },
  setup(__props) {
    const props = __props;
    let open = ref(false);
    const closeOnEscape = e2 => {
      if (open.value && e2.key === 'Escape') {
        open.value = false;
      }
    };
    onMounted(() => document.addEventListener('keydown', closeOnEscape));
    onUnmounted(() => document.removeEventListener('keydown', closeOnEscape));
    const widthClass = computed(() => {
      return {
        40: 'w-40',
        48: 'w-48',
        56: 'w-56',
        64: 'w-64',
      }[props.width.toString()];
    });
    const alignmentClasses = computed(() => {
      if (props.align === 'left') {
        return 'ltr:origin-top-left rtl:origin-top-right start-0';
      }
      if (props.align === 'right') {
        return 'ltr:origin-top-right rtl:origin-top-left end-0';
      }
      return 'origin-top';
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'relative z-20' }, _attrs))}><div>`);
      ssrRenderSlot(_ctx.$slots, 'trigger', {}, null, _push, _parent);
      _push(
        `</div><div style="${ssrRenderStyle(
          unref(open) ? null : { display: 'none' }
        )}" class="fixed inset-0 z-40"></div><div style="${ssrRenderStyle([
          unref(open) ? null : { display: 'none' },
          { display: 'none' },
        ])}" class="${ssrRenderClass([
          [widthClass.value, alignmentClasses.value, __props.valign == 'top' ? 'bottom-full' : 'top-full'],
          'absolute z-50 my-2 rounded-md shadow-lg',
        ])}"><div class="${ssrRenderClass([__props.contentClasses, 'rounded-md ring-1 ring-black/5'])}">`
      );
      ssrRenderSlot(_ctx.$slots, 'content', {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  },
};
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/Dropdown.vue');
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const _sfc_main$u = {
  __name: 'DropdownLink',
  __ssrInlineRender: true,
  props: {
    href: String,
    as: String,
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.as == 'button') {
        _push(
          `<button type="submit" class="flex w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-hidden focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out">`
        );
        ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
        _push(`</button>`);
      } else if (__props.as == 'a') {
        _push(
          `<a${ssrRenderAttr(
            'href',
            __props.href
          )} class="flex px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-hidden focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out">`
        );
        ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
        _push(`</a>`);
      } else {
        _push(
          ssrRenderComponent(
            unref(Link),
            {
              href: __props.href,
              class:
                'flex px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-hidden focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out',
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push2, _parent2, _scopeId);
                } else {
                  return [renderSlot(_ctx.$slots, 'default')];
                }
              }),
              _: 3,
            },
            _parent
          )
        );
      }
      _push(`</div>`);
    };
  },
};
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/DropdownLink.vue');
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const _sfc_main$t = {
  __name: 'FormSection',
  __ssrInlineRender: true,
  emits: ['submitted'],
  setup(__props) {
    const hasActions = computed(() => !!useSlots().actions);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'lg:grid lg:grid-cols-3 lg:gap-6' }, _attrs))}>`);
      _push(
        ssrRenderComponent(
          SectionTitle,
          null,
          {
            title: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderSlot(_ctx.$slots, 'title', {}, null, _push2, _parent2, _scopeId);
              } else {
                return [renderSlot(_ctx.$slots, 'title')];
              }
            }),
            description: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderSlot(_ctx.$slots, 'description', {}, null, _push2, _parent2, _scopeId);
              } else {
                return [renderSlot(_ctx.$slots, 'description')];
              }
            }),
            _: 3,
          },
          _parent
        )
      );
      _push(
        `<div class="mt-5 lg:mt-0 lg:col-span-2"><form><div class="${ssrRenderClass([
          hasActions.value ? 'sm:rounded-tl-md sm:rounded-tr-md' : 'sm:rounded-md',
          'px-4 py-5 bg-white dark:bg-gray-900 sm:p-6 shadow-sm',
        ])}"><div class="grid grid-cols-6 gap-6">`
      );
      ssrRenderSlot(_ctx.$slots, 'form', {}, null, _push, _parent);
      _push(`</div></div>`);
      if (hasActions.value) {
        _push(
          `<div class="flex items-center justify-end px-4 py-3 bg-gray-100 dark:bg-gray-950 text-end sm:px-6 shadow-sm sm:rounded-bl-md sm:rounded-br-md">`
        );
        ssrRenderSlot(_ctx.$slots, 'actions', {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></div>`);
    };
  },
};
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/FormSection.vue');
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const _sfc_main$s = {
  __name: 'InputLabel',
  __ssrInlineRender: true,
  props: {
    value: String,
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<label${ssrRenderAttrs(mergeProps({ class: 'inline-block font-medium text-sm text-mute' }, _attrs))}>`);
      if (__props.value) {
        _push(`<span>${ssrInterpolate(__props.value)}</span>`);
      } else {
        _push(`<span>`);
        ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
        _push(`</span>`);
      }
      _push(`</label>`);
    };
  },
};
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/InputLabel.vue');
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const _sfc_main$r = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(
    `<div${ssrRenderAttrs(
      mergeProps({ class: 'hidden sm:block' }, _attrs)
    )}><div class="py-8"><div class="border-t border-gray-200 dark:border-gray-700"></div></div></div>`
  );
}
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/SectionBorder.vue');
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const SectionBorder = /* @__PURE__ */ _export_sfc(_sfc_main$r, [['ssrRender', _sfc_ssrRender$1]]);
const _sfc_main$q = {
  __name: 'ThemeSwitch',
  __ssrInlineRender: true,
  setup(__props) {
    let currentTheme = localStorage.getItem('theme') || 'system';
    const changeTheme = theme => {
      currentTheme = theme;
      localStorage.setItem('theme', currentTheme);
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      } else if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        ssrRenderComponent(
          _sfc_main$v,
          mergeProps(
            {
              align: 'right',
              width: '40',
            },
            _attrs
          ),
          {
            trigger: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<button type="button" class="-m-1.5 flex items-center p-1.5"${_scopeId}><span class="dark:hidden"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"${_scopeId}></path></svg></span><span class="hidden dark:inline"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"${_scopeId}></path></svg></span></button>`
                );
              } else {
                return [
                  createVNode(
                    'button',
                    {
                      type: 'button',
                      class: '-m-1.5 flex items-center p-1.5',
                    },
                    [
                      createVNode('span', { class: 'dark:hidden' }, [
                        (openBlock(),
                        createBlock(
                          'svg',
                          {
                            xmlns: 'http://www.w3.org/2000/svg',
                            fill: 'none',
                            viewBox: '0 0 24 24',
                            'stroke-width': '1.5',
                            stroke: 'currentColor',
                            class: 'size-5',
                          },
                          [
                            createVNode('path', {
                              'stroke-linecap': 'round',
                              'stroke-linejoin': 'round',
                              d: 'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z',
                            }),
                          ]
                        )),
                      ]),
                      createVNode('span', { class: 'hidden dark:inline' }, [
                        (openBlock(),
                        createBlock(
                          'svg',
                          {
                            xmlns: 'http://www.w3.org/2000/svg',
                            fill: 'none',
                            viewBox: '0 0 24 24',
                            'stroke-width': '1.5',
                            stroke: 'currentColor',
                            class: 'size-5',
                          },
                          [
                            createVNode('path', {
                              'stroke-linecap': 'round',
                              'stroke-linejoin': 'round',
                              d: 'M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z',
                            }),
                          ]
                        )),
                      ]),
                    ]
                  ),
                ];
              }
            }),
            content: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="py-1"${_scopeId}>`);
                _push2(
                  ssrRenderComponent(
                    _sfc_main$u,
                    {
                      as: 'button',
                      onClick: () => changeTheme('light'),
                    },
                    {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(
                            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-2"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"${_scopeId2}></path></svg> ${ssrInterpolate(
                              _ctx.$t('Light')
                            )}`
                          );
                        } else {
                          return [
                            (openBlock(),
                            createBlock(
                              'svg',
                              {
                                xmlns: 'http://www.w3.org/2000/svg',
                                fill: 'none',
                                viewBox: '0 0 24 24',
                                'stroke-width': '1.5',
                                stroke: 'currentColor',
                                class: 'size-5 mr-2',
                              },
                              [
                                createVNode('path', {
                                  'stroke-linecap': 'round',
                                  'stroke-linejoin': 'round',
                                  d: 'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z',
                                }),
                              ]
                            )),
                            createTextVNode(' ' + toDisplayString(_ctx.$t('Light')), 1),
                          ];
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                );
                _push2(
                  ssrRenderComponent(
                    _sfc_main$u,
                    {
                      as: 'button',
                      onClick: () => changeTheme('dark'),
                    },
                    {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(
                            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-2"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"${_scopeId2}></path></svg> ${ssrInterpolate(
                              _ctx.$t('Dark')
                            )}`
                          );
                        } else {
                          return [
                            (openBlock(),
                            createBlock(
                              'svg',
                              {
                                xmlns: 'http://www.w3.org/2000/svg',
                                fill: 'none',
                                viewBox: '0 0 24 24',
                                'stroke-width': '1.5',
                                stroke: 'currentColor',
                                class: 'size-5 mr-2',
                              },
                              [
                                createVNode('path', {
                                  'stroke-linecap': 'round',
                                  'stroke-linejoin': 'round',
                                  d: 'M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z',
                                }),
                              ]
                            )),
                            createTextVNode(' ' + toDisplayString(_ctx.$t('Dark')), 1),
                          ];
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                );
                _push2(
                  ssrRenderComponent(
                    _sfc_main$u,
                    {
                      as: 'button',
                      onClick: () => changeTheme('system'),
                    },
                    {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(
                            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-2"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"${_scopeId2}></path></svg> ${ssrInterpolate(
                              _ctx.$t('System')
                            )}`
                          );
                        } else {
                          return [
                            (openBlock(),
                            createBlock(
                              'svg',
                              {
                                xmlns: 'http://www.w3.org/2000/svg',
                                fill: 'none',
                                viewBox: '0 0 24 24',
                                'stroke-width': '1.5',
                                stroke: 'currentColor',
                                class: 'size-5 mr-2',
                              },
                              [
                                createVNode('path', {
                                  'stroke-linecap': 'round',
                                  'stroke-linejoin': 'round',
                                  d: 'M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25',
                                }),
                              ]
                            )),
                            createTextVNode(' ' + toDisplayString(_ctx.$t('System')), 1),
                          ];
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                );
                _push2(`</div>`);
              } else {
                return [
                  createVNode('div', { class: 'py-1' }, [
                    createVNode(
                      _sfc_main$u,
                      {
                        as: 'button',
                        onClick: () => changeTheme('light'),
                      },
                      {
                        default: withCtx(() => [
                          (openBlock(),
                          createBlock(
                            'svg',
                            {
                              xmlns: 'http://www.w3.org/2000/svg',
                              fill: 'none',
                              viewBox: '0 0 24 24',
                              'stroke-width': '1.5',
                              stroke: 'currentColor',
                              class: 'size-5 mr-2',
                            },
                            [
                              createVNode('path', {
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round',
                                d: 'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z',
                              }),
                            ]
                          )),
                          createTextVNode(' ' + toDisplayString(_ctx.$t('Light')), 1),
                        ]),
                        _: 1,
                      },
                      8,
                      ['onClick']
                    ),
                    createVNode(
                      _sfc_main$u,
                      {
                        as: 'button',
                        onClick: () => changeTheme('dark'),
                      },
                      {
                        default: withCtx(() => [
                          (openBlock(),
                          createBlock(
                            'svg',
                            {
                              xmlns: 'http://www.w3.org/2000/svg',
                              fill: 'none',
                              viewBox: '0 0 24 24',
                              'stroke-width': '1.5',
                              stroke: 'currentColor',
                              class: 'size-5 mr-2',
                            },
                            [
                              createVNode('path', {
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round',
                                d: 'M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z',
                              }),
                            ]
                          )),
                          createTextVNode(' ' + toDisplayString(_ctx.$t('Dark')), 1),
                        ]),
                        _: 1,
                      },
                      8,
                      ['onClick']
                    ),
                    createVNode(
                      _sfc_main$u,
                      {
                        as: 'button',
                        onClick: () => changeTheme('system'),
                      },
                      {
                        default: withCtx(() => [
                          (openBlock(),
                          createBlock(
                            'svg',
                            {
                              xmlns: 'http://www.w3.org/2000/svg',
                              fill: 'none',
                              viewBox: '0 0 24 24',
                              'stroke-width': '1.5',
                              stroke: 'currentColor',
                              class: 'size-5 mr-2',
                            },
                            [
                              createVNode('path', {
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round',
                                d: 'M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25',
                              }),
                            ]
                          )),
                          createTextVNode(' ' + toDisplayString(_ctx.$t('System')), 1),
                        ]),
                        _: 1,
                      },
                      8,
                      ['onClick']
                    ),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent
        )
      );
    };
  },
};
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Jet/ThemeSwitch.vue');
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _sfc_main$p = {
  __name: 'Input',
  __ssrInlineRender: true,
  props: {
    id: {
      type: String,
      default() {
        return (Math.random() + '').replace('0.', '');
      },
    },
    type: {
      type: String,
      default: 'text',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    step: {
      type: String,
      default: '1',
    },
    min: String,
    max: String,
    error: String,
    label: String,
    title: String,
    pattern: String,
    action: Function,
    actionText: String,
    modelValue: String,
    placeholder: String,
    selectOnFocus: Boolean,
  },
  emits: ['blur-sm', 'input', 'change', 'focus', 'keyup', 'update:modelValue'],
  setup(__props, { emit: __emit }) {
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<!--[-->`);
      if (__props.label) {
        _push(`<div class="flex items-center justify-between mb-1">`);
        _push(
          ssrRenderComponent(
            unref(_sfc_main$s),
            {
              for: __props.id,
              value: __props.label,
            },
            null,
            _parent
          )
        );
        if (__props.actionText && __props.action) {
          _push(`<button type="button" class="link text-sm">${ssrInterpolate(__props.actionText)}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        `<input${ssrRenderAttr('id', __props.id)}${ssrRenderAttr('min', __props.min)}${ssrRenderAttr('max', __props.max)}${ssrRenderAttr(
          'step',
          __props.step
        )}${ssrRenderAttr('type', __props.type)}${ssrRenderAttr('title', __props.title)}${ssrRenderAttr(
          'pattern',
          __props.pattern
        )}${ssrRenderAttr('value', __props.modelValue)}${ssrIncludeBooleanAttr(__props.readonly) ? ' readonly' : ''}${ssrRenderAttr(
          'placeholder',
          __props.placeholder || __props.label || ''
        )} class="${ssrRenderClass([
          {
            error: __props.error,
            'border-gray-300 dark:border-gray-700': !__props.error,
            'focus:ring-0 border-gray-300 focus:border-gray-300 dark:focus:border-gray-700 opacity-60': __props.readonly,
            'focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600': !__props.readonly,
          },
          'block w-full dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-xs',
        ])}">`
      );
      _push(
        ssrRenderComponent(
          unref(_sfc_main$B),
          {
            message: (_a = __props.error) == null ? void 0 : _a.replace(' id', ''),
            class: 'mt-2',
          },
          null,
          _parent
        )
      );
      _push(`<!--]-->`);
    };
  },
};
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/Input.vue');
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = {
  __name: 'Alerts',
  __ssrInlineRender: true,
  emits: ['close'],
  setup(__props, { emit: __emit }) {
    const data = ref({});
    const loading = ref(true);
    onMounted(async () => {
      await axios$1
        .get(T('alerts'))
        .then(res => (data.value = res.data))
        .finally(() => (loading.value = false));
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Icon = resolveComponent('Icon');
      _push(
        `<div${ssrRenderAttrs(
          _attrs
        )}><span class="absolute top-4 right-12 sm:right-14 inline-flex items-center gap-x-4 print:hidden"><button type="button" class="link -m-2 p-2">`
      );
      _push(
        ssrRenderComponent(
          _component_Icon,
          {
            name: 'print-o',
            class: 'size-5',
          },
          null,
          _parent
        )
      );
      _push(
        `</button></span><div class="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 print:hidden"><div class="sm:flex sm:items-baseline sm:justify-between"><div class="sm:w-0 sm:flex-1"><h1 class="text-base font-semibold text-focus">${ssrInterpolate(
          _ctx.$t('Notifications')
        )}</h1><p class="mt-1 truncate text-sm text-mute">${ssrInterpolate(
          _ctx.$t('Please view the app alerts below')
        )}</p></div></div></div>`
      );
      if (loading.value) {
        _push(`<div>`);
        _push(ssrRenderComponent(unref(_sfc_main$j), null, null, _parent));
        _push(`</div>`);
      } else {
        _push(
          `<div class="px-6"><dl class="my-6 grid grid-cols-1 gap-0.5 overflow-hidden rounded-md text-center sm:grid-cols-2 md:grid-cols-3">`
        );
        if (((_a = data.value) == null ? void 0 : _a.customers) > 0) {
          _push(
            `<button type="button" class="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900"><span class="text-sm/6 font-semibold">${ssrInterpolate(
              data.value.customers == 1 ? _ctx.$t('Customer') : _ctx.$t('Customers')
            )}</span><span class="text-sm/6 font-semibold -mt-1">${ssrInterpolate(
              _ctx.$t('reached due limit')
            )}</span><span class="order-first text-3xl font-semibold tracking-tight text-focused">${ssrInterpolate(
              data.value.customers
            )}</span></button>`
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</dl><!--[-->`);
        ssrRenderList(data.value.stores, store2 => {
          _push(
            `<!--[--><div class="border-b border-gray-200 dark:border-gray-700 pb-2 mt-6"><h3 class="text-base font-bold text-focus">${ssrInterpolate(
              store2.name
            )}</h3></div><div class="my-6 grid grid-cols-1 gap-0.5 overflow-hidden rounded-md text-center sm:grid-cols-2 md:grid-cols-3">`
          );
          if ((store2 == null ? void 0 : store2.reorder_stock) > 0) {
            _push(
              `<button type="button" class="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900"><span class="text-sm/6 font-semibold">${ssrInterpolate(
                _ctx.$t('Low Stock')
              )}</span><span class="order-first text-3xl font-semibold tracking-tight text-focused">${ssrInterpolate(
                (store2 == null ? void 0 : store2.reorder_stock) || 0
              )}</span></button>`
            );
          } else {
            _push(`<!---->`);
          }
          if ((store2 == null ? void 0 : store2.unpaid_sales) > 0) {
            _push(
              `<button type="button" class="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900"><span class="text-sm/6 font-semibold">${ssrInterpolate(
                _ctx.$t('Unpaid {x}', { x: _ctx.$t('Sales') })
              )}</span><span class="order-first text-3xl font-semibold tracking-tight text-focused">${ssrInterpolate(
                store2.unpaid_sales
              )}</span></button>`
            );
          } else {
            _push(`<!---->`);
          }
          if ((store2 == null ? void 0 : store2.due_sales) > 0) {
            _push(
              `<button type="button" class="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900"><span class="text-sm/6 font-semibold">${ssrInterpolate(
                _ctx.$t('Overdue {x}', { x: _ctx.$t('Sales') })
              )}</span><span class="order-first text-3xl font-semibold tracking-tight text-focused">${ssrInterpolate(
                store2.due_sales
              )}</span></button>`
            );
          } else {
            _push(`<!---->`);
          }
          if ((store2 == null ? void 0 : store2.unreceived_payments) > 0) {
            _push(
              `<button type="button" class="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900"><span class="text-sm/6 font-semibold">${ssrInterpolate(
                _ctx.$t('Payment Requests')
              )}</span><span class="order-first text-3xl font-semibold tracking-tight text-focused">${ssrInterpolate(
                store2.unreceived_payments
              )}</span></button>`
            );
          } else {
            _push(`<!---->`);
          }
          if ((store2 == null ? void 0 : store2.unpaid_purchases) > 0) {
            _push(
              `<button type="button" class="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900"><span class="text-sm/6 font-semibold">${ssrInterpolate(
                _ctx.$t('Unpaid {x}', { x: _ctx.$t('Purchases') })
              )}</span><span class="order-first text-3xl font-semibold tracking-tight text-focused">${ssrInterpolate(
                store2.unpaid_purchases
              )}</span></button>`
            );
          } else {
            _push(`<!---->`);
          }
          _push(`</div><!--]-->`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  },
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/Alerts.vue');
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = {
  __name: 'LoadingButton',
  __ssrInlineRender: true,
  props: {
    loading: Boolean,
    disabled: Boolean,
    loadingClass: String,
    type: {
      type: String,
      default: 'submit',
    },
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<button${ssrRenderAttrs(
          mergeProps(
            {
              type: __props.type,
              disabled: __props.disabled || __props.loading,
              class: [{ 'opacity-25': __props.loading }, 'btn-primary'],
            },
            _attrs
          )
        )}>`
      );
      ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      if (__props.loading) {
        _push(
          `<svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" class="${ssrRenderClass([
            __props.loadingClass,
            'stroke-current h-4 w-4 ml-2',
          ])}"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform></path></g></g></svg>`
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
    };
  },
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/LoadingButton.vue');
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = {
  __name: 'Button',
  __ssrInlineRender: true,
  props: {
    loading: Boolean,
    href: {
      type: String,
      default: '',
    },
    away: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'submit',
    },
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent('Link');
      if (__props.away && __props.href) {
        _push(
          `<a${ssrRenderAttrs(
            mergeProps(
              {
                href: __props.href,
                class: 'btn-primary',
              },
              _attrs
            )
          )}>`
        );
        ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
        _push(`</a>`);
      } else if (__props.href) {
        _push(
          ssrRenderComponent(
            _component_Link,
            mergeProps(
              {
                href: __props.href,
                class: 'btn-primary',
              },
              _attrs
            ),
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push2, _parent2, _scopeId);
                } else {
                  return [renderSlot(_ctx.$slots, 'default')];
                }
              }),
              _: 3,
            },
            _parent
          )
        );
      } else {
        _push(
          ssrRenderComponent(
            _sfc_main$n,
            mergeProps(
              {
                type: __props.type,
                loading: __props.loading,
                class: 'btn-primary',
              },
              _attrs
            ),
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push2, _parent2, _scopeId);
                } else {
                  return [renderSlot(_ctx.$slots, 'default')];
                }
              }),
              _: 3,
            },
            _parent
          )
        );
      }
    };
  },
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/Button.vue');
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = {
  __name: 'Toggle',
  __ssrInlineRender: true,
  props: {
    id: {
      type: String,
      default() {
        return (Math.random() + '').replace('0.', '');
      },
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: String,
    text: String,
    error: String,
  },
  emits: ['change', 'update:modelValue'],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(
          mergeProps({ class: 'flex items-center' }, _attrs)
        )}><button type="button" role="switch" class="${ssrRenderClass([
          __props.modelValue ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
        ])}"><span class="${ssrRenderClass([
          __props.modelValue ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white dark:bg-gray-500 ',
          'pointer-events-none inline-block size-5 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out',
        ])}"></span></button><label class="ml-3 text-sm">`
      );
      if (__props.label) {
        _push(`<span class="font-medium">${ssrInterpolate(__props.label)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.text) {
        _push(`<span class="text-mute ml-1">${ssrInterpolate(__props.text)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label></div>`);
    };
  },
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/Toggle.vue');
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const _sfc_main$k = {
  __name: 'Actions',
  __ssrInlineRender: true,
  props: {
    row: { type: Object },
    record: { type: String },
    deleted: { type: Boolean },
    editRow: { type: Function },
    deleting: { type: Boolean },
    deleteRow: { type: Function },
  },
  setup(__props) {
    const props = __props;
    const confirm = ref(false);
    watch(
      () => props.deleted,
      value => {
        if (value == props.row.id) {
          confirm.value = false;
        }
      }
    );
    function deleteRecord(row) {
      props.deleteRow(row);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = resolveComponent('Icon');
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'flex items-center gap-4 text-mute' }, _attrs))}>`);
      if (__props.editRow) {
        _push(`<button type="button" class="link">`);
        _push(ssrRenderComponent(_component_Icon, { name: 'edit-o' }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.deleteRow) {
        _push(`<button type="button">`);
        _push(
          ssrRenderComponent(
            _component_Icon,
            {
              name: 'trash-o',
              class: 'link-red',
            },
            null,
            _parent
          )
        );
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        ssrRenderComponent(
          unref(_sfc_main$C),
          {
            show: confirm.value,
            onClose: $event => (confirm.value = false),
            'max-width': 'sm',
            backdrop: !__props.deleting,
            closeable: !__props.deleting,
          },
          {
            title: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<span class="text-red-500"${_scopeId}>${ssrInterpolate(
                    _ctx.$t('Delete {x}', { x: __props.record || _ctx.$t('record') })
                  )}? </span>`
                );
              } else {
                return [
                  createVNode(
                    'span',
                    { class: 'text-red-500' },
                    toDisplayString(_ctx.$t('Delete {x}', { x: __props.record || _ctx.$t('record') })) + '? ',
                    1
                  ),
                ];
              }
            }),
            content: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<p${_scopeId}>${ssrInterpolate(
                    _ctx.$t('Are you sure you want to delete the {record}?', { record: __props.record || _ctx.$t('record') })
                  )}</p>`
                );
                if (__props.row.deleted_at) {
                  _push2(
                    `<div class="mt-4 text-red-500 font-extrabold"${_scopeId}><p${_scopeId}>${ssrInterpolate(
                      _ctx.$t('{x} will be deleted permanently from system.', { x: __props.record || _ctx.$t('Record') })
                    )}</p><p class="mt-2"${_scopeId}>${ssrInterpolate(
                      _ctx.$t('This action is not reversible!', { x: __props.record || _ctx.$t('Record') })
                    )}</p></div>`
                  );
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createVNode(
                    'p',
                    null,
                    toDisplayString(
                      _ctx.$t('Are you sure you want to delete the {record}?', { record: __props.record || _ctx.$t('record') })
                    ),
                    1
                  ),
                  __props.row.deleted_at
                    ? (openBlock(),
                      createBlock(
                        'div',
                        {
                          key: 0,
                          class: 'mt-4 text-red-500 font-extrabold',
                        },
                        [
                          createVNode(
                            'p',
                            null,
                            toDisplayString(
                              _ctx.$t('{x} will be deleted permanently from system.', { x: __props.record || _ctx.$t('Record') })
                            ),
                            1
                          ),
                          createVNode(
                            'p',
                            { class: 'mt-2' },
                            toDisplayString(_ctx.$t('This action is not reversible!', { x: __props.record || _ctx.$t('Record') })),
                            1
                          ),
                        ]
                      ))
                    : createCommentVNode('', true),
                ];
              }
            }),
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(
                    unref(_sfc_main$z),
                    {
                      onClick: $event => (confirm.value = false),
                      class: { 'opacity-25': __props.deleting },
                      disabled: __props.deleting,
                    },
                    {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`${ssrInterpolate(_ctx.$t('Cancel'))}`);
                        } else {
                          return [createTextVNode(toDisplayString(_ctx.$t('Cancel')), 1)];
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                );
                _push2(
                  ssrRenderComponent(
                    unref(_sfc_main$w),
                    {
                      class: ['ms-3', { 'opacity-25': __props.deleting }],
                      onClick: $event => deleteRecord(__props.row),
                      disabled: __props.deleting,
                    },
                    {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`${ssrInterpolate(_ctx.$t('Delete {x}', { x: __props.record || _ctx.$t('record') }))}`);
                        } else {
                          return [createTextVNode(toDisplayString(_ctx.$t('Delete {x}', { x: __props.record || _ctx.$t('record') })), 1)];
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                );
              } else {
                return [
                  createVNode(
                    unref(_sfc_main$z),
                    {
                      onClick: $event => (confirm.value = false),
                      class: { 'opacity-25': __props.deleting },
                      disabled: __props.deleting,
                    },
                    {
                      default: withCtx(() => [createTextVNode(toDisplayString(_ctx.$t('Cancel')), 1)]),
                      _: 1,
                    },
                    8,
                    ['onClick', 'class', 'disabled']
                  ),
                  createVNode(
                    unref(_sfc_main$w),
                    {
                      class: ['ms-3', { 'opacity-25': __props.deleting }],
                      onClick: $event => deleteRecord(__props.row),
                      disabled: __props.deleting,
                    },
                    {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.$t('Delete {x}', { x: __props.record || _ctx.$t('record') })), 1),
                      ]),
                      _: 1,
                    },
                    8,
                    ['onClick', 'class', 'disabled']
                  ),
                ];
              }
            }),
            _: 1,
          },
          _parent
        )
      );
      _push(`</div>`);
    };
  },
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/Actions.vue');
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = {
  __name: 'Loading',
  __ssrInlineRender: true,
  props: {
    loadingClass: {
      type: String,
      default: '',
    },
    circleSize: {
      type: String,
      default: 'h-10 w-10',
    },
    fullScreen: {
      type: Boolean,
      default: false,
    },
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(
          mergeProps(
            {
              class: [
                __props.fullScreen ? 'fixed inset-0 z-10' : 'absolute inset-0 z-1',
                'h-full w-full flex items-center justify-center text-gray-950 dark:text-gray-100',
              ],
            },
            _attrs
          )
        )}><div class="absolute inset-0 backdrop-blur-xs bg-gray-100 dark:bg-gray-900 opacity-75"></div><div class="${ssrRenderClass([
          __props.loadingClass,
          'z-10 flex items-center justify-center',
        ])}"><svg viewBox="0 0 38 38" class="${ssrRenderClass([
          __props.circleSize,
          'stroke-current inline',
        ])}" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="1.5"><circle stroke-opacity=".3" cx="18" cy="18" r="18"></circle><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform></path></g></g></svg></div></div>`
      );
    };
  },
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/Loading.vue');
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = {
  __name: 'CheckBox',
  __ssrInlineRender: true,
  props: {
    id: {
      type: String,
      default() {
        return (Math.random() + '').replace('0.', '');
      },
    },
    checked: {
      type: [Array, Boolean],
      default: false,
    },
    value: {
      type: String,
      default: null,
    },
    label: String,
    error: String,
  },
  emits: ['update:checked'],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const proxyChecked = computed({
      get() {
        return props.checked;
      },
      set(val) {
        emit('update:checked', val);
      },
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(_attrs)}><label${ssrRenderAttr('for', __props.id)} class="inline-flex items-start"><input${ssrRenderAttr(
          'id',
          __props.id
        )}${ssrRenderAttr('value', __props.value)} type="checkbox"${
          ssrIncludeBooleanAttr(Array.isArray(proxyChecked.value) ? ssrLooseContain(proxyChecked.value, __props.value) : proxyChecked.value)
            ? ' checked'
            : ''
        } class="${ssrRenderClass([
          { 'border-red-500': __props.error },
          'mt-1 rounded-sm border-gray-300 dark:border-gray-700 dark:bg-gray-600 text-primary-600 shadow-xs w-5 h-5 focus:rounded-sm focus:ring-offset-0 focus:ring-primary-200/50',
        ])}">`
      );
      if (__props.label) {
        _push(`<span class="ml-2 mt-0.5">${__props.label ?? ''}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label>`);
      _push(ssrRenderComponent(unref(_sfc_main$B), { message: __props.error }, null, _parent));
      _push(`</div>`);
    };
  },
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/CheckBox.vue');
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = {
  __name: 'TabMenus',
  __ssrInlineRender: true,
  props: { links: { type: Array } },
  setup(__props) {
    router.on('navigate', () => (currentRoute.value = T().current()));
    let currentRoute = ref(T().current());
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = resolveComponent('Icon');
      if (__props.links && __props.links.length) {
        _push(
          `<div${ssrRenderAttrs(
            mergeProps({ class: 'px-6 pt-6 sm:pt-0' }, _attrs)
          )}><div class="sm:hidden"><label for="tabs" class="sr-only">${ssrInterpolate(
            _ctx.$t('Select a tab')
          )}</label><select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800"><!--[-->`
        );
        ssrRenderList(__props.links, link => {
          _push(
            `<option${ssrRenderAttr('value', link.route)}${
              ssrIncludeBooleanAttr(link.route == unref(currentRoute)) ? ' selected' : ''
            }>${ssrInterpolate(link.label)}</option>`
          );
        });
        _push(
          `<!--]--></select></div><div class="hidden sm:block"><div class="border-b border-gray-200 dark:border-gray-700 -mx-6 px-6"><nav class="-mb-px flex space-x-8" aria-label="Tabs"><!--[-->`
        );
        ssrRenderList(__props.links, link => {
          _push(
            ssrRenderComponent(
              unref(Link),
              {
                href: unref(T)(link.route),
                class: [
                  'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium',
                  link.route == unref(currentRoute)
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-mute hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300',
                ],
              },
              {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    if (link.icon) {
                      _push2(
                        ssrRenderComponent(
                          _component_Icon,
                          {
                            name: link.icon,
                            size:
                              link.route == unref(currentRoute)
                                ? '-ml-0.5 mr-2 size-5 text-primary-500'
                                : '-ml-0.5 mr-2 size-5 text-gray-400 group-hover:text-gray-500',
                          },
                          null,
                          _parent2,
                          _scopeId
                        )
                      );
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`<span${_scopeId}>${ssrInterpolate(link.label)}</span>`);
                  } else {
                    return [
                      link.icon
                        ? (openBlock(),
                          createBlock(
                            _component_Icon,
                            {
                              key: 0,
                              name: link.icon,
                              size:
                                link.route == unref(currentRoute)
                                  ? '-ml-0.5 mr-2 size-5 text-primary-500'
                                  : '-ml-0.5 mr-2 size-5 text-gray-400 group-hover:text-gray-500',
                            },
                            null,
                            8,
                            ['name', 'size']
                          ))
                        : createCommentVNode('', true),
                      createVNode('span', null, toDisplayString(link.label), 1),
                    ];
                  }
                }),
                _: 2,
              },
              _parent
            )
          );
        });
        _push(`<!--]--></nav></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  },
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/TabMenus.vue');
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = {
  __name: 'Textarea',
  __ssrInlineRender: true,
  props: {
    id: {
      type: String,
      default() {
        return (Math.random() + '').replace('0.', '');
      },
    },
    modelValue: String,
    label: String,
    error: String,
    rows: String,
    className: String,
  },
  emits: ['update:modelValue'],
  setup(__props, { emit: __emit }) {
    const input = ref(null);
    onMounted(async () => {
      await nextTick();
      input.value.setAttribute('style', `height: ${input.value.scrollHeight + 2}px`);
    });
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(
        `<div${ssrRenderAttrs(
          mergeProps(
            {
              class: __props.className || 'col-span-6 sm:col-span-3 xl:col-span-6',
            },
            _attrs
          )
        )}>`
      );
      _push(
        ssrRenderComponent(
          unref(_sfc_main$s),
          {
            for: __props.id,
            value: __props.label,
          },
          null,
          _parent
        )
      );
      _push(
        `<textarea${ssrRenderAttrs(
          (_temp0 = mergeProps(
            {
              id: __props.id,
              ref_key: 'input',
              ref: input,
              rows: __props.rows,
            },
            _ctx.$attrs,
            {
              value: __props.modelValue,
              class: [
                { error: __props.error, 'border-gray-300 dark:border-gray-700': !__props.error },
                'mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-xs',
              ],
            }
          )),
          'textarea'
        )}>${ssrInterpolate('value' in _temp0 ? _temp0.value : '')}</textarea>`
      );
      if (__props.error) {
        _push(
          ssrRenderComponent(
            unref(_sfc_main$B),
            {
              message: __props.error,
              class: 'mt-0',
            },
            null,
            _parent
          )
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  },
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/Textarea.vue');
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = {
  __name: 'DateInput',
  __ssrInlineRender: true,
  props: {
    id: {
      type: String,
      default() {
        return (Math.random() + '').replace('0.', '');
      },
    },
    type: {
      type: String,
      default: 'text',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    monthPicker: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    time: {
      type: Boolean,
      default: false,
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
    teleport: {
      type: Boolean,
      default: false,
    },
    error: String,
    label: String,
    format: String,
    modelValue: String,
    placeholder: String,
    previewFormat: {
      type: Function,
      default: date => $date(date.toISOString()),
    },
  },
  emits: ['change', 'update:modelValue'],
  setup(__props, { emit: __emit }) {
    ref(null);
    const emit = __emit;
    function update(date) {
      emit('update:modelValue', date);
      emit('change', date);
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<!--[-->`);
      if (__props.label) {
        _push(`<div class="flex items-center justify-between">`);
        _push(
          ssrRenderComponent(
            unref(_sfc_main$s),
            {
              for: __props.id,
              value: __props.label,
              class: 'flex-1 mb-1',
            },
            null,
            _parent
          )
        );
        if (_ctx.actionText && _ctx.action) {
          _push(`<button type="button" class="link text-sm">${ssrInterpolate(_ctx.actionText)}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        ssrRenderComponent(
          unref(VueDatePicker),
          {
            uid: __props.id,
            'auto-apply': true,
            readonly: __props.readonly,
            teleport: __props.teleport,
            clearable: __props.clearable,
            'model-value': __props.modelValue,
            onCleared: e2 => update(e2),
            placeholder: __props.placeholder,
            'enable-time-picker': __props.time,
            'month-picker': __props.monthPicker,
            'hide-input-icon': !__props.showIcon,
            locale: _ctx.$page.props.language,
            'preview-format': __props.previewFormat,
            'onUpdate:modelValue': e2 => update(e2),
            format: __props.monthPicker ? 'MMM yyyy' : __props.time ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd',
          },
          null,
          _parent
        )
      );
      _push(
        ssrRenderComponent(
          unref(_sfc_main$B),
          {
            message: (_a = __props.error) == null ? void 0 : _a.replace(' id', ''),
            class: 'mt-2',
          },
          null,
          _parent
        )
      );
      _push(`<!--]-->`);
    };
  },
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/DateInput.vue');
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = {
  __name: 'FileInput',
  __ssrInlineRender: true,
  props: {
    id: {
      type: String,
      default() {
        return (Math.random() + '').replace('0.', '');
      },
    },
    type: {
      type: String,
      default: 'text',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: 'image/*',
    },
    modelValue: String,
    label: String,
    error: String,
  },
  emits: ['input', 'update:modelValue'],
  setup(__props, { emit: __emit }) {
    const photo = ref(null);
    const { t: t4 } = useI18n({});
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.label) {
        _push(
          ssrRenderComponent(
            unref(_sfc_main$s),
            {
              for: __props.id,
              value: __props.label,
              class: 'mb-1',
            },
            null,
            _parent
          )
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `<input${ssrRenderAttr('id', __props.id)}${
          ssrIncludeBooleanAttr(__props.multiple) ? ' multiple' : ''
        } type="file" name="photo"${ssrRenderAttr('accept', __props.accept)} class="invisible absolute"><label${ssrRenderAttr(
          'for',
          __props.id
        )} class="${ssrRenderClass([
          {
            'border-red-500': __props.error,
            'text-gray-700 dark:text-gray-300': photo.value,
            'text-gray-400 dark:text-gray-600': !photo.value,
            'border-gray-300 dark:border-gray-700': !__props.error,
          },
          'cursor-pointer inline-block py-2 px-4 border text-left w-full focus:border-primary-300 focus:ring-3 focus:ring-primary-200/50 rounded-md shadow-xs dark:bg-gray-900',
        ])}">${ssrInterpolate(photo.value ? photo.value : unref(t4)('Select'))}</label>`
      );
      if (__props.error) {
        _push(
          ssrRenderComponent(
            unref(_sfc_main$B),
            {
              message: __props.error,
              class: 'mt-1',
            },
            null,
            _parent
          )
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  },
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/FileInput.vue');
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = {
  __name: 'ClientOnly',
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(isClient)) {
        ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      } else {
        _push(`<!---->`);
      }
    };
  },
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/ClientOnly.vue');
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = {
  __name: 'Pagination',
  __ssrInlineRender: true,
  props: ['meta', 'links', 'half'],
  setup(__props) {
    const props = __props;
    computed(() => {
      if (props.meta.last_page > 9) {
        const previous = props.links.shift();
        const next = props.links.pop();
        let links = props.links.slice(
          props.meta.current_page > 4 ? props.meta.current_page - 4 : 0,
          props.meta.last_page > props.meta.current_page + 3 ? props.meta.current_page + 3 : props.meta.last_page
        );
        links.unshift(previous);
        links.push(next);
        if (props.meta.current_page > 4) {
          links.unshift({ ...props.meta.links[0], label: '&Lang;' });
        }
        if (props.meta.last_page > props.meta.current_page + 3) {
          links.push({ ...props.meta.links[props.meta.links.length - 1], label: '&Rang;' });
        }
        return links;
      }
      return props.meta.links;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent('Link');
      if (__props.meta && __props.meta.total > 0) {
        _push(
          `<div${ssrRenderAttrs(_attrs)}><div class="hidden xl:flex items-center justify-between"><div class="mr-4 py-1.5">${ssrInterpolate(
            _ctx.$t('Showing from {from} to {to} of total {total} records', {
              from: Math.ceil(__props.meta.from / (__props.half ? 2 : 1)),
              to: Math.ceil(__props.meta.to / (__props.half ? 2 : 1)),
              total: Math.ceil(__props.meta.total / (__props.half ? 2 : 1)),
            })
          )}</div>`
        );
        if (__props.meta.last_page > 1) {
          _push(`<div class="flex flex-wrap gap-1"><!--[-->`);
          ssrRenderList(__props.meta.links, (link, i2) => {
            _push(`<!--[-->`);
            if (link.url === null) {
              _push(
                `<div class="px-4 py-3 text-sm leading-4 border border-gray-200 dark:border-gray-700 opacity-50 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 rounded-md cursor-default">${
                  link.label.replace('Next', '').replace('Previous', '').replace('&laquo;', '⟨').replace('&raquo;', '⟩') ?? ''
                }</div>`
              );
            } else {
              _push(
                ssrRenderComponent(
                  _component_Link,
                  {
                    href: link.url,
                    class: [
                      link.active
                        ? 'bg-primary-600 border-primary-700 text-white'
                        : 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300',
                      'inline-block whitespace-nowrap px-4 py-3 text-sm leading-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-primary-700 hover:text-white hover:border-primary-700 focus:border-primary-600',
                    ],
                  },
                  null,
                  _parent
                )
              );
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex items-center justify-between xl:hidden">`);
        if (__props.meta.last_page > 1) {
          _push(
            ssrRenderComponent(
              _component_Link,
              {
                href: __props.links.prev,
                class: [
                  'inline-block whitespace-nowrap px-4 py-3 text-sm leading-4 border border-gray-200 dark:border-gray-700 rounded-md print:hidden',
                  __props.links.prev
                    ? 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:bg-primary-700 hover:text-white hover:border-primary-700 focus:border-primary-600'
                    : 'bg-gray-100 cursor-default',
                ],
              },
              {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` ⟪ <span class="hidden sm:inline-block ml-1"${_scopeId}>${ssrInterpolate(_ctx.$t('Previous'))}</span>`);
                  } else {
                    return [
                      createTextVNode(' ⟪ '),
                      createVNode('span', { class: 'hidden sm:inline-block ml-1' }, toDisplayString(_ctx.$t('Previous')), 1),
                    ];
                  }
                }),
                _: 1,
              },
              _parent
            )
          );
        } else {
          _push(`<!---->`);
        }
        _push(
          `<div class="mx-3">${ssrInterpolate(
            _ctx.$t('Showing from {from} to {to} of total {total} records', {
              from: Math.ceil(__props.meta.from / (__props.half ? 2 : 1)),
              to: Math.ceil(__props.meta.to / (__props.half ? 2 : 1)),
              total: Math.ceil(__props.meta.total / (__props.half ? 2 : 1)),
            })
          )}</div>`
        );
        if (__props.meta.last_page > 1) {
          _push(
            ssrRenderComponent(
              _component_Link,
              {
                href: __props.links.next,
                class: [
                  'inline-block whitespace-nowrap px-4 py-3 text-sm leading-4 border border-gray-200 dark:border-gray-700 rounded-md print:hidden',
                  __props.links.next
                    ? 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:bg-primary-700 hover:text-white hover:border-primary-700 focus:border-primary-600'
                    : 'bg-gray-100 cursor-default',
                ],
              },
              {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<span class="hidden sm:inline-block mr-1"${_scopeId}>${ssrInterpolate(_ctx.$t('Next'))}</span> ⟫ `);
                  } else {
                    return [
                      createVNode('span', { class: 'hidden sm:inline-block mr-1' }, toDisplayString(_ctx.$t('Next')), 1),
                      createTextVNode(' ⟫ '),
                    ];
                  }
                }),
                _: 1,
              },
              _parent
            )
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  },
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/Pagination.vue');
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = {
  __name: 'Attachments',
  __ssrInlineRender: true,
  props: {
    attachments: {
      type: Array,
    },
  },
  setup(__props) {
    const modal = ref(false);
    const selected = ref(null);
    computed(() => usePage().props.auth.user);
    const destroy = () => {
      router.delete(route('attachments.destroy', selected.value.id), {
        onFinish: closeModal,
      });
    };
    const closeModal = () => {
      modal.value = false;
      selected.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.attachments.length) {
        _push(
          `<div${ssrRenderAttrs(_attrs)}><p class="mb-1">${ssrInterpolate(
            _ctx.$t('Attachments')
          )}</p><ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700 rounded-md border border-gray-200 dark:border-gray-700"><!--[-->`
        );
        ssrRenderList(__props.attachments, attachment2 => {
          _push(
            `<li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"><div class="flex w-0 flex-1 items-center"><svg class="h-5 w-5 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd"></path></svg><div class="ml-4 flex min-w-0 flex-1 gap-2"><span class="truncate font-medium">${ssrInterpolate(
              attachment2.title
            )}</span></div></div><div class="ml-4 shrink-0 flex items-center gap-2"><a${ssrRenderAttr(
              'href',
              _ctx.route('attachments.download', attachment2.uuid)
            )} class="font-medium link">${ssrInterpolate(_ctx.$t('Download'))}</a>`
          );
          if (_ctx.$can('delete-attachments')) {
            _push(
              `<button type="button" class="font-medium text-red-600 hover:text-red-500">${ssrInterpolate(_ctx.$t('Delete'))}</button>`
            );
          } else {
            _push(`<!---->`);
          }
          _push(`</div></li>`);
        });
        _push(`<!--]--></ul>`);
        _push(
          ssrRenderComponent(
            unref(_sfc_main$C),
            {
              show: modal.value,
              onClose: closeModal,
              maxWidth: 'sm',
            },
            {
              title: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(_ctx.$t('Delete {x}', { x: _ctx.$t('attachment') }))}`);
                } else {
                  return [createTextVNode(toDisplayString(_ctx.$t('Delete {x}', { x: _ctx.$t('attachment') })), 1)];
                }
              }),
              content: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    `<p${_scopeId}>${ssrInterpolate(
                      _ctx.$t('Please confirm that you would like to delete the record?')
                    )}</p><p class="mt-2 text-red-500"${_scopeId}>${ssrInterpolate(
                      _ctx.$t('This action will delete the data permanently.')
                    )}</p>`
                  );
                } else {
                  return [
                    createVNode('p', null, toDisplayString(_ctx.$t('Please confirm that you would like to delete the record?')), 1),
                    createVNode(
                      'p',
                      { class: 'mt-2 text-red-500' },
                      toDisplayString(_ctx.$t('This action will delete the data permanently.')),
                      1
                    ),
                  ];
                }
              }),
              footer: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    ssrRenderComponent(
                      unref(_sfc_main$z),
                      { onClick: closeModal },
                      {
                        default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                          if (_push3) {
                            _push3(`${ssrInterpolate(_ctx.$t('Cancel'))}`);
                          } else {
                            return [createTextVNode(toDisplayString(_ctx.$t('Cancel')), 1)];
                          }
                        }),
                        _: 1,
                      },
                      _parent2,
                      _scopeId
                    )
                  );
                  _push2(
                    ssrRenderComponent(
                      unref(_sfc_main$w),
                      { onClick: destroy },
                      {
                        default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                          if (_push3) {
                            _push3(`${ssrInterpolate(_ctx.$t('Yes, delete'))}`);
                          } else {
                            return [createTextVNode(toDisplayString(_ctx.$t('Yes, delete')), 1)];
                          }
                        }),
                        _: 1,
                      },
                      _parent2,
                      _scopeId
                    )
                  );
                } else {
                  return [
                    createVNode(
                      unref(_sfc_main$z),
                      { onClick: closeModal },
                      {
                        default: withCtx(() => [createTextVNode(toDisplayString(_ctx.$t('Cancel')), 1)]),
                        _: 1,
                      }
                    ),
                    createVNode(
                      unref(_sfc_main$w),
                      { onClick: destroy },
                      {
                        default: withCtx(() => [createTextVNode(toDisplayString(_ctx.$t('Yes, delete')), 1)]),
                        _: 1,
                      }
                    ),
                  ];
                }
              }),
              _: 1,
            },
            _parent
          )
        );
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  },
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/Attachments.vue');
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {
  __name: 'NumberInput',
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: [String, Number],
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    delOn: {
      type: Number,
    },
    id: {
      type: String,
      default() {
        return (Math.random() + '').replace('0.', '');
      },
    },
  },
  emits: ['change', 'remove', 'update:modelValue'],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const value = computed({
      get: () => props.modelValue,
      set: value2 => {
        emit('update:modelValue', value2);
        emit('change', value2);
      },
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'flex items-center max-w-[7rem]' }, _attrs))}>`);
      if (__props.delOn === 0 && __props.delOn == value.value) {
        _push(
          `<button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border rounded-s-lg p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-hidden"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 -mx-1 -my-2 text-red-600"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path></svg></button>`
        );
      } else {
        _push(
          `<button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border rounded-s-lg p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-hidden"><svg fill="none" aria-hidden="true" viewBox="0 0 18 2" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-gray-900 dark:text-white"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"></path></svg></button>`
        );
      }
      _push(
        `<input${ssrRenderAttr('id', __props.id)} type="text" placeholder="1"${ssrRenderAttr(
          'value',
          value.value
        )} class="border border-gray-200 dark:border-gray-600 border-x-0 h-8 text-center text-gray-900 text-sm block w-full py-2.5 dark:bg-gray-800 dark:placeholder-gray-400 dark:text-white"><button type="button" id="increment-button" data-input-counter-increment="quantity-input" class="bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border rounded-e-lg p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-hidden"><svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"></path></svg></button></div>`
      );
    };
  },
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/NumberInput.vue');
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = {
  __name: 'SelectStore',
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const { t: t4 } = useI18n({});
    watch(
      () => page.props.flash,
      () => {
        var _a;
        page.props.select_store = ((_a = page.props.flash) == null ? void 0 : _a.select_store) ? true : false;
      }
    );
    function hide(e2) {
      page.props.select_store = false;
    }
    function selectStore(id) {
      router.visit(route('stores.select', { id }), {
        method: 'post',
        onSuccess: () => (page.props.select_store = false),
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = resolveComponent('Icon');
      _push(
        ssrRenderComponent(
          unref(_sfc_main$E),
          mergeProps(
            {
              show: unref(page).props.select_store,
              'max-width': 'md',
              onClose: hide,
            },
            _attrs
          ),
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="p-6"${_scopeId}><div class="flex items-center justify-start gap-4"${_scopeId}><div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-100"${_scopeId}>`
                );
                _push2(
                  ssrRenderComponent(
                    _component_Icon,
                    {
                      name: 'store-o',
                      size: 'size-5 text-primary-600',
                    },
                    null,
                    _parent2,
                    _scopeId
                  )
                );
                _push2(
                  `</div><div class="flex-1 grow"${_scopeId}><h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"${_scopeId}>${ssrInterpolate(
                    _ctx.$t('Select {x}', { x: _ctx.$t('Store') })
                  )}</h3><p class="text-sm"${_scopeId}>${ssrInterpolate(
                    _ctx.$t('Please select a store first!')
                  )}</p></div></div><div class="mt-6 sm:mt-8 grid grid-cols-2 gap-6"${_scopeId}><!--[-->`
                );
                ssrRenderList(unref(page).props.available_stores, store2 => {
                  _push2(`<!--[-->`);
                  if (store2.id == unref(page).props.selected_store) {
                    _push2(
                      `<button class="inline-flex w-full justify-center rounded-lg bg-yellow-100 yellow:bg-yellow-800 px-3 py-2 text-sm font-semibold text-yellow-900 yellow:text-yellow-100 shadow-xs hover:bg-yellow-300 yellow:hover:bg-yellow-700 focus"${_scopeId}>${ssrInterpolate(
                        _ctx.$t('Unselect {x}', { x: store2.name })
                      )}</button>`
                    );
                  } else {
                    _push2(
                      `<button class="inline-flex w-full justify-center rounded-lg bg-gray-100 dark:bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs hover:bg-gray-300 dark:hover:bg-gray-700 focus"${_scopeId}>${ssrInterpolate(
                        _ctx.$t('Select {x}', { x: store2.name })
                      )}</button>`
                    );
                  }
                  _push2(`<!--]-->`);
                });
                _push2(`<!--]--></div></div>`);
              } else {
                return [
                  createVNode('div', { class: 'p-6' }, [
                    createVNode('div', { class: 'flex items-center justify-start gap-4' }, [
                      createVNode('div', { class: 'mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-100' }, [
                        createVNode(_component_Icon, {
                          name: 'store-o',
                          size: 'size-5 text-primary-600',
                        }),
                      ]),
                      createVNode('div', { class: 'flex-1 grow' }, [
                        createVNode(
                          'h3',
                          { class: 'text-base font-semibold leading-6 text-gray-900 dark:text-gray-100' },
                          toDisplayString(_ctx.$t('Select {x}', { x: _ctx.$t('Store') })),
                          1
                        ),
                        createVNode('p', { class: 'text-sm' }, toDisplayString(_ctx.$t('Please select a store first!')), 1),
                      ]),
                    ]),
                    createVNode('div', { class: 'mt-6 sm:mt-8 grid grid-cols-2 gap-6' }, [
                      (openBlock(true),
                      createBlock(
                        Fragment,
                        null,
                        renderList(unref(page).props.available_stores, store2 => {
                          return (
                            openBlock(),
                            createBlock(
                              Fragment,
                              {
                                key: store2.id,
                              },
                              [
                                store2.id == unref(page).props.selected_store
                                  ? (openBlock(),
                                    createBlock(
                                      'button',
                                      {
                                        key: 0,
                                        onClick: $event => selectStore(0),
                                        class:
                                          'inline-flex w-full justify-center rounded-lg bg-yellow-100 yellow:bg-yellow-800 px-3 py-2 text-sm font-semibold text-yellow-900 yellow:text-yellow-100 shadow-xs hover:bg-yellow-300 yellow:hover:bg-yellow-700 focus',
                                      },
                                      toDisplayString(_ctx.$t('Unselect {x}', { x: store2.name })),
                                      9,
                                      ['onClick']
                                    ))
                                  : (openBlock(),
                                    createBlock(
                                      'button',
                                      {
                                        key: 1,
                                        onClick: $event => selectStore(store2.id),
                                        class:
                                          'inline-flex w-full justify-center rounded-lg bg-gray-100 dark:bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs hover:bg-gray-300 dark:hover:bg-gray-700 focus',
                                      },
                                      toDisplayString(_ctx.$t('Select {x}', { x: store2.name })),
                                      9,
                                      ['onClick']
                                    )),
                              ],
                              64
                            )
                          );
                        }),
                        128
                      )),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent
        )
      );
    };
  },
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/SelectStore.vue');
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
function useClickOutside(component, callback, excludeComponent) {
  if (!component) {
    throw new Error('A target component has to be provided.');
  }
  if (!callback) {
    throw new Error('A callback has to be provided.');
  }
  const listener = event => {
    if (
      event.target === component.value ||
      event.composedPath().includes(component.value) ||
      event.target === excludeComponent.value ||
      event.composedPath().includes(excludeComponent.value)
    ) {
      return;
    }
    if (typeof callback === 'function') {
      callback();
    }
  };
  onMounted(() => {
    window.addEventListener('click', listener);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('click', listener);
  });
}
const _sfc_main$8 = {
  __name: 'AutoComplete',
  __ssrInlineRender: true,
  props: {
    id: {
      type: String,
      default() {
        return Math.random().toString().replace('0.', '1');
      },
    },
    json: Boolean,
    size: String,
    label: String,
    error: String,
    action: Function,
    addResult: Array,
    position: String,
    disabled: Boolean,
    actionText: String,
    defaultText: String,
    placeholder: String,
    disable: [String, Number],
    suggestions: [String, Array],
    selectedValues: [String, Array],
    modelValue: [String, Number, Array],
    hideIcon: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    keepFocus: { type: Boolean, default: false },
    labelKey: { type: String, default: 'label' },
    searchable: { type: Boolean, default: true },
    valueKey: { type: String, default: 'value' },
    placement: { type: String, default: 'bottom' },
    resetSearch: { type: Boolean, default: false },
    inputClass: { type: String, default: '' },
  },
  emits: ['change', 'update:modelValue'],
  setup(__props, { emit: __emit }) {
    const { t: t4 } = useI18n({});
    const excludeRef = ref(null);
    const componentRef = ref(null);
    const emit = __emit;
    const by_id = ref(false);
    const auto_complete = ref(null);
    const props = __props;
    const search = ref('');
    const result = ref([]);
    const input = ref(null);
    const open = ref(false);
    const stop = ref(false);
    const search0 = ref('');
    const current = ref(null);
    const loading = ref(false);
    const selected = ref(null);
    const multi_current = ref([]);
    const multi_selected = ref([]);
    watch(
      () => props.modelValue,
      async v2 => {
        if (!v2) {
          reset();
          await hide();
        } else {
          if (props.multiple) {
            let vl = multi_selected.value.map(s2 => (props.json ? s2[props.valueKey] : s2));
            if (v2.toString() !== vl.toString()) {
              await initializeValue();
            }
          } else {
            by_id.value = true;
            await initializeValue();
          }
        }
      }
    );
    watch(
      () => props.suggestions,
      v2 => (result.value = v2)
    );
    watch(
      () => props.addResult,
      async v2 => {
        if (v2 && v2.value) {
          result.value.push(v2.value);
          current.value = v2.value;
          selected.value = v2.value;
          suggestionClick(current.value);
          setTimeout(() => {
            search.value = props.json ? v2.value[props.labelKey] : v2.value;
            emit('update:modelValue', v2.value);
          }, 100);
        }
      }
    );
    watch(search, s2 => {
      if (props.searchable) {
        open.value = true;
        if (Array.isArray(props.suggestions)) {
          if (props.multiple && Array.isArray(props.suggestions)) {
            result.value = props.suggestions;
          } else {
            result.value = s2 ? props.suggestions.filter(r2 => cLabel(r2, s2)) : props.suggestions;
          }
        } else if (s2) {
          loading.value = true;
          getSuggestions(s2);
        }
      }
    });
    const currentLabel = computed(() => cLabel(selected.value));
    const currentValue = computed(() => cValue(selected.value));
    useClickOutside(componentRef, () => hide(), excludeRef);
    onBeforeUnmount(() => {
      if (props.multiple) {
        window.removeEventListener('click', clickListener);
      }
    });
    onMounted(async () => {
      if (props.multiple) {
        window.addEventListener('click', clickListener);
      }
      await initializeValue();
    });
    const initializeValue = async () => {
      if (Array.isArray(props.suggestions)) {
        result.value = props.suggestions;
      }
      if (props.modelValue) {
        multi_current.value = [];
        if (Array.isArray(props.suggestions)) {
          if (props.multiple) {
            if (props.selectedValues) {
              multi_selected.value = props.selectedValues;
              search.value = props.selectedValues.join(', ');
            } else {
              multi_selected.value = props.suggestions.filter(
                s2 =>
                  s2 == props.modelValue ||
                  s2[props.valueKey] == props.modelValue ||
                  props.modelValue.filter(m2 => m2 == s2[props.valueKey])[0] ||
                  props.modelValue.filter(m2 => m2[props.valueKey] == s2[props.valueKey])[0] ||
                  s2.id == props.modelValue
              );
            }
            if (props.json) {
              props.suggestions.map((s2, si) => {
                if (multi_selected.value.find(v2 => v2[props.valueKey] == s2[props.valueKey])) {
                  multi_current.value = [...multi_current.value, si];
                }
              });
            } else {
              props.suggestions.map((s2, si) => {
                if (multi_selected.value.includes(s2)) {
                  multi_current.value = [...multi_current.value, si];
                }
              });
            }
            search.value = multi_selected.value.map(v2 => (props.json ? v2[props.labelKey] : v2)).join(', ');
          } else {
            if (props.json) {
              selected.value = props.suggestions.find(
                s2 =>
                  s2 == props.modelValue ||
                  s2[props.valueKey] == props.modelValue ||
                  s2.value == props.modelValue ||
                  s2.id == props.modelValue
              );
              current.value = props.suggestions.findIndex(
                s2 =>
                  s2 == props.modelValue ||
                  s2[props.valueKey] == props.modelValue ||
                  s2.value == props.modelValue ||
                  s2.id == props.modelValue
              );
              search.value = currentLabel.value;
            } else {
              selected.value = props.modelValue;
            }
          }
          await nextTick();
          await hide(null, true);
        } else {
          if (!stop.value) {
            axios$1
              .post(props.suggestions, { id: props.modelValue })
              .then(res => {
                if (props.multiple) {
                  current.value = 0;
                  result.value = res.data;
                  res.data.map(async (s2, si) => await suggestionClick(si));
                  hide(null, true);
                } else {
                  current.value = 0;
                  result.value = res.data;
                  selected.value = res.data[0];
                  search.value = cLabel(selected.value);
                }
              })
              .finally(async () => {
                await hide();
                loading.value = false;
              });
          }
        }
      }
    };
    const clickListener = e2 => {
      if (e2.target == auto_complete.value || e2.composedPath().includes(auto_complete.value)) {
        return false;
      }
      hide(e2, true);
    };
    const getSuggestions = debounce(s2 => {
      let nr = result.value;
      (nr == null ? void 0 : nr.length) ? nr[0] : {};
      if (!stop.value && s2 && s2 !== currentLabel.value) {
        search0.value = s2;
        axios$1
          .post(props.suggestions, { search: s2 })
          .then(res => {
            result.value = res.data;
            if (result.value.length == 1) {
              suggestionClick(0);
            }
          })
          .finally(() => (loading.value = false));
      } else {
        loading.value = false;
      }
      stop.value = false;
    }, 300);
    const cLabel = (r2, s2) => {
      if (r2 === null) {
        return null;
      } else if (typeof r2 !== 'object') {
        return r2;
      }
      let key = '';
      if (props.labelKey) {
        key = props.labelKey;
      } else if (r2.label !== void 0) {
        key = 'label';
      } else if (r2.name !== void 0) {
        key = 'name';
      }
      if (s2) {
        return key ? r2[key].toLowerCase().includes(s2.toString().toLowerCase()) : r2.toLowerCase().includes(s2.toLowerCase());
      }
      return key ? r2[key] : r2;
    };
    const cValue = r2 => {
      if (r2 === null) {
        return null;
      } else if (typeof r2 !== 'object') {
        return r2;
      }
      let key = '';
      if (props.valueKey) {
        key = props.valueKey;
      } else if (r2.value !== void 0) {
        key = 'value';
      } else if (r2.id !== void 0) {
        key = 'id';
      }
      return key ? r2[key] : r2;
    };
    const hide = async (e2, force, wait = false) => {
      if (wait) {
        setTimeout(hide, 200);
        return false;
      }
      if (!props.multiple || force) {
        if (selected.value) {
          search.value = currentLabel.value;
        }
        await nextTick();
        setTimeout(() => (open.value = false), 10);
      } else {
        if (multi_selected.value && multi_selected.value.length) {
          search.value = multi_selected.value.map(v2 => (props.json ? v2[props.labelKey] : v2)).join(', ');
          search.value = search.value || currentLabel.value;
        }
      }
    };
    const isActive = index => {
      if (props.multiple) {
        return multi_current.value.includes(index);
      }
      return index == current.value;
    };
    const suggestionClick = async (index, reset2 = false) => {
      stop.value = true;
      if (index !== void 0) {
        if (props.multiple) {
          if (props.json && multi_selected.value.find(v2 => v2[props.valueKey] == result.value[index][props.valueKey])) {
            multi_selected.value = multi_selected.value.filter(v2 => v2[props.valueKey] != result.value[index][props.valueKey]);
          } else {
            if (multi_selected.value.find(v2 => v2 == result.value[index][props.valueKey])) {
              multi_selected.value = multi_selected.value.filter(v2 => v2 != result.value[index][props.valueKey]);
            } else {
              multi_selected.value = [...multi_selected.value, result.value[index]];
            }
          }
          multi_current.value = [];
          if (props.multiple) {
            result.value.map((s2, si) => {
              if (props.json && multi_selected.value.find(v2 => v2[props.valueKey] == s2[props.valueKey])) {
                multi_current.value = [...multi_current.value, si];
              } else if (multi_selected.value.includes(s2)) {
                multi_current.value = [...multi_current.value, si];
              }
            });
          } else {
            props.suggestions.map((s2, si) => {
              if (props.json && multi_selected.value.find(v2 => v2[props.valueKey] == s2[props.valueKey])) {
                multi_current.value = [...multi_current.value, si];
              } else if (multi_selected.value.includes(s2)) {
                multi_current.value = [...multi_current.value, si];
              }
            });
          }
          emit('update:modelValue', props.json ? multi_selected.value.map(v2 => v2[props.valueKey]) : multi_selected.value);
          emit('change', multi_selected.value);
          search.value = multi_selected.value.map(v2 => (props.json ? v2[props.labelKey] : v2)).join(', ');
          search.value = search.value || currentLabel.value;
        } else {
          current.value = index;
          selected.value = result.value[index];
          emit('update:modelValue', props.json ? currentValue.value : selected.value);
          emit('change', selected.value);
          search.value = props.resetSearch ? null : currentLabel.value;
          await hide();
        }
      }
      if (reset2) {
        result.value = [];
      }
      if (props.resetSearch) {
        selected.value = null;
      }
      if (props.keepFocus) {
        input.value.focus();
      }
    };
    const reset = async () => {
      search.value = '';
      current.value = 0;
      selected.value = null;
      multi_current.value = [];
      multi_selected.value = [];
      emit('change', '');
      emit('update:modelValue', '');
      await hide();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = resolveComponent('Icon');
      _push(
        `<div${ssrRenderAttrs(
          mergeProps(
            {
              ref_key: 'excludeRef',
              ref: excludeRef,
              class: 'col-span-6 sm:col-span-3 xl:col-span-4',
            },
            _attrs
          )
        )}><div class="flex items-center justify-between">`
      );
      if (__props.label) {
        _push(
          ssrRenderComponent(
            unref(_sfc_main$s),
            {
              for: __props.id,
              value: __props.label,
              class: 'inline-block',
            },
            null,
            _parent
          )
        );
      } else {
        _push(`<!---->`);
      }
      if (__props.actionText && __props.action) {
        _push(`<button type="button" class="link text-sm focus:ring-0">${ssrInterpolate(__props.actionText)}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div><div class="relative flex items-center"><label${ssrRenderAttr(
          'for',
          __props.id
        )} class="inline-block cursor-pointer absolute top-2 right-0 border border-transparent p-2 text-gray-500 dark:text-gray-400">`
      );
      if (!__props.hideIcon) {
        _push(
          ssrRenderComponent(
            _component_Icon,
            {
              name: 'c-down',
              size: 'size-4',
            },
            null,
            _parent
          )
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</label>`);
      if (__props.clearable && __props.modelValue) {
        _push(
          `<button type="button" tabindex="-1" class="cursor-pointer focus:outline-hidden absolute top-2 right-6 border border-transparent p-2 text-gray-500 hover:text-red-500">`
        );
        _push(
          ssrRenderComponent(
            _component_Icon,
            {
              name: 'x',
              size: 'size-4',
            },
            null,
            _parent
          )
        );
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        `<input${ssrRenderAttr('id', __props.id)}${ssrRenderAttr('value', search.value)} autocomplete="none"${
          ssrIncludeBooleanAttr(!__props.searchable || __props.disabled) ? ' readonly' : ''
        }${ssrRenderAttr('placeholder', __props.placeholder || __props.label)} class="${ssrRenderClass([
          [
            __props.clearable ? 'pr-16' : 'pr-8',
            __props.inputClass || 'mt-1 border focus rounded-md shadow-xs',
            __props.size == 'small' ? 'py-1.5 pl-2 text-sm' : 'py-2 pl-4 text-base',
            __props.error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700',
            __props.disabled
              ? 'opacity-60 focus:border-gray-200 dark:focus:border-gray-700 focus:ring-0 dark:focus:ring-0'
              : 'focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600',
          ],
          'block w-full dark:bg-gray-900 dark:text-gray-300',
        ])}"><div style="${ssrRenderStyle(open.value ? null : { display: 'none' })}" class="${ssrRenderClass([
          __props.placement == 'top' ? 'mb-1 bottom-full ' + __props.position : 'mt-1 top-full ' + __props.position,
          'absolute w-full rounded-md z-20',
        ])}"><ul${ssrRenderAttr(
          'id',
          'ac-' + __props.id
        )} class="max-h-56 rounded-md bg-white dark:bg-gray-700 border text-base overflow-auto focus:outline-hidden border-primary-300 dark:border-primary-500 ring-2 ring-primary-200/50 dark:ring-primary-400/50 sm:text-sm">`
      );
      if (result.value && result.value.length) {
        _push(`<!--[-->`);
        ssrRenderList(result.value, (r2, ri) => {
          _push(`<!--[-->`);
          if (!(__props.disable && __props.disable == cValue())) {
            _push(
              `<li${ssrRenderAttr('id', 's' + ri)}><button type="button"${ssrRenderAttr(
                'id',
                __props.id + '-' + ri
              )} class="${ssrRenderClass([
                isActive(ri) ? 'bg-primary-500 text-white ' : 'text-focus',
                'w-full text-left flex items-center select-none relative py-2 hover:bg-primary-200 hover:text-primary-800 dark:hover:bg-primary-700 dark:hover:text-primary-100 focus:outline-hidden focus:ring-0 focus:rounded-none',
              ])}"><span class="ml-3 block font-normal truncate">${ssrInterpolate(cLabel(r2))}</span></button></li>`
            );
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]-->`);
      } else {
        _push(
          `<li class="bg-primary-600 text-white cursor-default select-none relative py-2"><div class="flex items-center"><span class="ml-3 block font-normal truncate">`
        );
        if (loading.value) {
          _push(`<span>${ssrInterpolate(_ctx.$t('Searching for results'))}...</span>`);
        } else if (result.value == null) {
          _push(`<span>${ssrInterpolate(_ctx.$t('Scan barcode or search items for next'))}</span>`);
        } else if (__props.json) {
          _push(`<span>${ssrInterpolate(__props.defaultText || _ctx.$t('Please type to search'))}</span>`);
        } else {
          _push(`<span>${ssrInterpolate(_ctx.$t('No suggestions to list.'))}</span>`);
        }
        _push(`</span></div></li>`);
      }
      _push(`</ul></div></div>`);
      if (__props.error) {
        _push(
          ssrRenderComponent(
            unref(_sfc_main$B),
            {
              message: __props.error.replace(' id', ''),
              class: 'mt-0',
            },
            null,
            _parent
          )
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  },
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/AutoComplete.vue');
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = {
  __name: 'CustomFields',
  __ssrInlineRender: true,
  props: {
    errors: { type: Object, default: {} },
    custom_fields: { type: Array, default: [] },
    extra_attributes: { type: Object, default: {} },
  },
  emits: ['update'],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const props = __props;
    function isChecked(field, opt) {
      return props.extra_attributes[field] && props.extra_attributes[field].includes(opt);
    }
    function updateValue(field, e2, opt) {
      if (!props.extra_attributes[field]) {
        props.extra_attributes[field] = [];
      }
      if (e2.target.checked) {
        props.extra_attributes[field] = [...props.extra_attributes[field], opt];
      } else {
        props.extra_attributes[field] = props.extra_attributes[field].filter(v2 => v2 != opt);
      }
      emits('update', e2);
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.custom_fields && __props.custom_fields.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: 'col-span-full grid grid-cols-6 gap-6' }, _attrs))}><!--[-->`);
        ssrRenderList(__props.custom_fields, (field, fi) => {
          _push(`<!--[-->`);
          if (field.type == 'text' || field.type == 'number') {
            _push(`<div class="col-span-6 sm:col-span-3">`);
            _push(
              ssrRenderComponent(
                unref(_sfc_main$p),
                {
                  type: field.type,
                  label: _ctx.$t(field.name),
                  onChange: e2 => emits('update', e2),
                  modelValue: __props.extra_attributes[field.name],
                  'onUpdate:modelValue': $event => (__props.extra_attributes[field.name] = $event),
                  error: __props.errors['extra_attributes.' + field.name],
                },
                null,
                _parent
              )
            );
            _push(`</div>`);
          } else if (field.type == 'select') {
            _push(`<div class="col-span-6 sm:col-span-3">`);
            _push(
              ssrRenderComponent(
                unref(_sfc_main$8),
                {
                  label: _ctx.$t(field.name),
                  suggestions: field.options,
                  onChange: e2 => emits('update', e2),
                  modelValue: __props.extra_attributes[field.name],
                  'onUpdate:modelValue': $event => (__props.extra_attributes[field.name] = $event),
                  error: __props.errors['extra_attributes.' + field.name] || null,
                },
                null,
                _parent
              )
            );
            _push(`</div>`);
          } else if (field.type == 'date') {
            _push(`<div class="col-span-6 sm:col-span-3">`);
            _push(
              ssrRenderComponent(
                unref(_sfc_main$p),
                {
                  type: 'date',
                  label: _ctx.$t(field.name),
                  onChange: e2 => emits('update', e2),
                  modelValue: __props.extra_attributes[field.name],
                  'onUpdate:modelValue': $event => (__props.extra_attributes[field.name] = $event),
                  error: __props.errors['extra_attributes.' + field.name] || null,
                },
                null,
                _parent
              )
            );
            _push(`</div>`);
          } else if (field.type == 'time') {
            _push(`<div class="col-span-6 sm:col-span-3">`);
            _push(
              ssrRenderComponent(
                unref(_sfc_main$p),
                {
                  type: 'time',
                  label: _ctx.$t(field.name),
                  onChange: e2 => emits('update', e2),
                  modelValue: __props.extra_attributes[field.name],
                  'onUpdate:modelValue': $event => (__props.extra_attributes[field.name] = $event),
                  error: __props.errors['extra_attributes.' + field.name] || null,
                },
                null,
                _parent
              )
            );
            _push(`</div>`);
          } else if (field.type == 'checkbox') {
            _push(`<div class="col-span-full">`);
            _push(
              ssrRenderComponent(
                unref(_sfc_main$s),
                {
                  value: _ctx.$t(field.name),
                },
                null,
                _parent
              )
            );
            _push(`<div class="my-2 flex flex-wrap items-center gap-x-12 gap-y-3"><!--[-->`);
            ssrRenderList(field.options, (opt, index) => {
              _push(
                ssrRenderComponent(
                  unref(_sfc_main$s),
                  {
                    class: 'flex items-center',
                    key: fi + '_ex_cb_' + index,
                    'for-id': fi + '_ex_cb_' + index,
                  },
                  {
                    default: withCtx((_, _push2, _parent2, _scopeId) => {
                      if (_push2) {
                        _push2(
                          `<input${ssrRenderAttr('value', opt)} type="checkbox"${ssrRenderAttr('name', field.name + '[]')}${ssrRenderAttr(
                            'id',
                            fi + '_ex_cb_' + index
                          )}${
                            ssrIncludeBooleanAttr(isChecked(field.name, opt)) ? ' checked' : ''
                          } class="rounded-sm dark:bg-gray-900 w-5 h-5 border border-gray-300 dark:border-gray-700 text-primary-600 shadow-xs"${_scopeId}><span class="ml-2 cursor-default"${_scopeId}>${
                            opt ?? ''
                          }</span>`
                        );
                      } else {
                        return [
                          createVNode(
                            'input',
                            {
                              value: opt,
                              type: 'checkbox',
                              name: field.name + '[]',
                              id: fi + '_ex_cb_' + index,
                              checked: isChecked(field.name, opt),
                              onChange: e2 => updateValue(field.name, e2, opt),
                              class:
                                'rounded-sm dark:bg-gray-900 w-5 h-5 border border-gray-300 dark:border-gray-700 text-primary-600 shadow-xs',
                            },
                            null,
                            40,
                            ['value', 'name', 'id', 'checked', 'onChange']
                          ),
                          createVNode(
                            'span',
                            {
                              innerHTML: opt,
                              class: 'ml-2 cursor-default',
                            },
                            null,
                            8,
                            ['innerHTML']
                          ),
                        ];
                      }
                    }),
                    _: 2,
                  },
                  _parent
                )
              );
            });
            _push(`<!--]--></div>`);
            if (__props.errors['extra_attributes.' + field.name] || null) {
              _push(
                ssrRenderComponent(
                  unref(_sfc_main$B),
                  {
                    message: __props.errors['extra_attributes.' + field.name] || null,
                  },
                  null,
                  _parent
                )
              );
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else if (field.type == 'radio') {
            _push(`<div class="col-span-full">`);
            _push(
              ssrRenderComponent(
                unref(_sfc_main$s),
                {
                  value: _ctx.$t(field.name),
                },
                null,
                _parent
              )
            );
            _push(`<div class="my-2 flex flex-wrap items-center gap-x-12 gap-y-3"><!--[-->`);
            ssrRenderList(field.options, (opt, index) => {
              _push(
                ssrRenderComponent(
                  unref(_sfc_main$s),
                  {
                    class: 'flex items-center',
                    key: fi + '_ex_radio_' + index,
                    'for-id': fi + '_ex_radio_' + index,
                  },
                  {
                    default: withCtx((_, _push2, _parent2, _scopeId) => {
                      if (_push2) {
                        _push2(
                          `<input type="radio"${ssrRenderAttr('value', opt)}${ssrRenderAttr('name', field.name)}${ssrRenderAttr(
                            'id',
                            fi + '_ex_radio_' + index
                          )}${ssrIncludeBooleanAttr(ssrLooseEqual(__props.extra_attributes[field.name], opt)) ? ' checked' : ''}${
                            ssrIncludeBooleanAttr(__props.extra_attributes[field.name] == opt) ? ' checked' : ''
                          } class="rounded-full dark:bg-gray-900 w-5 h-5 border border-gray-300 dark:border-gray-700 text-primary-600 shadow-xs"${_scopeId}><span class="ml-2 cursor-default"${_scopeId}>${
                            opt ?? ''
                          }</span>`
                        );
                      } else {
                        return [
                          withDirectives(
                            createVNode(
                              'input',
                              {
                                type: 'radio',
                                value: opt,
                                name: field.name,
                                id: fi + '_ex_radio_' + index,
                                onChange: e2 => emits('update', e2),
                                'onUpdate:modelValue': $event => (__props.extra_attributes[field.name] = $event),
                                checked: __props.extra_attributes[field.name] == opt,
                                class:
                                  'rounded-full dark:bg-gray-900 w-5 h-5 border border-gray-300 dark:border-gray-700 text-primary-600 shadow-xs',
                              },
                              null,
                              40,
                              ['value', 'name', 'id', 'onChange', 'onUpdate:modelValue', 'checked']
                            ),
                            [[vModelRadio, __props.extra_attributes[field.name]]]
                          ),
                          createVNode(
                            'span',
                            {
                              innerHTML: opt,
                              class: 'ml-2 cursor-default',
                            },
                            null,
                            8,
                            ['innerHTML']
                          ),
                        ];
                      }
                    }),
                    _: 2,
                  },
                  _parent
                )
              );
            });
            _push(`<!--]--></div>`);
            if (__props.errors['extra_attributes.' + field.name] || null) {
              _push(
                ssrRenderComponent(
                  unref(_sfc_main$B),
                  {
                    message: __props.errors['extra_attributes.' + field.name] || null,
                  },
                  null,
                  _parent
                )
              );
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else if (field.type == 'textarea') {
            _push(`<div class="col-span-full">`);
            _push(
              ssrRenderComponent(
                unref(_sfc_main$g),
                {
                  label: _ctx.$t(field.name),
                  onChange: e2 => emits('update', e2),
                  modelValue: __props.extra_attributes[field.name],
                  'onUpdate:modelValue': $event => (__props.extra_attributes[field.name] = $event),
                  error: __props.errors['extra_attributes.' + field.name] || null,
                },
                null,
                _parent
              )
            );
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  },
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/CustomFields.vue');
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {
  __name: 'SelectVariant',
  __ssrInlineRender: true,
  props: ['item', 'round'],
  emits: ['close', 'update'],
  setup(__props, { emit: __emit }) {
    const page = usePage();
    const props = __props;
    const emit = __emit;
    const meta = ref({});
    const show = ref(true);
    const code = ref(null);
    const selected = ref(null);
    watch(code, s2 => {
      var _a, _b;
      selected.value =
        (_b = (_a = props.item) == null ? void 0 : _a.product) == null
          ? void 0
          : _b.variations.find(v2 => v2.code.toLowerCase() == s2.toLowerCase());
      update();
    });
    watch(
      meta,
      s2 => {
        var _a, _b;
        selected.value =
          (_b = (_a = props.item) == null ? void 0 : _a.product) == null ? void 0 : _b.variations.find(v2 => isequal(v2.meta, s2));
        update();
      },
      { deep: true }
    );
    onMounted(async () => {
      var _a;
      await nextTick();
      (_a = document.getElementById('variation-code')) == null ? void 0 : _a.focus();
    });
    function update() {
      if (selected.value) {
        let variation2 = props.item.variations.find(v2 => v2.id == selected.value.id);
        if (variation2) {
          props.item.variations = props.item.variations.map(v2 => (v2.id == variation2.id ? { ...v2, quantity: v2.quantity + 1 } : v2));
          selected.value = variation2;
        } else {
          props.item.variations = props.item.variations.map(v2 =>
            v2.id
              ? v2
              : {
                  ...selected.value,
                  quantity: 1,
                  taxes: props.item.taxes,
                  unit_id: props.item.unit_id,
                  tax_included: props.item.tax_included == 1,
                  cost: selected.value.cost || props.item.cost,
                  price: selected.value.price || props.item.price,
                }
          );
        }
        props.item.variations = props.item.variations.filter(v2 => v2.id);
        props.item.quantity = props.item.variations.reduce((a2, v2) => Number(v2.quantity) + a2, 0);
        meta.value = {};
        code.value = null;
        selected.value = null;
        emit('update', props.item);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = resolveComponent('Icon');
      _push(
        ssrRenderComponent(
          unref(_sfc_main$E),
          mergeProps(
            {
              show: show.value,
              'max-width': 'md',
              onClose: $event => _ctx.$emit('close'),
              overflow: true,
              round: __props.round,
            },
            _attrs
          ),
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b;
              if (_push2) {
                _push2(
                  `<div class="p-6"${_scopeId}><div class="flex items-center justify-start gap-4"${_scopeId}><div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-100"${_scopeId}>`
                );
                _push2(
                  ssrRenderComponent(
                    _component_Icon,
                    {
                      name: 'bolt',
                      size: 'size-5 text-primary-600',
                    },
                    null,
                    _parent2,
                    _scopeId
                  )
                );
                _push2(
                  `</div><div class="flex-1 grow"${_scopeId}><h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"${_scopeId}>${ssrInterpolate(
                    _ctx.$t('Select {x}', { x: _ctx.$t('Variant') })
                  )}</h3><p class="text-sm"${_scopeId}>${ssrInterpolate(
                    _ctx.$t('Please select the variant to add item to order list.')
                  )}</p></div></div><div class="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6"${_scopeId}><div class="col-span-full"${_scopeId}>`
                );
                _push2(
                  ssrRenderComponent(
                    unref(_sfc_main$p),
                    {
                      label: '',
                      modelValue: code.value,
                      'onUpdate:modelValue': $event => (code.value = $event),
                      id: 'variation-code',
                      placeholder: _ctx.$t('Scan barcode or type the variation code'),
                    },
                    null,
                    _parent2,
                    _scopeId
                  )
                );
                _push2(`</div><!--[-->`);
                ssrRenderList(__props.item.product.variants, (variant, vi) => {
                  _push2(`<div${_scopeId}>`);
                  _push2(
                    ssrRenderComponent(
                      unref(_sfc_main$8),
                      {
                        id: 'type',
                        json: true,
                        label: _ctx.$t(variant.name),
                        suggestions: variant.options,
                        modelValue: meta.value[variant.name],
                        'onUpdate:modelValue': $event => (meta.value[variant.name] = $event),
                      },
                      null,
                      _parent2,
                      _scopeId
                    )
                  );
                  _push2(`</div>`);
                });
                _push2(`<!--]-->`);
                if (selected.value) {
                  _push2(
                    `<div class="col-span-full border border-gray-200 dark:border-gray-700 rounded-lg"${_scopeId}><dl class="divide-y divide-gray-200 dark:divide-gray-700"${_scopeId}><div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4"${_scopeId}><dt class="text-sm/6 font-medium text-gray-900"${_scopeId}>${ssrInterpolate(
                      _ctx.$t('Code')
                    )}</dt><dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0"${_scopeId}>${ssrInterpolate(
                      selected.value.code
                    )}</dd></div><div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4"${_scopeId}><dt class="text-sm/6 font-medium text-gray-900"${_scopeId}>${ssrInterpolate(
                      _ctx.$t('Quantity')
                    )}</dt><dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0"${_scopeId}>${ssrInterpolate(
                      _ctx.$number(
                        (_a = selected.value.stocks.find(s2 => s2.store_id == unref(page).props.selected_store)) == null
                          ? void 0
                          : _a.balance
                      )
                    )}</dd></div><div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4"${_scopeId}><dt class="text-sm/6 font-medium text-gray-900"${_scopeId}>${ssrInterpolate(
                      _ctx.$t('Cost')
                    )}</dt><dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0"${_scopeId}>${ssrInterpolate(
                      selected.value.cost ? _ctx.$number(selected.value.cost) : ''
                    )}</dd></div><div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4"${_scopeId}><dt class="text-sm/6 font-medium text-gray-900"${_scopeId}>${ssrInterpolate(
                      _ctx.$t('Price')
                    )}</dt><dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0"${_scopeId}>${ssrInterpolate(
                      selected.value.price ? _ctx.$number(selected.value.price) : ''
                    )}</dd></div><div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4"${_scopeId}><dt class="text-sm/6 font-medium text-gray-900"${_scopeId}>${ssrInterpolate(
                      _ctx.$t('Weight')
                    )}</dt><dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0"${_scopeId}>${ssrInterpolate(
                      selected.value.weight ? _ctx.$number(selected.value.weight) : ''
                    )}</dd></div><div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4"${_scopeId}><dt class="text-sm/6 font-medium text-gray-900"${_scopeId}>${ssrInterpolate(
                      _ctx.$t('Dimensions')
                    )}</dt><dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0"${_scopeId}>${ssrInterpolate(
                      selected.value.dimensions
                    )}</dd></div></dl></div>`
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode('div', { class: 'p-6' }, [
                    createVNode('div', { class: 'flex items-center justify-start gap-4' }, [
                      createVNode('div', { class: 'mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-100' }, [
                        createVNode(_component_Icon, {
                          name: 'bolt',
                          size: 'size-5 text-primary-600',
                        }),
                      ]),
                      createVNode('div', { class: 'flex-1 grow' }, [
                        createVNode(
                          'h3',
                          { class: 'text-base font-semibold leading-6 text-gray-900 dark:text-gray-100' },
                          toDisplayString(_ctx.$t('Select {x}', { x: _ctx.$t('Variant') })),
                          1
                        ),
                        createVNode(
                          'p',
                          { class: 'text-sm' },
                          toDisplayString(_ctx.$t('Please select the variant to add item to order list.')),
                          1
                        ),
                      ]),
                    ]),
                    createVNode('div', { class: 'mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6' }, [
                      createVNode('div', { class: 'col-span-full' }, [
                        createVNode(
                          unref(_sfc_main$p),
                          {
                            label: '',
                            modelValue: code.value,
                            'onUpdate:modelValue': $event => (code.value = $event),
                            id: 'variation-code',
                            placeholder: _ctx.$t('Scan barcode or type the variation code'),
                          },
                          null,
                          8,
                          ['modelValue', 'onUpdate:modelValue', 'placeholder']
                        ),
                      ]),
                      (openBlock(true),
                      createBlock(
                        Fragment,
                        null,
                        renderList(__props.item.product.variants, (variant, vi) => {
                          return (
                            openBlock(),
                            createBlock('div', { key: vi }, [
                              createVNode(
                                unref(_sfc_main$8),
                                {
                                  id: 'type',
                                  json: true,
                                  label: _ctx.$t(variant.name),
                                  suggestions: variant.options,
                                  modelValue: meta.value[variant.name],
                                  'onUpdate:modelValue': $event => (meta.value[variant.name] = $event),
                                },
                                null,
                                8,
                                ['label', 'suggestions', 'modelValue', 'onUpdate:modelValue']
                              ),
                            ])
                          );
                        }),
                        128
                      )),
                      selected.value
                        ? (openBlock(),
                          createBlock(
                            'div',
                            {
                              key: 0,
                              class: 'col-span-full border border-gray-200 dark:border-gray-700 rounded-lg',
                            },
                            [
                              createVNode('dl', { class: 'divide-y divide-gray-200 dark:divide-gray-700' }, [
                                createVNode('div', { class: 'px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4' }, [
                                  createVNode('dt', { class: 'text-sm/6 font-medium text-gray-900' }, toDisplayString(_ctx.$t('Code')), 1),
                                  createVNode(
                                    'dd',
                                    { class: 'mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0' },
                                    toDisplayString(selected.value.code),
                                    1
                                  ),
                                ]),
                                createVNode('div', { class: 'px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4' }, [
                                  createVNode(
                                    'dt',
                                    { class: 'text-sm/6 font-medium text-gray-900' },
                                    toDisplayString(_ctx.$t('Quantity')),
                                    1
                                  ),
                                  createVNode(
                                    'dd',
                                    { class: 'mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0' },
                                    toDisplayString(
                                      _ctx.$number(
                                        (_b = selected.value.stocks.find(s2 => s2.store_id == unref(page).props.selected_store)) == null
                                          ? void 0
                                          : _b.balance
                                      )
                                    ),
                                    1
                                  ),
                                ]),
                                createVNode('div', { class: 'px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4' }, [
                                  createVNode('dt', { class: 'text-sm/6 font-medium text-gray-900' }, toDisplayString(_ctx.$t('Cost')), 1),
                                  createVNode(
                                    'dd',
                                    { class: 'mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0' },
                                    toDisplayString(selected.value.cost ? _ctx.$number(selected.value.cost) : ''),
                                    1
                                  ),
                                ]),
                                createVNode('div', { class: 'px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4' }, [
                                  createVNode('dt', { class: 'text-sm/6 font-medium text-gray-900' }, toDisplayString(_ctx.$t('Price')), 1),
                                  createVNode(
                                    'dd',
                                    { class: 'mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0' },
                                    toDisplayString(selected.value.price ? _ctx.$number(selected.value.price) : ''),
                                    1
                                  ),
                                ]),
                                createVNode('div', { class: 'px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4' }, [
                                  createVNode(
                                    'dt',
                                    { class: 'text-sm/6 font-medium text-gray-900' },
                                    toDisplayString(_ctx.$t('Weight')),
                                    1
                                  ),
                                  createVNode(
                                    'dd',
                                    { class: 'mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0' },
                                    toDisplayString(selected.value.weight ? _ctx.$number(selected.value.weight) : ''),
                                    1
                                  ),
                                ]),
                                createVNode('div', { class: 'px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4' }, [
                                  createVNode(
                                    'dt',
                                    { class: 'text-sm/6 font-medium text-gray-900' },
                                    toDisplayString(_ctx.$t('Dimensions')),
                                    1
                                  ),
                                  createVNode(
                                    'dd',
                                    { class: 'mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0' },
                                    toDisplayString(selected.value.dimensions),
                                    1
                                  ),
                                ]),
                              ]),
                            ]
                          ))
                        : createCommentVNode('', true),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent
        )
      );
    };
  },
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/SelectVariant.vue');
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: 'CopyTextButton',
  __ssrInlineRender: true,
  props: { text: { type: String } },
  setup(__props) {
    const copied = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = resolveComponent('Icon');
      _push(
        `<button${ssrRenderAttrs(
          mergeProps(
            {
              type: 'button',
              class: 'flex items-center relative',
            },
            _attrs
          )
        )}>`
      );
      ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      if (copied.value) {
        _push(
          ssrRenderComponent(
            _component_Icon,
            {
              name: 'copied-o',
              class: 'ml-1 w-5 h-full absolute left-full text-success-500',
            },
            null,
            _parent
          )
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
    };
  },
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/CopyTextButton.vue');
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: 'NumberInputRound',
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: [String, Number],
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    delOn: {
      type: Number,
    },
    id: {
      type: String,
      default() {
        return (Math.random() + '').replace('0.', '');
      },
    },
  },
  emits: ['change', 'remove', 'update:modelValue'],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const value = computed({
      get: () => props.modelValue,
      set: value2 => {
        emit('update:modelValue', value2);
        emit('change', value2);
      },
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'flex items-center max-w-[7rem]' }, _attrs))}>`);
      if (__props.delOn === 0 && __props.delOn == value.value) {
        _push(
          `<button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border rounded-full p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-hidden"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 -mx-1 -my-2 text-red-600"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path></svg></button>`
        );
      } else {
        _push(
          `<button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" class="flex-1 bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border rounded-full p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-hidden"><svg fill="none" aria-hidden="true" viewBox="0 0 18 2" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-gray-900 dark:text-white"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"></path></svg></button>`
        );
      }
      _push(
        `<input${ssrRenderAttr('id', __props.id)} type="text" placeholder="1"${ssrRenderAttr(
          'value',
          value.value
        )} class="border-0 h-8 text-center text-gray-900 text-sm block w-full py-2.5 dark:bg-gray-950 dark:placeholder-gray-400 dark:text-white"><button type="button" id="increment-button" data-input-counter-increment="quantity-input" class="bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border rounded-full p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-hidden"><svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"></path></svg></button></div>`
      );
    };
  },
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/NumberInputRound.vue');
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: 'ViewCustomFields',
  __ssrInlineRender: true,
  props: {
    title: String,
    modal: { type: Boolean, default: true },
    extra_attributes: { type: Object, default: {} },
  },
  setup(__props) {
    const show = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      if (Object.keys(__props.extra_attributes).length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: '' }, _attrs))}>`);
        if (__props.modal) {
          _push(
            `<!--[--><button type="button" class="px-2 py-0.5 rounded-md -my-1 border border-gray-200 dark:border-gray-700">${ssrInterpolate(
              _ctx.$t('View')
            )}</button>`
          );
          _push(
            ssrRenderComponent(
              unref(_sfc_main$E),
              {
                show: show.value,
                maxWidth: 'lg',
                closeable: true,
                onClose: () => (show.value = false),
              },
              {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(
                      `<div class="font-bold p-4 border-b border-gray-200 dark:border-gray-700"${_scopeId}>${ssrInterpolate(
                        _ctx.$t('Custom Fields')
                      )} ${ssrInterpolate(
                        __props.title ? ' (' + __props.title + ')' : ''
                      )}</div><div class="m-6 flow-root"${_scopeId}><div class="overflow-x-auto"${_scopeId}><div class="inline-block border border-gray-200 dark:border-gray-700 rounded-md min-w-full align-middle"${_scopeId}><table class="min-w-full"${_scopeId}><tbody class="divide-y divide-gray-200 dark:divide-gray-700"${_scopeId}><!--[-->`
                    );
                    ssrRenderList(Object.keys(__props.extra_attributes), key => {
                      _push2(
                        `<tr${_scopeId}><td class="pl-4 pr-3 py-2 text-sm text-right w-1/3"${_scopeId}>${ssrInterpolate(
                          key
                        )}</td><td class="pl-3 pr-4 py-2 text-sm font-bold"${_scopeId}>${ssrInterpolate(
                          Array.isArray(__props.extra_attributes[key])
                            ? __props.extra_attributes[key].join(', ')
                            : unref(isValidDate)(__props.extra_attributes[key])
                            ? unref($date$1)(__props.extra_attributes[key])
                            : __props.extra_attributes[key] || ''
                        )}</td></tr>`
                      );
                    });
                    _push2(`<!--]--></tbody></table></div></div></div>`);
                  } else {
                    return [
                      createVNode(
                        'div',
                        { class: 'font-bold p-4 border-b border-gray-200 dark:border-gray-700' },
                        toDisplayString(_ctx.$t('Custom Fields')) + ' ' + toDisplayString(__props.title ? ' (' + __props.title + ')' : ''),
                        1
                      ),
                      createVNode('div', { class: 'm-6 flow-root' }, [
                        createVNode('div', { class: 'overflow-x-auto' }, [
                          createVNode(
                            'div',
                            { class: 'inline-block border border-gray-200 dark:border-gray-700 rounded-md min-w-full align-middle' },
                            [
                              createVNode('table', { class: 'min-w-full' }, [
                                createVNode('tbody', { class: 'divide-y divide-gray-200 dark:divide-gray-700' }, [
                                  (openBlock(true),
                                  createBlock(
                                    Fragment,
                                    null,
                                    renderList(Object.keys(__props.extra_attributes), key => {
                                      return (
                                        openBlock(),
                                        createBlock('tr', { key }, [
                                          createVNode('td', { class: 'pl-4 pr-3 py-2 text-sm text-right w-1/3' }, toDisplayString(key), 1),
                                          createVNode(
                                            'td',
                                            { class: 'pl-3 pr-4 py-2 text-sm font-bold' },
                                            toDisplayString(
                                              Array.isArray(__props.extra_attributes[key])
                                                ? __props.extra_attributes[key].join(', ')
                                                : unref(isValidDate)(__props.extra_attributes[key])
                                                ? unref($date$1)(__props.extra_attributes[key])
                                                : __props.extra_attributes[key] || ''
                                            ),
                                            1
                                          ),
                                        ])
                                      );
                                    }),
                                    128
                                  )),
                                ]),
                              ]),
                            ]
                          ),
                        ]),
                      ]),
                    ];
                  }
                }),
                _: 1,
              },
              _parent
            )
          );
          _push(`<!--]-->`);
        } else {
          _push(`<div><!--[-->`);
          ssrRenderList(Object.keys(__props.extra_attributes), key => {
            _push(
              `<div><span class="text-mute">${ssrInterpolate(key)}</span> : ${ssrInterpolate(
                Array.isArray(__props.extra_attributes[key])
                  ? __props.extra_attributes[key].join(', ')
                  : unref(isValidDate)(__props.extra_attributes[key])
                  ? unref($date$1)(__props.extra_attributes[key])
                  : __props.extra_attributes[key] || ''
              )}</div>`
            );
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  },
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Common/ViewCustomFields.vue');
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const fetchClient = () => {
  const defaultOptions = {
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };
  let instance = axios$2.create(defaultOptions);
  instance.interceptors.request.use(function (config) {
    return config;
  });
  instance.interceptors.response.use(
    response => response,
    error => {
      var _a, _b, _c, _d;
      if ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.errors) {
        notify(
          {
            group: 'main',
            type: 'error',
            title: 'Error!',
            text: Object.values(error.response.data.errors).join('<br />'),
          },
          1e4
        );
      } else if ((_d = (_c = error.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) {
        notify(
          {
            group: 'main',
            type: 'error',
            title: 'Error!',
            text: error.response.data.message,
          },
          1e4
        );
      }
      if (error.response.status === 401) {
        router.visit('/login');
      }
      return Promise.reject(error);
    }
  );
  if (typeof window !== 'undefined') {
    window.axios = instance;
  }
  return instance;
};
const axios$1 = fetchClient();
const $capitalize = string => {
  const res = string.split(' ');
  for (let i2 = 0; i2 < res.length; i2++) {
    res[i2] = res[i2][0].toUpperCase() + res[i2].substr(1);
  }
  return res.join(' ');
};
const $address = row => {
  var _a, _b;
  if (!row) {
    return '';
  }
  return `${row.lot_no || ''} ${row.street || ''} ${row.address_line_1 || ''} ${row.address_line_2 || ''} ${row.city || ''} ${
    row.postal_code || ''
  } ${((_a = row.state) == null ? void 0 : _a.name) || ''} ${((_b = row.country) == null ? void 0 : _b.name) || ''}`;
};
const $decimal = (amount, format = false) => {
  var _a;
  amount = number_format(amount, ((_a = usePage().props.settings) == null ? void 0 : _a.fraction) || 0);
  if (format) {
    return Number(amount);
  }
  return amount;
};
const $decimal_qty = (amount, format = false) => {
  var _a;
  amount = number_format(amount, ((_a = usePage().props.settings) == null ? void 0 : _a.quantity_fraction) || 0);
  if (format) {
    return Number(amount);
  }
  return amount;
};
const $meta = meta => {
  meta = Object.keys(meta)
    .sort()
    .reduce((r2, k2) => ((r2[k2] = meta[k2]), r2), {});
  return Object.keys(meta)
    .map(key => key + ': ' + meta[key])
    .join(', ');
};
const $number = (amount, locale, options) => {
  if (!amount) {
    amount = 0;
  }
  let formatted = parseFloat(amount);
  if (!locale || (locale.length != 2 && locale.length != 5)) {
    locale = usePage().props.settings.default_locale;
  }
  if (!options) {
    options = {
      minimumFractionDigits: usePage().props.settings.fraction || 0,
      maximumFractionDigits: usePage().props.settings.fraction || 0,
    };
  }
  try {
    return new Intl.NumberFormat(locale, options).format(formatted);
  } catch (err) {
    return new Intl.NumberFormat('en-US', options).format(formatted);
  }
};
const $currency = (amount, locale, options) => {
  var _a;
  if (!amount) {
    amount = 0;
  }
  let formatted = parseFloat(amount);
  if (!locale || (locale.length != 2 && locale.length != 5)) {
    locale = usePage().props.settings.default_locale;
  }
  let currency_code = ((_a = usePage().props.settings.payment) == null ? void 0 : _a.default_currency) || 'USD';
  if ((options == null ? void 0 : options.currency) && options.currency.length != 3) {
    options.currency = currency_code;
  }
  if (!options) {
    options = {
      style: 'currency',
      //
      //   signDisplay: 'always',
      currency: currency_code,
      // currencySign: 'accounting', // standard, accounting
      currencyDisplay: 'narrowSymbol',
      // code, name, narrowSymbol, symbol (default)
      minimumFractionDigits: usePage().props.settings.fraction || 0,
      maximumFractionDigits: usePage().props.settings.fraction || 0,
    };
  }
  try {
    return new Intl.NumberFormat(locale, options).format(formatted);
  } catch (err) {
    return new Intl.NumberFormat('en-US', options).format(formatted);
  }
};
const $unit = (amount, locale, options) => {
  if (!amount) {
    amount = 0;
  }
  let formatted = parseFloat(amount);
  if (!locale || (locale.length != 2 && locale.length != 5)) {
    locale = usePage().props.settings.default_locale;
  }
  if (!options) {
    options = {
      style: 'unit',
      unitDisplay: 'narrow',
      // short, long, narrow (default)
      minimumFractionDigits: usePage().props.settings.quantity_fraction || 0,
      maximumFractionDigits: usePage().props.settings.quantity_fraction || 0,
      unit: (usePage().props.settings.weight_unit || 'kilogram').toLowerCase(),
    };
  }
  try {
    return new Intl.NumberFormat(locale, options).format(formatted);
  } catch (err) {
    return new Intl.NumberFormat('en-US', options).format(formatted);
  }
};
const $number_qty = (amount, unit2, locale, options) => {
  if (!options && unit2) {
    options = {
      style: 'unit',
      unitDisplay: 'narrow',
      minimumFractionDigits: usePage().props.settings.quantity_fraction || 0,
      maximumFractionDigits: usePage().props.settings.quantity_fraction || 0,
      unit: (unit2 || usePage().props.settings.weight_unit || 'kilogram').toLowerCase(),
    };
  } else if (!options) {
    options = {
      minimumFractionDigits: usePage().props.settings.quantity_fraction || 0,
      maximumFractionDigits: usePage().props.settings.quantity_fraction || 0,
    };
  }
  try {
    return $unit(amount, locale, options);
  } catch (err) {
    options = {
      minimumFractionDigits: usePage().props.settings.quantity_fraction || 0,
      maximumFractionDigits: usePage().props.settings.quantity_fraction || 0,
    };
    return $number(amount, locale, options);
  }
};
const $weight = (amount, locale, options) => {
  if (!options) {
    options = {
      style: 'unit',
      unitDisplay: 'narrow',
      minimumFractionDigits: usePage().props.settings.quantity_fraction || 0,
      maximumFractionDigits: usePage().props.settings.quantity_fraction || 0,
      unit: (usePage().props.settings.weight_unit || 'kilogram').toLowerCase(),
    };
  }
  return $unit(amount, locale, options);
};
const isValidDate = dateString => {
  if (!dateString) {
    return false;
  }
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false;
  var d2 = new Date(dateString);
  var dNum = d2.getTime();
  if (!dNum && dNum !== 0) return false;
  return d2.toISOString().slice(0, 10) === dateString;
};
const $date$1 = (date, locale, style, force = false) => {
  var _a;
  if (!date) {
    return '';
  }
  if (!force && ((_a = usePage().props.settings) == null ? void 0 : _a.date_format) == 'php') {
    return date.split('T')[0];
  }
  date = date.split(' ')[0];
  let formatted = new Date(Date.parse(date));
  try {
    let od = date.split('T')[0].split('-');
    formatted = new Date(od[0], od[1] - 1, od[2], 0, 0, 0, 0);
  } catch (err) {}
  if (!locale || (locale.length != 2 && locale.length != 5)) {
    locale = usePage().props.settings.default_locale;
  }
  try {
    return formatted.toLocaleString(locale, {
      dateStyle: style ? style : 'medium',
      //   timeZone: usePage().props.settings.timezone || 'UTC',
    });
  } catch (err) {
    return formatted.toLocaleString('en-US', {
      dateStyle: style ? style : 'medium',
      //   timeZone: usePage().props.settings.timezone || 'UTC',
    });
  }
};
const $datetime = (datetime, locale, style, force = false) => {
  var _a;
  if (!datetime) {
    return '';
  }
  if (!force && ((_a = usePage().props.settings) == null ? void 0 : _a.date_format) == 'php') {
    return datetime;
  }
  let formatted = new Date(Date.parse(datetime));
  try {
    if (datetime.includes('T')) {
      let od = datetime.split('T')[0].split('-');
      let ot = datetime.split('T')[1].split(':');
      formatted = new Date(Number(od[0]), Number(od[1]) - 1, Number(od[2]), Number(ot[0]), Number(ot[1]), 0, 0);
    } else if (datetime.includes(' ')) {
      let od = datetime.split(' ')[0].split('-');
      let ot = datetime.split(' ')[1].split(':');
      formatted = new Date(Number(od[0]), Number(od[1]) - 1, Number(od[2]), Number(ot[0]), Number(ot[1]), 0, 0);
    }
  } catch (err) {
    console.error('Failed to parse date time.');
  }
  if (!locale || (locale.length != 2 && locale.length != 5)) {
    locale = usePage().props.settings.default_locale;
  }
  try {
    return formatted.toLocaleString(locale, {
      timeStyle: 'short',
      dateStyle: style ? style : 'medium',
      hour12: true,
      // usePage().props.settings.hour12 == 1,
      // timeZone: usePage().props.settings.timezone || 'UTC',
    });
  } catch (err) {
    return formatted.toLocaleString('en-US', {
      timeStyle: 'short',
      dateStyle: style ? style : 'medium',
      hour12: true,
      // usePage().props.settings.hour12 == 1,
      //   timeZone: usePage().props.settings.timezone || 'UTC',
    });
  }
};
const $boolean = (v2, c2 = false) => {
  return v2
    ? `<div class="w-full h-full max-w-6 max-h-6 ${
        c2 ? 'flex items-center justify-center' : ''
      }"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full max-h-6 max-w-6 text-green-500">
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg></div>`
    : `<div class="w-full h-full max-w-6 max-h-6 ${
        c2 ? 'flex items-center justify-center' : ''
      }"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full max-h-6 max-w-6 text-red-500">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg></div>`;
};
const $extras = (fields, extra_attributes = {}) => {
  let extras = {};
  fields.map(f2 => {
    if (extra_attributes[f2.name]) {
      extras[f2.name] = extra_attributes[f2.name] ? extra_attributes[f2.name] : f2.type == 'checkbox' ? [] : '';
    } else {
      extras[f2.name] = f2.type == 'checkbox' ? [] : '';
    }
  });
  return extras;
};
const $can = permissions => {
  let user = usePage().props.is_impersonating ? usePage().props.user : usePage().props.auth.user;
  if (user && user.roles.find(r2 => r2.name == 'Super Admin')) {
    return true;
  }
  let allow = false;
  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }
  if (permissions && permissions.length > 0) {
    if (permissions.includes('all')) {
      allow = true;
    } else {
      permissions.map(p2 => {
        if (user && user.all_permissions && user.all_permissions.includes(p2)) {
          allow = true;
        }
      });
    }
  }
  return allow;
};
const $random = (min = 0, max = 999) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};
const calculate_item = (item2, calc_on = 'price') => {
  if (item2.variations && item2.variations.length) {
    item2.variations.map(v2 => {
      v2.discount_amount = calculate_discount(v2[calc_on], v2.discount || '');
      v2.total_discount_amount = $decimal(Number(v2.discount_amount) * Number(v2.quantity), true);
      v2 = calculate_taxes(usePage().props.taxes, v2, calc_on);
      v2.total = $decimal(v2['unit_' + calc_on] * $decimal_qty(v2.quantity, true), true);
      v2.subtotal = $decimal(v2['net_' + calc_on] * $decimal_qty(v2.quantity, true), true);
    });
    item2.total = item2.variations.reduce((a2, v2) => a2 + v2.total, 0);
    item2.subtotal = item2.variations.reduce((a2, v2) => a2 + v2.subtotal, 0);
    item2.tax_amount = item2.variations.reduce((a2, v2) => a2 + v2.tax_amount, 0);
    item2.discount_amount = item2.variations.reduce((a2, v2) => a2 + v2.discount_amount, 0);
    item2.total_discount_amount = item2.variations.reduce((a2, v2) => a2 + v2.total_discount_amount, 0);
    item2.total_tax_amount = item2.variations.reduce((a2, v2) => a2 + v2.total_tax_amount, 0);
  } else {
    item2.discount_amount = calculate_discount(item2[calc_on], item2.discount || '');
    item2.total_discount_amount = $decimal(Number(item2.discount_amount) * Number(item2.quantity), true);
    item2 = calculate_taxes(usePage().props.taxes, item2, calc_on);
    item2.subtotal = $decimal(
      // (item[calc_on] + (item.before_discount_tax_amount || item.tax_amount)) * $decimal_qty(item.quantity)
      item2['net_' + calc_on] * $decimal_qty(item2.quantity, true),
      true
    );
    item2.total = $decimal(item2['unit_' + calc_on] * $decimal_qty(item2.quantity, true), true);
  }
  return item2;
};
const calculate_discount = (price, discount) => {
  let discount_amount = 0;
  if (discount.indexOf('%') !== -1) {
    var pds = discount.split('%');
    if (!isNaN(pds[0])) {
      discount_amount = Number((price * Number(pds[0])) / 100);
    }
  } else {
    discount_amount = Number(discount);
  }
  return $decimal(discount_amount, true);
};
const calculate_inclusive_tax = (amount, tax2) => {
  tax2.amount = $decimal((Number(amount) * Number(tax2.rate)) / (100 + Number(tax2.rate)), true);
  return tax2;
};
const calculate_exclusive_tax = (amount, tax2) => {
  tax2.amount = $decimal((Number(amount) * Number(tax2.rate)) / 100, true);
  return tax2;
};
const calculate_taxes = (taxes, item2, calc_on = 'price') => {
  item2.tax_amount = 0;
  item2.before_discount_tax_amount = 0;
  item2[calc_on + '_before_discount'] = $decimal(item2[calc_on], true);
  item2.applied_taxes =
    taxes == null
      ? void 0
      : taxes
          .filter(t4 => {
            var _a;
            return (_a = item2.taxes) == null ? void 0 : _a.includes(t4.id);
          })
          .map(t4 => {
            let rt;
            if (item2.tax_included) {
              rt = calculate_inclusive_tax(item2[calc_on], t4);
              t4 = calculate_inclusive_tax(item2[calc_on] - $decimal(item2.discount_amount, true), t4);
            } else {
              rt = calculate_exclusive_tax(item2[calc_on], t4);
              t4 = calculate_exclusive_tax(item2[calc_on] - $decimal(item2.discount_amount, true), t4);
            }
            item2.tax_amount += t4.amount;
            item2.before_discount_tax_amount += rt.amount;
            return t4;
          });
  item2.total_tax_amount = $decimal(item2.tax_amount, true) * $decimal_qty(item2.quantity, true);
  item2['unit_' + calc_on] =
    $decimal(item2[calc_on], true) -
    $decimal(item2.discount_amount, true) +
    $decimal(item2.tax_included != 1 && item2.tax_amount ? item2.tax_amount : 0, true);
  item2['net_' + calc_on] =
    $decimal(item2[calc_on], true) -
    $decimal(item2.discount_amount, true) -
    $decimal(item2.tax_included == 1 && item2.tax_amount ? item2.tax_amount : 0, true);
  return item2;
};
const convert_to_base_unit = (item2, unit_id, value) => {
  var _a, _b;
  if (
    unit_id &&
    unit_id != item2.product.unit_id &&
    ((_b = (_a = item2.product.unit) == null ? void 0 : _a.subunits) == null ? void 0 : _b.length)
  ) {
    let res;
    let unit2 = item2.product.unit.subunits.find(u2 => u2.id == unit_id);
    switch (unit2.operator) {
      case '*':
        res = Number(value) * Number(unit2.operation_value);
        break;
      case '/':
        res = Number(value) / Number(unit2.operation_value);
        break;
      case '+':
        res = Number(value) + Number(unit2.operation_value);
        break;
      case '-':
        res = Number(value) - Number(unit2.operation_value);
        break;
      default:
        res = value;
    }
    return $decimal(res);
  }
  return $decimal(value);
};
const discount_keypress = async event => {
  if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 37);
  else {
    if (event.keyCode < 48 || event.keyCode > 57) {
      event.preventDefault();
    }
  }
};
const number_format = (number, decimals, decPoint = '.', thousandsSep = '') => {
  var _a;
  if (decimals === void 0) {
    decimals = ((_a = usePage().props.settings) == null ? void 0 : _a.fraction) || 0;
  }
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n2 = !isFinite(+number) ? 0 : +number;
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  var sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep;
  var dec = typeof decPoint === 'undefined' ? '.' : decPoint;
  var s2 = '';
  var toFixedFix = function (n3, prec2) {
    if (('' + n3).indexOf('e') === -1) {
      return +(Math.round(n3 + 'e+' + prec2) + 'e-' + prec2);
    } else {
      var arr = ('' + n3).split('e');
      var sig = '';
      if (+arr[1] + prec2 > 0) {
        sig = '+';
      }
      return (+(Math.round(+arr[0] + 'e' + sig + (+arr[1] + prec2)) + 'e-' + prec2)).toFixed(prec2);
    }
  };
  s2 = (prec ? toFixedFix(n2, prec).toString() : '' + Math.round(n2)).split('.');
  if (s2[0].length > 3) {
    s2[0] = s2[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s2[1] || '').length < prec) {
    s2[1] = s2[1] || '';
    s2[1] += new Array(prec - s2[1].length + 1).join('0');
  }
  return s2.join(dec);
};
const chunkArray = (array, size2) => {
  if (size2 <= 0) {
    return array;
  }
  return array.reduce((a2, _, i2) => {
    if (i2 % size2 === 0) a2.push(array.slice(i2, i2 + size2));
    return a2;
  }, []);
};
const check_promotions = async form => {
  var _a, _b, _c;
  form.items = form.items.map(i2 => (!i2.promotion_id ? i2 : { ...i2, promotion_id: null, discount: null }));
  for await (let item2 of form.items) {
    if (((_a = item2.product) == null ? void 0 : _a.valid_promotions) && item2.product.valid_promotions.length) {
      for await (const promotion of item2.product.valid_promotions) {
        if (promotion.type == 'simple') {
          item2.promotion_id = promotion.id;
          item2.discount = Number(promotion.discount) + '%';
        } else if (promotion.type == 'advance') {
          if (item2.quantity >= Number(promotion.quantity_to_buy)) {
            item2.promotion_id = promotion.id;
            item2.discount = Number(promotion.discount) + '%';
          }
        } else if (promotion.type == 'BXGY') {
          if (item2.quantity >= Number(promotion.quantity_to_buy)) {
            let ae = form.items.find(i2 => i2.product_id == promotion.product_id_to_get && i2.price == 0);
            if (!ae) {
              let product2 = await axios$1.get(route('products.show', promotion.product_id_to_get)).then(r2 => r2.data);
              let i2 = calculate_item(
                {
                  code: product2.code,
                  name: product2.name,
                  id: null,
                  price: 0,
                  quantity: Number(promotion.quantity_to_get),
                  cost: Number(product2.cost),
                  taxes: product2.taxes.map(t4 => t4.id),
                  tax_included: product2.tax_included == 1,
                  product_id: product2.id,
                  promo_product_id: item2.product_id,
                  product: product2,
                },
                form.calculate_on
              );
              item2.promotion_id = promotion.id;
              form.items = [...form.items, { ...i2 }];
            }
          }
        } else if (promotion.type == 'SXGD') {
          if (from.grand_total >= parseFloat(promotion.amount_to_spend)) {
            form.items = form.items.map(i2 => {
              if (!i2.promo_product_id) {
                i2.promotion_id = promotion.id;
                i2.discount = Number(promotion.discount) + '%';
                i2 = calculate_item(i2, form.calculate_on);
              }
              return i2;
            });
          }
        }
      }
    }
    if (
      ((_c = (_b = item2.product) == null ? void 0 : _b.category) == null ? void 0 : _c.valid_promotions) &&
      item2.product.category.valid_promotions.length
    ) {
      for await (const promotion of item2.product.category.valid_promotions) {
        if (promotion.type == 'simple') {
          item2.promotion_id = promotion.id;
          item2.discount = Number(promotion.discount) + '%';
        } else if (promotion.type == 'advance') {
          if (item2.quantity >= Number(promotion.quantity_to_buy)) {
            item2.promotion_id = promotion.id;
            item2.discount = Number(promotion.discount) + '%';
          }
        } else if (promotion.type == 'BXGY') {
          if (item2.quantity >= Number(promotion.quantity_to_buy)) {
            let ae = form.items.find(i2 => i2.product_id == promotion.product_id_to_get && i2.price == 0);
            if (!ae) {
              let product2 = await axios$1.get(route('products.show', promotion.product_id_to_get)).then(r2 => r2.data);
              let i2 = calculate_item(
                {
                  code: product2.code,
                  name: product2.name,
                  id: null,
                  price: 0,
                  quantity: Number(promotion.quantity_to_get),
                  cost: Number(product2.cost),
                  taxes: product2.taxes.map(t4 => t4.id),
                  tax_included: product2.tax_included == 1,
                  product_id: product2.id,
                  promo_product_id: item2.product_id,
                  product: product2,
                },
                form.calculate_on
              );
              item2.promotion_id = promotion.id;
              form.items = [...form.items, { ...i2 }];
            }
          }
        } else if (promotion.type == 'SXGD') {
          if (from.grand_total >= parseFloat(promotion.amount_to_spend)) {
            form.items = form.items.map(i2 => {
              if (!i2.promo_product_id) {
                i2.promotion_id = promotion.id;
                i2.discount = Number(promotion.discount) + '%';
                i2 = calculate_item(i2, form.calculate_on);
              }
              return i2;
            });
          }
        }
      }
    }
    item2 = calculate_item(item2, form.calculate_on);
  }
  return form.items;
};
const mixin = {
  computed: {
    $isAdmin() {
      return this.$page.props.auth.user && this.$page.props.auth.user.roles.find(r2 => r2.name == 'admin');
    },
    $company() {
      return this.$page.props.company;
    },
    $settings() {
      return this.$page.props.settings;
    },
  },
  methods: {
    $title(string) {
      return $capitalize(string);
    },
    $capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    $extra_attributes(extras) {
      return Object.keys(extras)
        .map(k2 => {
          return '<div><span class="text-gray-500 dark:text-gray-400">' + k2 + ':</span> ' + extras[k2] + '</div>';
        })
        .join('');
    },
    $address(row) {
      return $address(row);
    },
    $decimal(amount) {
      return $decimal(amount);
    },
    $decimal_qty(amount) {
      return $decimal_qty(amount);
    },
    $number(amount, locale, options) {
      return $number(amount, locale, options);
    },
    $currency(amount, locale, options) {
      return $currency(amount, locale, options);
    },
    $number_qty(amount, unit2, locale, options) {
      return $number_qty(amount, unit2, locale, options);
    },
    $weight(amount, locale, options) {
      return $weight(amount, locale, options);
    },
    $date(date, locale, style, force = false) {
      return $date$1(date, locale, style, force);
    },
    $isValidDate(date) {
      return isValidDate(date);
    },
    $datetime(datetime, locale, style, force = false) {
      return $datetime(datetime, locale, style, force);
    },
    $boolean(v2, c2 = false) {
      return $boolean(v2, c2);
    },
    $can(permissions) {
      return $can(permissions);
    },
    $meta(obj) {
      return $meta(obj);
    },
    $parseNumber(amount, locale) {
      if (!locale || (locale.length != 2 && locale.length != 5)) {
        locale = this.$page.props.settings.default_locale;
      }
      var thousandSeparator = Intl.NumberFormat(locale).format(11111).replace(new RegExp('\\p{Number}', 'gu'), '');
      var decimalSeparator = Intl.NumberFormat(locale).format(1.1).replace(new RegExp('\\p{Number}', 'gu'), '');
      return parseFloat(amount.replace(new RegExp('\\' + thousandSeparator, 'g'), '').replace(new RegExp('\\' + decimalSeparator), '.'));
    },
    $formatJSDate(date) {
      var d2 = new Date(date),
        month = '' + (d2.getMonth() + 1),
        day = '' + d2.getDate(),
        year = d2.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    },
    $dateDay(date, locale) {
      let formatted = new Date(Date.parse(date));
      if (!locale || (locale.length != 2 && locale.length != 5)) {
        locale = this.$page.props.settings.default_locale;
      }
      try {
        return formatted.toLocaleString(locale, { day: 'numeric', weekday: 'short' });
      } catch (err) {
        return formatted.toLocaleString('en-US', { day: 'numeric', weekday: 'short' });
      }
    },
    $month(month, locale, style = 'short') {
      let formatted = new Date(Date.parse(month));
      if (!locale || (locale.length != 2 && locale.length != 5)) {
        locale = this.$page.props.settings.default_locale;
      }
      try {
        return formatted.toLocaleString(locale, { month: style, year: 'numeric' });
      } catch (err) {
        return formatted.toLocaleString('en-US', { month: style, year: 'numeric' });
      }
    },
    $monthName(month, locale, style = 'long') {
      let formatted = new Date(Date.parse(month));
      if (!locale || (locale.length != 2 && locale.length != 5)) {
        locale = this.$page.props.settings.default_locale;
      }
      try {
        return formatted.toLocaleString(locale, { month: style });
      } catch (err) {
        return formatted.toLocaleString('en-US', { month: style });
      }
    },
    $time(date, locale, style) {
      let formatted = new Date(Date.parse(date));
      if (!locale || (locale.length != 2 && locale.length != 5)) {
        locale = this.$page.props.settings.default_locale;
      }
      try {
        return formatted.toLocaleString(locale, {
          timeStyle: 'short',
          hour12: true,
          // this.$page.props.settings.hour12 == 1
        });
      } catch (err) {
        return formatted.toLocaleString('en-US', {
          timeStyle: 'short',
          hour12: true,
          // this.$page.props.settings.hour12 == 1
        });
      }
    },
  },
};
const _sfc_main$2 = {
  __name: 'Icon',
  __ssrInlineRender: true,
  props: {
    name: String,
    size: String,
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(
          mergeProps(
            {
              class: __props.size ? __props.size : 'size-5',
            },
            _attrs
          )
        )}>`
      );
      if (__props.name == 'home') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"></path><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"></path></svg>`
        );
      } else if (__props.name == 'home-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path></svg>`
        );
      } else if (__props.name == 'home-alt') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0 .512 1.41l16.5-6Z"></path><path fill-rule="evenodd" d="M3.019 11.114 18 5.667v3.421l4.006 1.457a.75.75 0 1 1-.512 1.41l-.494-.18v8.475h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3v-9.129l.019-.007ZM18 20.25v-9.566l1.5.546v9.02H18Zm-9-6a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75H9Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'pos') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'pos-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"></path></svg>`
        );
      } else if (__props.name == 'pos-alt') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 0 1 1.5 10.875v-3.75Zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 0 1-1.875-1.875v-8.25ZM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 3 18.375v-2.25Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'orders') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M120,80A40,40,0,1,1,80,40,40,40,0,0,1,120,80Zm56,40a40,40,0,1,0-40-40A40,40,0,0,0,176,120ZM80,136a40,40,0,1,0,40,40A40,40,0,0,0,80,136Zm96,0a40,40,0,1,0,40,40A40,40,0,0,0,176,136Z"></path></svg>`
        );
      } else if (__props.name == 'orders-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M80,40a40,40,0,1,0,40,40A40,40,0,0,0,80,40Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,80,104Zm96,16a40,40,0,1,0-40-40A40,40,0,0,0,176,120Zm0-64a24,24,0,1,1-24,24A24,24,0,0,1,176,56ZM80,136a40,40,0,1,0,40,40A40,40,0,0,0,80,136Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,80,200Zm96-64a40,40,0,1,0,40,40A40,40,0,0,0,176,136Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,176,200Z"></path></svg>`
        );
      } else if (__props.name == 'bag') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'bag-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"></path></svg>`
        );
      } else if (__props.name == 'cart') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"></path></svg>`
        );
      } else if (__props.name == 'cart-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"></path></svg>`
        );
      } else if (__props.name == 'bell-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"></path></svg>`
        );
      } else if (__props.name == 'bag') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'cart') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"></path></svg>`
        );
      } else if (__props.name == 'cart') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"></path></svg>`
        );
      } else if (__props.name == 'gift') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6.75a2.25 2.25 0 0 0 2.25-2.25v-6.75h-9Z"></path></svg>`
        );
      } else if (__props.name == 'gift-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"></path></svg>`
        );
      } else if (__props.name == 'print') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.353 49.353 0 0 1 9 0Zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.373.373 0 0 1 .333-.337 41.741 41.741 0 0 1 8.566 0Zm.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75V10.5ZM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75H15Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'print-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"></path></svg>`
        );
      } else if (__props.name == 'support') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M19.449 8.448 16.388 11a4.52 4.52 0 0 1 0 2.002l3.061 2.55a8.275 8.275 0 0 0 0-7.103ZM15.552 19.45 13 16.388a4.52 4.52 0 0 1-2.002 0l-2.55 3.061a8.275 8.275 0 0 0 7.103 0ZM4.55 15.552 7.612 13a4.52 4.52 0 0 1 0-2.002L4.551 8.45a8.275 8.275 0 0 0 0 7.103ZM8.448 4.55 11 7.612a4.52 4.52 0 0 1 2.002 0l2.55-3.061a8.275 8.275 0 0 0-7.103 0Zm8.657-.86a9.776 9.776 0 0 1 1.79 1.415 9.776 9.776 0 0 1 1.414 1.788 9.764 9.764 0 0 1 0 10.211 9.777 9.777 0 0 1-1.415 1.79 9.777 9.777 0 0 1-1.788 1.414 9.764 9.764 0 0 1-10.212 0 9.776 9.776 0 0 1-1.788-1.415 9.776 9.776 0 0 1-1.415-1.788 9.764 9.764 0 0 1 0-10.212 9.774 9.774 0 0 1 1.415-1.788A9.774 9.774 0 0 1 6.894 3.69a9.764 9.764 0 0 1 10.211 0ZM14.121 9.88a2.985 2.985 0 0 0-1.11-.704 3.015 3.015 0 0 0-2.022 0 2.985 2.985 0 0 0-1.11.704c-.326.325-.56.705-.704 1.11a3.015 3.015 0 0 0 0 2.022c.144.405.378.785.704 1.11.325.326.705.56 1.11.704.652.233 1.37.233 2.022 0a2.985 2.985 0 0 0 1.11-.704c.326-.325.56-.705.704-1.11a3.016 3.016 0 0 0 0-2.022 2.985 2.985 0 0 0-.704-1.11Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'cli') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'cog') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'cog-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>`
        );
      } else if (__props.name == 'qrcode') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M120,56v48a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40h48A16,16,0,0,1,120,56Zm-16,80H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm96-96H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40ZM144,184a8,8,0,0,0,8-8V144a8,8,0,0,0-16,0v32A8,8,0,0,0,144,184Zm64-32H184v-8a8,8,0,0,0-16,0v56H144a8,8,0,0,0,0,16h32a8,8,0,0,0,8-8V168h24a8,8,0,0,0,0-16Zm0,32a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V192A8,8,0,0,0,208,184Z"></path></svg>`
        );
      } else if (__props.name == 'qr-code') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 9.375v-4.5ZM4.875 4.5a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 0 1-1.875-1.875v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75A.75.75 0 0 1 6 7.5v-.75Zm9.75 0A.75.75 0 0 1 16.5 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 19.125v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875-.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM6 16.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm9.75 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm-3 3a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'barcode-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M232,48V88a8,8,0,0,1-16,0V56H184a8,8,0,0,1,0-16h40A8,8,0,0,1,232,48ZM72,200H40V168a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16Zm152-40a8,8,0,0,0-8,8v32H184a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V168A8,8,0,0,0,224,160ZM32,96a8,8,0,0,0,8-8V56H72a8,8,0,0,0,0-16H32a8,8,0,0,0-8,8V88A8,8,0,0,0,32,96ZM80,80a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,80,80Zm104,88V88a8,8,0,0,0-16,0v80a8,8,0,0,0,16,0ZM144,80a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,144,80Zm-32,0a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,112,80Z"></path></svg>`
        );
      } else if (__props.name == 'barcode') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M224,40H32a8,8,0,0,0-8,8V208a8,8,0,0,0,8,8H224a8,8,0,0,0,8-8V48A8,8,0,0,0,224,40ZM40,64a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H56V96a8,8,0,0,1-16,0ZM80,200H48a8,8,0,0,1-8-8V160a8,8,0,0,1,16,0v24H80a8,8,0,0,1,0,16Zm24-48a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm24,8a8,8,0,0,1-8-8V104a8,8,0,0,1,16,0v48A8,8,0,0,1,160,160Zm56,32a8,8,0,0,1-8,8H176a8,8,0,0,1,0-16h24V160a8,8,0,0,1,16,0Zm0-96a8,8,0,0,1-16,0V72H176a8,8,0,0,1,0-16h32a8,8,0,0,1,8,8Z"></path></svg>`
        );
      } else if (__props.name == 'up-down') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,133.66-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L128,172.69l26.34-26.35a8,8,0,0,1,11.32,11.32Zm0-48a8,8,0,0,1-11.32,0L128,83.31l-26.34,26.35A8,8,0,0,1,90.34,98.34l32-32a8,8,0,0,1,11.32,0l32,32A8,8,0,0,1,165.66,109.66Z"></path></svg>`
        );
      } else if (__props.name == 'up-down-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM165.66,98.34a8,8,0,0,1-11.32,11.32L128,83.31l-26.34,26.35A8,8,0,0,1,90.34,98.34l32-32a8,8,0,0,1,11.32,0Zm0,48a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L128,172.69l26.34-26.35A8,8,0,0,1,165.66,146.34Z"></path></svg>`
        );
      } else if (__props.name == 'import') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M223.16,68.42l-16-32A8,8,0,0,0,200,32H56a8,8,0,0,0-7.16,4.42l-16,32A8.08,8.08,0,0,0,32,72V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V72A8.08,8.08,0,0,0,223.16,68.42Zm-57.5,89.24-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L120,164.69V104a8,8,0,0,1,16,0v60.69l18.34-18.35a8,8,0,0,1,11.32,11.32ZM52.94,64l8-16H195.06l8,16Z"></path></svg>`
        );
      } else if (__props.name == 'export') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M223.16,68.42l-16-32A8,8,0,0,0,200,32H56a8,8,0,0,0-7.16,4.42l-16,32A8.08,8.08,0,0,0,32,72V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V72A8.08,8.08,0,0,0,223.16,68.42Zm-57.5,73.24a8,8,0,0,1-11.32,0L136,123.31V184a8,8,0,0,1-16,0V123.31l-18.34,18.35a8,8,0,0,1-11.32-11.32l32-32a8,8,0,0,1,11.32,0l32,32A8,8,0,0,1,165.66,141.66ZM52.94,64l8-16H195.06l8,16Z"></path></svg>`
        );
      } else if (__props.name == 'code') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'c-down') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'c-up') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'list') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z"></path></svg>`
        );
      } else if (__props.name == 'add') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'edit') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"></path><path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"></path></svg>`
        );
      } else if (__props.name == 'edit-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path></svg>`
        );
      } else if (__props.name == 'trash') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'trash-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path></svg>`
        );
      } else if (__props.name == 'import-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"></path></svg>`
        );
      } else if (__props.name == 'import') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V10.5Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'external') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'info') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"></path></svg>`
        );
      } else if (__props.name == 'disclaimer') {
        _push(
          `<svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"></path></svg>`
        );
      } else if (__props.name == 'adjust') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM146.34,77.66a8,8,0,0,1,11.32-11.32L168,76.69l10.34-10.35a8,8,0,0,1,11.32,11.32L179.31,88l10.35,10.34a8,8,0,0,1-11.32,11.32L168,99.31l-10.34,10.35a8,8,0,0,1-11.32-11.32L156.69,88ZM112,176H96v16a8,8,0,0,1-16,0V176H64a8,8,0,0,1,0-16H80V144a8,8,0,0,1,16,0v16h16a8,8,0,0,1,0,16Zm0-80H64a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm80,96H144a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm0-32H144a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Z"></path></svg>`
        );
      } else if (__props.name == 'transfer') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M254.07,106.79,208.53,53.73A16,16,0,0,0,196.26,48H32A16,16,0,0,0,16,64V176a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V112A8,8,0,0,0,254.07,106.79ZM32,104V64H88v40Zm48,96a16,16,0,1,1,16-16A16,16,0,0,1,80,200Zm80-96H104V64h56Zm32,96a16,16,0,1,1,16-16A16,16,0,0,1,192,200Zm-16-96V64h20.26l34.33,40Z"></path></svg>`
        );
      } else if (__props.name == 'return') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm-32,96a8,8,0,0,1-8,8H99.31l10.35,10.34a8,8,0,0,1-11.32,11.32l-24-24a8,8,0,0,1,0-11.32l24-24a8,8,0,0,1,11.32,11.32L99.31,128H168V104a8,8,0,0,1,16,0Z"></path></svg>`
        );
      } else if (__props.name == 'calendar') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM112,184a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm56-8a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136a23.76,23.76,0,0,1-4.84,14.45L152,176ZM48,80V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80Z"></path></svg>`
        );
      } else if (__props.name == 'calendar-dots') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM84,184a12,12,0,1,1,12-12A12,12,0,0,1,84,184Zm44,0a12,12,0,1,1,12-12A12,12,0,0,1,128,184Zm0-40a12,12,0,1,1,12-12A12,12,0,0,1,128,144Zm44,40a12,12,0,1,1,12-12A12,12,0,0,1,172,184Zm0-40a12,12,0,1,1,12-12A12,12,0,0,1,172,144Zm36-64H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24Z"></path></svg>`
        );
      } else if (__props.name == 'scale') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"></path></svg>`
        );
      } else if (__props.name == 'docs') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z"></path><path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z"></path></svg>`
        );
      } else if (__props.name == 'truck') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z"></path><path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z"></path><path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"></path></svg>`
        );
      } else if (__props.name == 'truck-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"></path></svg>`
        );
      } else if (__props.name == 'archive') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"></path></svg>`
        );
      } else if (__props.name == 'settings') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"></path></svg>`
        );
      } else if (__props.name == 'envelope') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"></path></svg>`
        );
      } else if (__props.name == 'dollar') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z"></path><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'dollar-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>`
        );
      } else if (__props.name == 'receipt') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M12 1.5c-1.921 0-3.816.111-5.68.327-1.497.174-2.57 1.46-2.57 2.93V21.75a.75.75 0 0 0 1.029.696l3.471-1.388 3.472 1.388a.75.75 0 0 0 .556 0l3.472-1.388 3.471 1.388a.75.75 0 0 0 1.029-.696V4.757c0-1.47-1.073-2.756-2.57-2.93A49.255 49.255 0 0 0 12 1.5Zm3.53 7.28a.75.75 0 0 0-1.06-1.06l-6 6a.75.75 0 1 0 1.06 1.06l6-6ZM8.625 9a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm5.625 3.375a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'receipt-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"></path></svg>`
        );
      } else if (__props.name == 'book') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z"></path></svg>`
        );
      } else if (__props.name == 'book-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"></path></svg>`
        );
      } else if (__props.name == 'x') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg>`
        );
      } else if (__props.name == 'folder') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z"></path></svg>`
        );
      } else if (__props.name == 'folder-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"></path></svg>`
        );
      } else if (__props.name == 'star') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'star-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"></path></svg>`
        );
      } else if (__props.name == 'chip') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M16.5 7.5h-9v9h9v-9Z"></path><path fill-rule="evenodd" d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'chip-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"></path></svg>`
        );
      } else if (__props.name == 'group') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clip-rule="evenodd"></path><path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z"></path></svg>`
        );
      } else if (__props.name == 'group-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"></path></svg>`
        );
      } else if (__props.name == 'users') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z"></path></svg>`
        );
      } else if (__props.name == 'users-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"></path></svg>`
        );
      } else if (__props.name == 'add-user') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"></path></svg>`
        );
      } else if (__props.name == 'suppliers-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"></path></svg>`
        );
      } else if (__props.name == 'suppliers') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M64.12,147.8a4,4,0,0,1-4,4.2H16a8,8,0,0,1-7.8-6.17,8.35,8.35,0,0,1,1.62-6.93A67.79,67.79,0,0,1,37,117.51a40,40,0,1,1,66.46-35.8,3.94,3.94,0,0,1-2.27,4.18A64.08,64.08,0,0,0,64,144C64,145.28,64,146.54,64.12,147.8Zm182-8.91A67.76,67.76,0,0,0,219,117.51a40,40,0,1,0-66.46-35.8,3.94,3.94,0,0,0,2.27,4.18A64.08,64.08,0,0,1,192,144c0,1.28,0,2.54-.12,3.8a4,4,0,0,0,4,4.2H240a8,8,0,0,0,7.8-6.17A8.33,8.33,0,0,0,246.17,138.89Zm-89,43.18a48,48,0,1,0-58.37,0A72.13,72.13,0,0,0,65.07,212,8,8,0,0,0,72,224H184a8,8,0,0,0,6.93-12A72.15,72.15,0,0,0,157.19,182.07Z"></path></svg>`
        );
      } else if (__props.name == 'people-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M27.2,126.4a8,8,0,0,0,11.2-1.6,52,52,0,0,1,83.2,0,8,8,0,0,0,11.2,1.59,7.73,7.73,0,0,0,1.59-1.59h0a52,52,0,0,1,83.2,0,8,8,0,0,0,12.8-9.61A67.85,67.85,0,0,0,203,93.51a40,40,0,1,0-53.94,0,67.27,67.27,0,0,0-21,14.31,67.27,67.27,0,0,0-21-14.31,40,40,0,1,0-53.94,0A67.88,67.88,0,0,0,25.6,115.2,8,8,0,0,0,27.2,126.4ZM176,40a24,24,0,1,1-24,24A24,24,0,0,1,176,40ZM80,40A24,24,0,1,1,56,64,24,24,0,0,1,80,40ZM203,197.51a40,40,0,1,0-53.94,0,67.27,67.27,0,0,0-21,14.31,67.27,67.27,0,0,0-21-14.31,40,40,0,1,0-53.94,0A67.88,67.88,0,0,0,25.6,219.2a8,8,0,1,0,12.8,9.6,52,52,0,0,1,83.2,0,8,8,0,0,0,11.2,1.59,7.73,7.73,0,0,0,1.59-1.59h0a52,52,0,0,1,83.2,0,8,8,0,0,0,12.8-9.61A67.85,67.85,0,0,0,203,197.51ZM80,144a24,24,0,1,1-24,24A24,24,0,0,1,80,144Zm96,0a24,24,0,1,1-24,24A24,24,0,0,1,176,144Z"></path></svg>`
        );
      } else if (__props.name == 'people') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M230.4,219.19A8,8,0,0,1,224,232H32a8,8,0,0,1-6.4-12.8A67.88,67.88,0,0,1,53,197.51a40,40,0,1,1,53.93,0,67.42,67.42,0,0,1,21,14.29,67.42,67.42,0,0,1,21-14.29,40,40,0,1,1,53.93,0A67.85,67.85,0,0,1,230.4,219.19ZM27.2,126.4a8,8,0,0,0,11.2-1.6,52,52,0,0,1,83.2,0,8,8,0,0,0,12.8,0,52,52,0,0,1,83.2,0,8,8,0,0,0,12.8-9.61A67.85,67.85,0,0,0,203,93.51a40,40,0,1,0-53.93,0,67.42,67.42,0,0,0-21,14.29,67.42,67.42,0,0,0-21-14.29,40,40,0,1,0-53.93,0A67.88,67.88,0,0,0,25.6,115.2,8,8,0,0,0,27.2,126.4Z"></path></svg>`
        );
      } else if (__props.name == 'store') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0 .512 1.41l16.5-6Z"></path><path fill-rule="evenodd" d="M3.019 11.114 18 5.667v3.421l4.006 1.457a.75.75 0 1 1-.512 1.41l-.494-.18v8.475h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3v-9.129l.019-.007ZM18 20.25v-9.566l1.5.546v9.02H18Zm-9-6a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75H9Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'store-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"></path></svg>`
        );
      } else if (__props.name == 'funnel') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'funnel-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"></path></svg>`
        );
      } else if (__props.name == 'sparkles') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'sparkles-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"></path></svg>`
        );
      } else if (__props.name == 'money') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"></path><path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clip-rule="evenodd"></path><path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z"></path></svg>`
        );
      } else if (__props.name == 'money-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"></path></svg>`
        );
      } else if (__props.name == 'v-arrows') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'rects') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z"></path></svg>`
        );
      } else if (__props.name == 'squares') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z"></path><path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z"></path><path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z"></path></svg>`
        );
      } else if (__props.name == 'squares-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"></path></svg>`
        );
      } else if (__props.name == 'register') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M239.76,158.06,217.28,68.12A16,16,0,0,0,201.75,56H136V40a16,16,0,0,0-16-16H80A16,16,0,0,0,64,40V56H54.25A16,16,0,0,0,38.72,68.12L16.24,158.06A7.93,7.93,0,0,0,16,160v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160A7.93,7.93,0,0,0,239.76,158.06ZM168,88h16a8,8,0,0,1,0,16H168a8,8,0,0,1,0-16Zm0,32h16a8,8,0,0,1,0,16H168a8,8,0,0,1,0-16ZM136,88a8,8,0,0,1,0,16H120a8,8,0,0,1,0-16Zm8,40a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h16A8,8,0,0,1,144,128ZM80,40h40V56H80ZM72,88H88a8,8,0,0,1,0,16H72a8,8,0,0,1,0-16Zm0,32H88a8,8,0,0,1,0,16H72a8,8,0,0,1,0-16Zm152,72H32V168H224Z"></path></svg>`
        );
      } else if (__props.name == 'register-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M239.76,158.06,217.28,68.12A16,16,0,0,0,201.75,56H136V40a16,16,0,0,0-16-16H80A16,16,0,0,0,64,40V56H54.25A16,16,0,0,0,38.72,68.12L16.24,158.06A7.93,7.93,0,0,0,16,160v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160A7.93,7.93,0,0,0,239.76,158.06ZM80,40h40V56H80ZM54.25,72h147.5l20,80H34.25ZM32,192V168H224v24ZM64,96a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,96ZM64,128a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,128Z"></path></svg>`
        );
      } else if (__props.name == 'circles') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z"></path><path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z"></path><path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z"></path><path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z"></path></svg>`
        );
      } else if (__props.name == 'rects-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"></path></svg>`
        );
      } else if (__props.name == 'plus') {
        _push(
          `<svg fill="none" class="w-full h-full" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>`
        );
      } else if (__props.name == 'adjust-h') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"></path></svg>`
        );
      } else if (__props.name == 'adjust-v') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M6 12a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 1 1 1.5 0v7.5A.75.75 0 0 1 6 12ZM18 12a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 1.5 0v7.5A.75.75 0 0 1 18 12ZM6.75 20.25v-1.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0ZM18.75 18.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 1.5 0ZM12.75 5.25v-1.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0ZM12 21a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 1.5 0v7.5A.75.75 0 0 1 12 21ZM3.75 15a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0ZM12 11.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5ZM15.75 15a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0Z"></path></svg>`
        );
      } else if (__props.name == 'textbox') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full" viewBox="0 0 256 256"><path d="M248,80v96a16,16,0,0,1-16,16H140a4,4,0,0,1-4-4V68a4,4,0,0,1,4-4h92A16,16,0,0,1,248,80ZM120,48V208a8,8,0,0,1-16,0V192H24A16,16,0,0,1,8,176V80A16,16,0,0,1,24,64h80V48a8,8,0,0,1,16,0ZM88,112a8,8,0,0,0-8-8H48a8,8,0,0,0,0,16h8v24a8,8,0,0,0,16,0V120h8A8,8,0,0,0,88,112Z"></path></svg>`
        );
      } else if (__props.name == 'bolt') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"></path></svg>`
        );
      } else if (__props.name == 'photo') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"></path></svg>`
        );
      } else if (__props.name == 'search') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path></svg>`
        );
      } else if (__props.name == 'eye') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>`
        );
      } else if (__props.name == 'd-arrows') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"></path></svg>`
        );
      } else if (__props.name == 'card') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z"></path><path fill-rule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'card-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"></path></svg>`
        );
      } else if (__props.name == 'bars') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M3 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.25Zm0 4.5A.75.75 0 0 1 3.75 9h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'bar-chart') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z"></path></svg>`
        );
      } else if (__props.name == 'tick') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'copied') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'copied-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"></path></svg>`
        );
      } else if (__props.name == 'a-blank') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>`
        );
      } else if (__props.name == 'check-badge') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'check-badge-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"></path></svg>`
        );
      } else if (__props.name == 'download-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"></path></svg>`
        );
      } else if (__props.name == 'calc') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M6.32 1.827a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V4.757c0-1.47 1.073-2.756 2.57-2.93ZM7.5 11.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H8.25a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H8.25Zm-.75 3a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H8.25a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75H8.25Zm1.748-6a.75.75 0 0 1 .75-.75h.007a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.007a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.335.75.75.75h.007a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.007Zm-.75 3a.75.75 0 0 1 .75-.75h.007a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.007a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.335.75.75.75h.007a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75h-.007Zm1.754-6a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.008Zm-.75 3a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75h-.008Zm1.748-6a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.008Zm-8.25-6A.75.75 0 0 1 8.25 6h7.5a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-.75Zm9 9a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-2.25Z" clip-rule="evenodd"></path></svg>`
        );
      } else if (__props.name == 'calc-o') {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"></path></svg>`
        );
      } else {
        _push(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M11.097 1.515a.75.75 0 0 1 .589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 1 1 1.47.294L16.665 7.5h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.2 6h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103H3.75a.75.75 0 0 1 0-1.5h3.885l1.2-6H5.25a.75.75 0 0 1 0-1.5h3.885l1.08-5.397a.75.75 0 0 1 .882-.588ZM10.365 9l-1.2 6h4.47l1.2-6h-4.47Z" clip-rule="evenodd"></path></svg>`
        );
      }
      _push(`</div>`);
    };
  },
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Icon.vue');
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: 'AppLayout',
  __ssrInlineRender: true,
  props: { title: String },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: '' }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Head), { title: __props.title }, null, _parent));
      _push(`<main class="bg-gray-50 dark:bg-gray-800">`);
      ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      _push(`</main>`);
      _push(
        ssrRenderComponent(
          unref(NotificationGroup),
          { group: 'main' },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="z-99 pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 print:hidden"${_scopeId}><div class="flex w-full flex-col items-center space-y-4 sm:items-end"${_scopeId}>`
                );
                _push2(
                  ssrRenderComponent(
                    unref(Notification),
                    {
                      enter: 'transform ease-out duration-300 transition',
                      'enter-from': 'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4',
                      'enter-to': 'translate-y-0 opacity-100 sm:translate-x-0',
                      leave: 'transition ease-in duration-500',
                      'leave-from': 'opacity-100',
                      'leave-to': 'opacity-0',
                      move: 'transition duration-500',
                      'move-delay': 'delay-300',
                    },
                    {
                      default: withCtx(({ notifications, close }, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`<!--[-->`);
                          ssrRenderList(notifications, notification => {
                            _push3(
                              `<div class="${ssrRenderClass([
                                notification.type === 'success'
                                  ? 'bg-green-100'
                                  : notification.type === 'error'
                                  ? 'bg-red-100'
                                  : 'bg-white dark:bg-gray-950',
                                'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5',
                              ])}"${_scopeId2}><div class="p-4"${_scopeId2}>`
                            );
                            if (notification.type === 'success') {
                              _push3(
                                `<div class="flex items-start text-green-600"${_scopeId2}><div class="shrink-0"${_scopeId2}><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId2}></path></svg></div><div class="ml-3 w-0 flex-1 pt-0.5"${_scopeId2}>`
                              );
                              if (notification.title) {
                                _push3(`<p class="mb-1 text-sm font-medium"${_scopeId2}>${ssrInterpolate(notification.title)}</p>`);
                              } else {
                                _push3(`<!---->`);
                              }
                              _push3(
                                `<p class="text-sm"${_scopeId2}>${
                                  notification.text ?? ''
                                }</p></div><div class="ml-4 flex shrink-0"${_scopeId2}><button type="button" class="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-0"${_scopeId2}><span class="sr-only"${_scopeId2}>${ssrInterpolate(
                                  _ctx.$t('Close')
                                )}</span><svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"${_scopeId2}><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"${_scopeId2}></path></svg></button></div></div>`
                              );
                            } else {
                              _push3(`<!---->`);
                            }
                            if (notification.type === 'error') {
                              _push3(
                                `<div class="flex items-start text-red-600"${_scopeId2}><div class="shrink-0"${_scopeId2}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"${_scopeId2}></path></svg></div><div class="ml-3 w-0 flex-1 pt-0.5"${_scopeId2}>`
                              );
                              if (notification.title) {
                                _push3(`<p class="mb-1 text-sm font-medium"${_scopeId2}>${ssrInterpolate(notification.title)}</p>`);
                              } else {
                                _push3(`<!---->`);
                              }
                              _push3(
                                `<p class="text-sm"${_scopeId2}>${
                                  notification.text ?? ''
                                }</p></div><div class="ml-4 flex shrink-0"${_scopeId2}><button type="button" class="inline-flex rounded-md text-gray-500 hover:text-gray-600 focus:outline-hidden focus:ring-0"${_scopeId2}><span class="sr-only"${_scopeId2}>${ssrInterpolate(
                                  _ctx.$t('Close')
                                )}</span><svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"${_scopeId2}><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"${_scopeId2}></path></svg></button></div></div>`
                              );
                            } else {
                              _push3(`<!---->`);
                            }
                            _push3(`</div></div>`);
                          });
                          _push3(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true),
                            createBlock(
                              Fragment,
                              null,
                              renderList(notifications, notification => {
                                return (
                                  openBlock(),
                                  createBlock(
                                    'div',
                                    {
                                      key: notification.id,
                                      class: [
                                        notification.type === 'success'
                                          ? 'bg-green-100'
                                          : notification.type === 'error'
                                          ? 'bg-red-100'
                                          : 'bg-white dark:bg-gray-950',
                                        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5',
                                      ],
                                    },
                                    [
                                      createVNode('div', { class: 'p-4' }, [
                                        notification.type === 'success'
                                          ? (openBlock(),
                                            createBlock(
                                              'div',
                                              {
                                                key: 0,
                                                class: 'flex items-start text-green-600',
                                              },
                                              [
                                                createVNode('div', { class: 'shrink-0' }, [
                                                  (openBlock(),
                                                  createBlock(
                                                    'svg',
                                                    {
                                                      class: 'h-6 w-6',
                                                      fill: 'none',
                                                      viewBox: '0 0 24 24',
                                                      'stroke-width': '1.5',
                                                      stroke: 'currentColor',
                                                      'aria-hidden': 'true',
                                                    },
                                                    [
                                                      createVNode('path', {
                                                        'stroke-linecap': 'round',
                                                        'stroke-linejoin': 'round',
                                                        d: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                                                      }),
                                                    ]
                                                  )),
                                                ]),
                                                createVNode('div', { class: 'ml-3 w-0 flex-1 pt-0.5' }, [
                                                  notification.title
                                                    ? (openBlock(),
                                                      createBlock(
                                                        'p',
                                                        {
                                                          key: 0,
                                                          class: 'mb-1 text-sm font-medium',
                                                        },
                                                        toDisplayString(notification.title),
                                                        1
                                                      ))
                                                    : createCommentVNode('', true),
                                                  createVNode(
                                                    'p',
                                                    {
                                                      class: 'text-sm',
                                                      innerHTML: notification.text,
                                                    },
                                                    null,
                                                    8,
                                                    ['innerHTML']
                                                  ),
                                                ]),
                                                createVNode('div', { class: 'ml-4 flex shrink-0' }, [
                                                  createVNode(
                                                    'button',
                                                    {
                                                      type: 'button',
                                                      onClick: $event => close(notification.id),
                                                      class:
                                                        'inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-0',
                                                    },
                                                    [
                                                      createVNode('span', { class: 'sr-only' }, toDisplayString(_ctx.$t('Close')), 1),
                                                      (openBlock(),
                                                      createBlock(
                                                        'svg',
                                                        {
                                                          class: 'h-5 w-5',
                                                          viewBox: '0 0 20 20',
                                                          fill: 'currentColor',
                                                          'aria-hidden': 'true',
                                                        },
                                                        [
                                                          createVNode('path', {
                                                            d: 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z',
                                                          }),
                                                        ]
                                                      )),
                                                    ],
                                                    8,
                                                    ['onClick']
                                                  ),
                                                ]),
                                              ]
                                            ))
                                          : createCommentVNode('', true),
                                        notification.type === 'error'
                                          ? (openBlock(),
                                            createBlock(
                                              'div',
                                              {
                                                key: 1,
                                                class: 'flex items-start text-red-600',
                                              },
                                              [
                                                createVNode('div', { class: 'shrink-0' }, [
                                                  (openBlock(),
                                                  createBlock(
                                                    'svg',
                                                    {
                                                      xmlns: 'http://www.w3.org/2000/svg',
                                                      fill: 'none',
                                                      viewBox: '0 0 24 24',
                                                      'stroke-width': '1.5',
                                                      stroke: 'currentColor',
                                                      class: 'w-6 h-6',
                                                    },
                                                    [
                                                      createVNode('path', {
                                                        'stroke-linecap': 'round',
                                                        'stroke-linejoin': 'round',
                                                        d: 'm9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
                                                      }),
                                                    ]
                                                  )),
                                                ]),
                                                createVNode('div', { class: 'ml-3 w-0 flex-1 pt-0.5' }, [
                                                  notification.title
                                                    ? (openBlock(),
                                                      createBlock(
                                                        'p',
                                                        {
                                                          key: 0,
                                                          class: 'mb-1 text-sm font-medium',
                                                        },
                                                        toDisplayString(notification.title),
                                                        1
                                                      ))
                                                    : createCommentVNode('', true),
                                                  createVNode(
                                                    'p',
                                                    {
                                                      class: 'text-sm',
                                                      innerHTML: notification.text,
                                                    },
                                                    null,
                                                    8,
                                                    ['innerHTML']
                                                  ),
                                                ]),
                                                createVNode('div', { class: 'ml-4 flex shrink-0' }, [
                                                  createVNode(
                                                    'button',
                                                    {
                                                      type: 'button',
                                                      onClick: $event => close(notification.id),
                                                      class:
                                                        'inline-flex rounded-md text-gray-500 hover:text-gray-600 focus:outline-hidden focus:ring-0',
                                                    },
                                                    [
                                                      createVNode('span', { class: 'sr-only' }, toDisplayString(_ctx.$t('Close')), 1),
                                                      (openBlock(),
                                                      createBlock(
                                                        'svg',
                                                        {
                                                          class: 'h-5 w-5',
                                                          viewBox: '0 0 20 20',
                                                          fill: 'currentColor',
                                                          'aria-hidden': 'true',
                                                        },
                                                        [
                                                          createVNode('path', {
                                                            d: 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z',
                                                          }),
                                                        ]
                                                      )),
                                                    ],
                                                    8,
                                                    ['onClick']
                                                  ),
                                                ]),
                                              ]
                                            ))
                                          : createCommentVNode('', true),
                                      ]),
                                    ],
                                    2
                                  )
                                );
                              }),
                              128
                            )),
                          ];
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                );
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode(
                    'div',
                    { class: 'z-99 pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 print:hidden' },
                    [
                      createVNode('div', { class: 'flex w-full flex-col items-center space-y-4 sm:items-end' }, [
                        createVNode(
                          unref(Notification),
                          {
                            enter: 'transform ease-out duration-300 transition',
                            'enter-from': 'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4',
                            'enter-to': 'translate-y-0 opacity-100 sm:translate-x-0',
                            leave: 'transition ease-in duration-500',
                            'leave-from': 'opacity-100',
                            'leave-to': 'opacity-0',
                            move: 'transition duration-500',
                            'move-delay': 'delay-300',
                          },
                          {
                            default: withCtx(({ notifications, close }) => [
                              (openBlock(true),
                              createBlock(
                                Fragment,
                                null,
                                renderList(notifications, notification => {
                                  return (
                                    openBlock(),
                                    createBlock(
                                      'div',
                                      {
                                        key: notification.id,
                                        class: [
                                          notification.type === 'success'
                                            ? 'bg-green-100'
                                            : notification.type === 'error'
                                            ? 'bg-red-100'
                                            : 'bg-white dark:bg-gray-950',
                                          'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5',
                                        ],
                                      },
                                      [
                                        createVNode('div', { class: 'p-4' }, [
                                          notification.type === 'success'
                                            ? (openBlock(),
                                              createBlock(
                                                'div',
                                                {
                                                  key: 0,
                                                  class: 'flex items-start text-green-600',
                                                },
                                                [
                                                  createVNode('div', { class: 'shrink-0' }, [
                                                    (openBlock(),
                                                    createBlock(
                                                      'svg',
                                                      {
                                                        class: 'h-6 w-6',
                                                        fill: 'none',
                                                        viewBox: '0 0 24 24',
                                                        'stroke-width': '1.5',
                                                        stroke: 'currentColor',
                                                        'aria-hidden': 'true',
                                                      },
                                                      [
                                                        createVNode('path', {
                                                          'stroke-linecap': 'round',
                                                          'stroke-linejoin': 'round',
                                                          d: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                                                        }),
                                                      ]
                                                    )),
                                                  ]),
                                                  createVNode('div', { class: 'ml-3 w-0 flex-1 pt-0.5' }, [
                                                    notification.title
                                                      ? (openBlock(),
                                                        createBlock(
                                                          'p',
                                                          {
                                                            key: 0,
                                                            class: 'mb-1 text-sm font-medium',
                                                          },
                                                          toDisplayString(notification.title),
                                                          1
                                                        ))
                                                      : createCommentVNode('', true),
                                                    createVNode(
                                                      'p',
                                                      {
                                                        class: 'text-sm',
                                                        innerHTML: notification.text,
                                                      },
                                                      null,
                                                      8,
                                                      ['innerHTML']
                                                    ),
                                                  ]),
                                                  createVNode('div', { class: 'ml-4 flex shrink-0' }, [
                                                    createVNode(
                                                      'button',
                                                      {
                                                        type: 'button',
                                                        onClick: $event => close(notification.id),
                                                        class:
                                                          'inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-0',
                                                      },
                                                      [
                                                        createVNode('span', { class: 'sr-only' }, toDisplayString(_ctx.$t('Close')), 1),
                                                        (openBlock(),
                                                        createBlock(
                                                          'svg',
                                                          {
                                                            class: 'h-5 w-5',
                                                            viewBox: '0 0 20 20',
                                                            fill: 'currentColor',
                                                            'aria-hidden': 'true',
                                                          },
                                                          [
                                                            createVNode('path', {
                                                              d: 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z',
                                                            }),
                                                          ]
                                                        )),
                                                      ],
                                                      8,
                                                      ['onClick']
                                                    ),
                                                  ]),
                                                ]
                                              ))
                                            : createCommentVNode('', true),
                                          notification.type === 'error'
                                            ? (openBlock(),
                                              createBlock(
                                                'div',
                                                {
                                                  key: 1,
                                                  class: 'flex items-start text-red-600',
                                                },
                                                [
                                                  createVNode('div', { class: 'shrink-0' }, [
                                                    (openBlock(),
                                                    createBlock(
                                                      'svg',
                                                      {
                                                        xmlns: 'http://www.w3.org/2000/svg',
                                                        fill: 'none',
                                                        viewBox: '0 0 24 24',
                                                        'stroke-width': '1.5',
                                                        stroke: 'currentColor',
                                                        class: 'w-6 h-6',
                                                      },
                                                      [
                                                        createVNode('path', {
                                                          'stroke-linecap': 'round',
                                                          'stroke-linejoin': 'round',
                                                          d: 'm9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
                                                        }),
                                                      ]
                                                    )),
                                                  ]),
                                                  createVNode('div', { class: 'ml-3 w-0 flex-1 pt-0.5' }, [
                                                    notification.title
                                                      ? (openBlock(),
                                                        createBlock(
                                                          'p',
                                                          {
                                                            key: 0,
                                                            class: 'mb-1 text-sm font-medium',
                                                          },
                                                          toDisplayString(notification.title),
                                                          1
                                                        ))
                                                      : createCommentVNode('', true),
                                                    createVNode(
                                                      'p',
                                                      {
                                                        class: 'text-sm',
                                                        innerHTML: notification.text,
                                                      },
                                                      null,
                                                      8,
                                                      ['innerHTML']
                                                    ),
                                                  ]),
                                                  createVNode('div', { class: 'ml-4 flex shrink-0' }, [
                                                    createVNode(
                                                      'button',
                                                      {
                                                        type: 'button',
                                                        onClick: $event => close(notification.id),
                                                        class:
                                                          'inline-flex rounded-md text-gray-500 hover:text-gray-600 focus:outline-hidden focus:ring-0',
                                                      },
                                                      [
                                                        createVNode('span', { class: 'sr-only' }, toDisplayString(_ctx.$t('Close')), 1),
                                                        (openBlock(),
                                                        createBlock(
                                                          'svg',
                                                          {
                                                            class: 'h-5 w-5',
                                                            viewBox: '0 0 20 20',
                                                            fill: 'currentColor',
                                                            'aria-hidden': 'true',
                                                          },
                                                          [
                                                            createVNode('path', {
                                                              d: 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z',
                                                            }),
                                                          ]
                                                        )),
                                                      ],
                                                      8,
                                                      ['onClick']
                                                    ),
                                                  ]),
                                                ]
                                              ))
                                            : createCommentVNode('', true),
                                        ]),
                                      ],
                                      2
                                    )
                                  );
                                }),
                                128
                              )),
                            ]),
                            _: 1,
                          }
                        ),
                      ]),
                    ]
                  ),
                ];
              }
            }),
            _: 1,
          },
          _parent
        )
      );
      _push(
        ssrRenderComponent(
          unref(NotificationGroup),
          { group: 'mobile' },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="z-99 pointer-events-none fixed inset-0 flex items-start px-4 py-6 sm:p-6 lg:hidden print:hidden"${_scopeId}><div class="flex w-full flex-col items-end space-y-4"${_scopeId}>`
                );
                _push2(
                  ssrRenderComponent(
                    unref(Notification),
                    {
                      enter: 'transform ease-out duration-300 transition',
                      'enter-from': 'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4',
                      'enter-to': 'translate-y-0 opacity-100 sm:translate-x-0',
                      leave: 'transition ease-in duration-500',
                      'leave-from': 'opacity-100',
                      'leave-to': 'opacity-0',
                      move: 'transition duration-500',
                      'move-delay': 'delay-300',
                    },
                    {
                      default: withCtx(({ notifications, close }, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`<!--[-->`);
                          ssrRenderList(notifications, notification => {
                            _push3(
                              `<div class="${ssrRenderClass([
                                notification.type === 'success'
                                  ? 'bg-green-100'
                                  : notification.type === 'error'
                                  ? 'bg-red-100'
                                  : 'bg-white dark:bg-gray-950',
                                'pointer-events-auto w-full max-w-[350px] overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5',
                              ])}"${_scopeId2}><div class="p-4"${_scopeId2}>`
                            );
                            if (notification.type === 'success') {
                              _push3(
                                `<div class="flex items-start text-green-600"${_scopeId2}><div class="shrink-0"${_scopeId2}><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId2}></path></svg></div><div class="ml-3 w-0 flex-1 pt-0.5"${_scopeId2}>`
                              );
                              if (notification.title) {
                                _push3(`<p class="mb-1 text-sm font-medium"${_scopeId2}>${ssrInterpolate(notification.title)}</p>`);
                              } else {
                                _push3(`<!---->`);
                              }
                              _push3(
                                `<p class="text-sm"${_scopeId2}>${
                                  notification.text ?? ''
                                }</p></div><div class="ml-4 flex shrink-0"${_scopeId2}><button type="button" class="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-0"${_scopeId2}><span class="sr-only"${_scopeId2}>${ssrInterpolate(
                                  _ctx.$t('Close')
                                )}</span><svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"${_scopeId2}><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"${_scopeId2}></path></svg></button></div></div>`
                              );
                            } else {
                              _push3(`<!---->`);
                            }
                            if (notification.type === 'error') {
                              _push3(
                                `<div class="flex items-start text-red-600"${_scopeId2}><div class="shrink-0"${_scopeId2}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"${_scopeId2}></path></svg></div><div class="ml-3 w-0 flex-1 pt-0.5"${_scopeId2}>`
                              );
                              if (notification.title) {
                                _push3(`<p class="mb-1 text-sm font-medium"${_scopeId2}>${ssrInterpolate(notification.title)}</p>`);
                              } else {
                                _push3(`<!---->`);
                              }
                              _push3(
                                `<p class="text-sm"${_scopeId2}>${
                                  notification.text ?? ''
                                }</p></div><div class="ml-4 flex shrink-0"${_scopeId2}><button type="button" class="inline-flex rounded-md text-gray-500 hover:text-gray-600 focus:outline-hidden focus:ring-0"${_scopeId2}><span class="sr-only"${_scopeId2}>${ssrInterpolate(
                                  _ctx.$t('Close')
                                )}</span><svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"${_scopeId2}><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"${_scopeId2}></path></svg></button></div></div>`
                              );
                            } else {
                              _push3(`<!---->`);
                            }
                            _push3(`</div></div>`);
                          });
                          _push3(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true),
                            createBlock(
                              Fragment,
                              null,
                              renderList(notifications, notification => {
                                return (
                                  openBlock(),
                                  createBlock(
                                    'div',
                                    {
                                      key: notification.id,
                                      class: [
                                        notification.type === 'success'
                                          ? 'bg-green-100'
                                          : notification.type === 'error'
                                          ? 'bg-red-100'
                                          : 'bg-white dark:bg-gray-950',
                                        'pointer-events-auto w-full max-w-[350px] overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5',
                                      ],
                                    },
                                    [
                                      createVNode('div', { class: 'p-4' }, [
                                        notification.type === 'success'
                                          ? (openBlock(),
                                            createBlock(
                                              'div',
                                              {
                                                key: 0,
                                                class: 'flex items-start text-green-600',
                                              },
                                              [
                                                createVNode('div', { class: 'shrink-0' }, [
                                                  (openBlock(),
                                                  createBlock(
                                                    'svg',
                                                    {
                                                      class: 'h-6 w-6',
                                                      fill: 'none',
                                                      viewBox: '0 0 24 24',
                                                      'stroke-width': '1.5',
                                                      stroke: 'currentColor',
                                                      'aria-hidden': 'true',
                                                    },
                                                    [
                                                      createVNode('path', {
                                                        'stroke-linecap': 'round',
                                                        'stroke-linejoin': 'round',
                                                        d: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                                                      }),
                                                    ]
                                                  )),
                                                ]),
                                                createVNode('div', { class: 'ml-3 w-0 flex-1 pt-0.5' }, [
                                                  notification.title
                                                    ? (openBlock(),
                                                      createBlock(
                                                        'p',
                                                        {
                                                          key: 0,
                                                          class: 'mb-1 text-sm font-medium',
                                                        },
                                                        toDisplayString(notification.title),
                                                        1
                                                      ))
                                                    : createCommentVNode('', true),
                                                  createVNode(
                                                    'p',
                                                    {
                                                      class: 'text-sm',
                                                      innerHTML: notification.text,
                                                    },
                                                    null,
                                                    8,
                                                    ['innerHTML']
                                                  ),
                                                ]),
                                                createVNode('div', { class: 'ml-4 flex shrink-0' }, [
                                                  createVNode(
                                                    'button',
                                                    {
                                                      type: 'button',
                                                      onClick: $event => close(notification.id),
                                                      class:
                                                        'inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-0',
                                                    },
                                                    [
                                                      createVNode('span', { class: 'sr-only' }, toDisplayString(_ctx.$t('Close')), 1),
                                                      (openBlock(),
                                                      createBlock(
                                                        'svg',
                                                        {
                                                          class: 'h-5 w-5',
                                                          viewBox: '0 0 20 20',
                                                          fill: 'currentColor',
                                                          'aria-hidden': 'true',
                                                        },
                                                        [
                                                          createVNode('path', {
                                                            d: 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z',
                                                          }),
                                                        ]
                                                      )),
                                                    ],
                                                    8,
                                                    ['onClick']
                                                  ),
                                                ]),
                                              ]
                                            ))
                                          : createCommentVNode('', true),
                                        notification.type === 'error'
                                          ? (openBlock(),
                                            createBlock(
                                              'div',
                                              {
                                                key: 1,
                                                class: 'flex items-start text-red-600',
                                              },
                                              [
                                                createVNode('div', { class: 'shrink-0' }, [
                                                  (openBlock(),
                                                  createBlock(
                                                    'svg',
                                                    {
                                                      xmlns: 'http://www.w3.org/2000/svg',
                                                      fill: 'none',
                                                      viewBox: '0 0 24 24',
                                                      'stroke-width': '1.5',
                                                      stroke: 'currentColor',
                                                      class: 'w-6 h-6',
                                                    },
                                                    [
                                                      createVNode('path', {
                                                        'stroke-linecap': 'round',
                                                        'stroke-linejoin': 'round',
                                                        d: 'm9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
                                                      }),
                                                    ]
                                                  )),
                                                ]),
                                                createVNode('div', { class: 'ml-3 w-0 flex-1 pt-0.5' }, [
                                                  notification.title
                                                    ? (openBlock(),
                                                      createBlock(
                                                        'p',
                                                        {
                                                          key: 0,
                                                          class: 'mb-1 text-sm font-medium',
                                                        },
                                                        toDisplayString(notification.title),
                                                        1
                                                      ))
                                                    : createCommentVNode('', true),
                                                  createVNode(
                                                    'p',
                                                    {
                                                      class: 'text-sm',
                                                      innerHTML: notification.text,
                                                    },
                                                    null,
                                                    8,
                                                    ['innerHTML']
                                                  ),
                                                ]),
                                                createVNode('div', { class: 'ml-4 flex shrink-0' }, [
                                                  createVNode(
                                                    'button',
                                                    {
                                                      type: 'button',
                                                      onClick: $event => close(notification.id),
                                                      class:
                                                        'inline-flex rounded-md text-gray-500 hover:text-gray-600 focus:outline-hidden focus:ring-0',
                                                    },
                                                    [
                                                      createVNode('span', { class: 'sr-only' }, toDisplayString(_ctx.$t('Close')), 1),
                                                      (openBlock(),
                                                      createBlock(
                                                        'svg',
                                                        {
                                                          class: 'h-5 w-5',
                                                          viewBox: '0 0 20 20',
                                                          fill: 'currentColor',
                                                          'aria-hidden': 'true',
                                                        },
                                                        [
                                                          createVNode('path', {
                                                            d: 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z',
                                                          }),
                                                        ]
                                                      )),
                                                    ],
                                                    8,
                                                    ['onClick']
                                                  ),
                                                ]),
                                              ]
                                            ))
                                          : createCommentVNode('', true),
                                      ]),
                                    ],
                                    2
                                  )
                                );
                              }),
                              128
                            )),
                          ];
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                );
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode(
                    'div',
                    { class: 'z-99 pointer-events-none fixed inset-0 flex items-start px-4 py-6 sm:p-6 lg:hidden print:hidden' },
                    [
                      createVNode('div', { class: 'flex w-full flex-col items-end space-y-4' }, [
                        createVNode(
                          unref(Notification),
                          {
                            enter: 'transform ease-out duration-300 transition',
                            'enter-from': 'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4',
                            'enter-to': 'translate-y-0 opacity-100 sm:translate-x-0',
                            leave: 'transition ease-in duration-500',
                            'leave-from': 'opacity-100',
                            'leave-to': 'opacity-0',
                            move: 'transition duration-500',
                            'move-delay': 'delay-300',
                          },
                          {
                            default: withCtx(({ notifications, close }) => [
                              (openBlock(true),
                              createBlock(
                                Fragment,
                                null,
                                renderList(notifications, notification => {
                                  return (
                                    openBlock(),
                                    createBlock(
                                      'div',
                                      {
                                        key: notification.id,
                                        class: [
                                          notification.type === 'success'
                                            ? 'bg-green-100'
                                            : notification.type === 'error'
                                            ? 'bg-red-100'
                                            : 'bg-white dark:bg-gray-950',
                                          'pointer-events-auto w-full max-w-[350px] overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5',
                                        ],
                                      },
                                      [
                                        createVNode('div', { class: 'p-4' }, [
                                          notification.type === 'success'
                                            ? (openBlock(),
                                              createBlock(
                                                'div',
                                                {
                                                  key: 0,
                                                  class: 'flex items-start text-green-600',
                                                },
                                                [
                                                  createVNode('div', { class: 'shrink-0' }, [
                                                    (openBlock(),
                                                    createBlock(
                                                      'svg',
                                                      {
                                                        class: 'h-6 w-6',
                                                        fill: 'none',
                                                        viewBox: '0 0 24 24',
                                                        'stroke-width': '1.5',
                                                        stroke: 'currentColor',
                                                        'aria-hidden': 'true',
                                                      },
                                                      [
                                                        createVNode('path', {
                                                          'stroke-linecap': 'round',
                                                          'stroke-linejoin': 'round',
                                                          d: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                                                        }),
                                                      ]
                                                    )),
                                                  ]),
                                                  createVNode('div', { class: 'ml-3 w-0 flex-1 pt-0.5' }, [
                                                    notification.title
                                                      ? (openBlock(),
                                                        createBlock(
                                                          'p',
                                                          {
                                                            key: 0,
                                                            class: 'mb-1 text-sm font-medium',
                                                          },
                                                          toDisplayString(notification.title),
                                                          1
                                                        ))
                                                      : createCommentVNode('', true),
                                                    createVNode(
                                                      'p',
                                                      {
                                                        class: 'text-sm',
                                                        innerHTML: notification.text,
                                                      },
                                                      null,
                                                      8,
                                                      ['innerHTML']
                                                    ),
                                                  ]),
                                                  createVNode('div', { class: 'ml-4 flex shrink-0' }, [
                                                    createVNode(
                                                      'button',
                                                      {
                                                        type: 'button',
                                                        onClick: $event => close(notification.id),
                                                        class:
                                                          'inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-0',
                                                      },
                                                      [
                                                        createVNode('span', { class: 'sr-only' }, toDisplayString(_ctx.$t('Close')), 1),
                                                        (openBlock(),
                                                        createBlock(
                                                          'svg',
                                                          {
                                                            class: 'h-5 w-5',
                                                            viewBox: '0 0 20 20',
                                                            fill: 'currentColor',
                                                            'aria-hidden': 'true',
                                                          },
                                                          [
                                                            createVNode('path', {
                                                              d: 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z',
                                                            }),
                                                          ]
                                                        )),
                                                      ],
                                                      8,
                                                      ['onClick']
                                                    ),
                                                  ]),
                                                ]
                                              ))
                                            : createCommentVNode('', true),
                                          notification.type === 'error'
                                            ? (openBlock(),
                                              createBlock(
                                                'div',
                                                {
                                                  key: 1,
                                                  class: 'flex items-start text-red-600',
                                                },
                                                [
                                                  createVNode('div', { class: 'shrink-0' }, [
                                                    (openBlock(),
                                                    createBlock(
                                                      'svg',
                                                      {
                                                        xmlns: 'http://www.w3.org/2000/svg',
                                                        fill: 'none',
                                                        viewBox: '0 0 24 24',
                                                        'stroke-width': '1.5',
                                                        stroke: 'currentColor',
                                                        class: 'w-6 h-6',
                                                      },
                                                      [
                                                        createVNode('path', {
                                                          'stroke-linecap': 'round',
                                                          'stroke-linejoin': 'round',
                                                          d: 'm9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
                                                        }),
                                                      ]
                                                    )),
                                                  ]),
                                                  createVNode('div', { class: 'ml-3 w-0 flex-1 pt-0.5' }, [
                                                    notification.title
                                                      ? (openBlock(),
                                                        createBlock(
                                                          'p',
                                                          {
                                                            key: 0,
                                                            class: 'mb-1 text-sm font-medium',
                                                          },
                                                          toDisplayString(notification.title),
                                                          1
                                                        ))
                                                      : createCommentVNode('', true),
                                                    createVNode(
                                                      'p',
                                                      {
                                                        class: 'text-sm',
                                                        innerHTML: notification.text,
                                                      },
                                                      null,
                                                      8,
                                                      ['innerHTML']
                                                    ),
                                                  ]),
                                                  createVNode('div', { class: 'ml-4 flex shrink-0' }, [
                                                    createVNode(
                                                      'button',
                                                      {
                                                        type: 'button',
                                                        onClick: $event => close(notification.id),
                                                        class:
                                                          'inline-flex rounded-md text-gray-500 hover:text-gray-600 focus:outline-hidden focus:ring-0',
                                                      },
                                                      [
                                                        createVNode('span', { class: 'sr-only' }, toDisplayString(_ctx.$t('Close')), 1),
                                                        (openBlock(),
                                                        createBlock(
                                                          'svg',
                                                          {
                                                            class: 'h-5 w-5',
                                                            viewBox: '0 0 20 20',
                                                            fill: 'currentColor',
                                                            'aria-hidden': 'true',
                                                          },
                                                          [
                                                            createVNode('path', {
                                                              d: 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z',
                                                            }),
                                                          ]
                                                        )),
                                                      ],
                                                      8,
                                                      ['onClick']
                                                    ),
                                                  ]),
                                                ]
                                              ))
                                            : createCommentVNode('', true),
                                        ]),
                                      ],
                                      2
                                    )
                                  );
                                }),
                                128
                              )),
                            ]),
                            _: 1,
                          }
                        ),
                      ]),
                    ]
                  ),
                ];
              }
            }),
            _: 1,
          },
          _parent
        )
      );
      _push(`</div>`);
    };
  },
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Layouts/AppLayout.vue');
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
function shortcuts(e2) {
  if (e2.ctrlKey && e2.shiftKey) {
    switch (e2.code) {
      case 'KeyS':
        router.visit(T('sales.index'));
        break;
      case 'KeyC':
        router.visit(T('customers.index'));
        break;
    }
  } else if (e2.ctrlKey && e2.altKey) {
    switch (e2.code) {
      case 'KeyX':
        router.visit(T('pos'));
        break;
      case 'KeyS':
        router.visit(T('sales.create'));
        break;
      case 'KeyC':
        router.visit(T('customers.index', { create: true }));
        break;
    }
  }
}
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(
    `<header${ssrRenderAttrs(
      mergeProps(
        { class: 'flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 lg:px-8' },
        _attrs
      )
    )}><div><h1 class="text-base font-semibold leading-7 text-focus">`
  );
  ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
  _push(`</h1><p class="mt-0.5 text-sm text-mute">`);
  ssrRenderSlot(_ctx.$slots, 'subheading', {}, null, _push, _parent);
  _push(`</p></div><div class="z-1">`);
  ssrRenderSlot(_ctx.$slots, 'menu', {}, null, _push, _parent);
  _push(`</div></header>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Layouts/Components/Header.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main, [['ssrRender', _sfc_ssrRender]]);
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
        const page2 = resolvePageComponent(
          `./Pages/${name}.vue`,
          /* @__PURE__ */ Object.assign({
            './Pages/API/Index.vue': () => import('./assets/Index-DJ-dznd3.js'),
            './Pages/API/Partials/ApiTokenManager.vue': () => import('./assets/ApiTokenManager-C-MX3InH.js'),
            './Pages/Auth/ConfirmPassword.vue': () => import('./assets/ConfirmPassword-BcpuFXsK.js'),
            './Pages/Auth/ForgotPassword.vue': () => import('./assets/ForgotPassword-BNRvuavQ.js'),
            './Pages/Auth/Login.vue': () => import('./assets/Login-AXZ2EZ_Y.js'),
            './Pages/Auth/Register.vue': () => import('./assets/Register-CMcoyNgk.js'),
            './Pages/Auth/ResetPassword.vue': () => import('./assets/ResetPassword-C3WLu8eM.js'),
            './Pages/Auth/TwoFactorChallenge.vue': () => import('./assets/TwoFactorChallenge-DTXa0zAe.js'),
            './Pages/Auth/VerifyEmail.vue': () => import('./assets/VerifyEmail-CtB6O0OM.js'),
            './Pages/Error.vue': () => import('./assets/Error-BgpYFatY.js'),
            './Pages/PrivacyPolicy.vue': () => import('./assets/PrivacyPolicy-BvnZi5TG.js'),
            './Pages/Profile/Partials/DeleteUserForm.vue': () => import('./assets/DeleteUserForm-C7JG_0fF.js'),
            './Pages/Profile/Partials/LogoutOtherBrowserSessionsForm.vue': () =>
              import('./assets/LogoutOtherBrowserSessionsForm-o_qfMVl6.js'),
            './Pages/Profile/Partials/TwoFactorAuthenticationForm.vue': () => import('./assets/TwoFactorAuthenticationForm-aoC_UpRw.js'),
            './Pages/Profile/Partials/UpdatePasswordForm.vue': () => import('./assets/UpdatePasswordForm-D97Iyzys.js'),
            './Pages/Profile/Partials/UpdateProfileInformationForm.vue': () => import('./assets/UpdateProfileInformationForm-PQhlNBxc.js'),
            './Pages/Profile/Show.vue': () => import('./assets/Show-CT42I39s.js'),
            './Pages/Sma/Dashboard.vue': () => import('./assets/Dashboard-BO6BEpgK.js'),
            './Pages/Sma/Order/Delivery/Form.vue': () => import('./assets/Form--CBH6ALC.js'),
            './Pages/Sma/Order/Delivery/Index.vue': () => import('./assets/Index-aiu2kz0s.js'),
            './Pages/Sma/Order/Delivery/QuickView.vue': () => import('./assets/QuickView-DAY0DfLO.js'),
            './Pages/Sma/Order/Expense/Form.vue': () => import('./assets/Form-xZxtHkpJ.js'),
            './Pages/Sma/Order/Expense/Index.vue': () => import('./assets/Index-CBTYl5sC.js'),
            './Pages/Sma/Order/Expense/QuickView.vue': () => import('./assets/QuickView-Bc6oCEIa.js'),
            './Pages/Sma/Order/GiftCard/Form.vue': () => import('./assets/Form-rDEzNQl-.js'),
            './Pages/Sma/Order/GiftCard/Index.vue': () => import('./assets/Index-W-OFLTKQ.js'),
            './Pages/Sma/Order/GiftCard/Logs.vue': () => import('./assets/Logs-B2hYajMR.js'),
            './Pages/Sma/Order/GiftCard/Topup.vue': () => import('./assets/Topup-3-Rik0Q4.js'),
            './Pages/Sma/Order/Payment/Form.vue': () => import('./assets/Form-BCQRFeH7.js'),
            './Pages/Sma/Order/Payment/Index.vue': () => import('./assets/Index-CjyV6utW.js'),
            './Pages/Sma/Order/Payment/QuickView.vue': () => import('./assets/QuickView-D7YYWOEb.js'),
            './Pages/Sma/Order/Payment/View.vue': () => import('./assets/View-BxFieues.js'),
            './Pages/Sma/Order/Purchase/Form.vue': () => import('./assets/Form-B8ghX9Gf.js'),
            './Pages/Sma/Order/Purchase/Index.vue': () => import('./assets/Index-nI81maRY.js'),
            './Pages/Sma/Order/Purchase/QuickView.vue': () => import('./assets/QuickView-GEydL5q8.js'),
            './Pages/Sma/Order/Purchase/View.vue': () => import('./assets/View-1yy5Ptfz.js'),
            './Pages/Sma/Order/Quotation/Form.vue': () => import('./assets/Form-y-YUhI9r.js'),
            './Pages/Sma/Order/Quotation/Index.vue': () => import('./assets/Index-D-lX0t49.js'),
            './Pages/Sma/Order/Quotation/QuickView.vue': () => import('./assets/QuickView-CBxc-fJI.js'),
            './Pages/Sma/Order/Quotation/View.vue': () => import('./assets/View-DNAd9qNK.js'),
            './Pages/Sma/Order/ReturnOrder/Form.vue': () => import('./assets/Form-PX8vtFlW.js'),
            './Pages/Sma/Order/ReturnOrder/Index.vue': () => import('./assets/Index-CUEeTDtr.js'),
            './Pages/Sma/Order/ReturnOrder/QuickView.vue': () => import('./assets/QuickView-BasT5Y77.js'),
            './Pages/Sma/Order/ReturnOrder/View.vue': () => import('./assets/View-Ddg9SQ9J.js'),
            './Pages/Sma/Order/Sale/Form.vue': () => import('./assets/Form-BGlrkJIo.js'),
            './Pages/Sma/Order/Sale/Index.vue': () => import('./assets/Index-IX49p7Ix.js'),
            './Pages/Sma/Order/Sale/PackingList.vue': () => import('./assets/PackingList-C9mXAwnN.js'),
            './Pages/Sma/Order/Sale/QuickView.vue': () => import('./assets/QuickView-Dy04rE6X.js'),
            './Pages/Sma/Order/Sale/View.vue': () => import('./assets/View-DY1qvNd1.js'),
            './Pages/Sma/People/Address/Form.vue': () => import('./assets/Form-6dKScl9_.js'),
            './Pages/Sma/People/Address/Index.vue': () => import('./assets/Index-sPc0BpFW.js'),
            './Pages/Sma/People/Customer/Form.vue': () => import('./assets/Form-CLSdENlm.js'),
            './Pages/Sma/People/Customer/Import.vue': () => import('./assets/Import-BkfqMeJn.js'),
            './Pages/Sma/People/Customer/Index.vue': () => import('./assets/Index-CCB89LU-.js'),
            './Pages/Sma/People/Customer/Statement.vue': () => import('./assets/Statement-TqjGlGQA.js'),
            './Pages/Sma/People/Customer/View.vue': () => import('./assets/View-Bdd3sfrE.js'),
            './Pages/Sma/People/CustomerGroup/Form.vue': () => import('./assets/Form-Ck4FvKEa.js'),
            './Pages/Sma/People/CustomerGroup/Index.vue': () => import('./assets/Index-DG0o1mme.js'),
            './Pages/Sma/People/PriceGroup/Form.vue': () => import('./assets/Form-BQhgB2PW.js'),
            './Pages/Sma/People/PriceGroup/Index.vue': () => import('./assets/Index-CSxXzhSn.js'),
            './Pages/Sma/People/Role/Form.vue': () => import('./assets/Form-DU-dNh79.js'),
            './Pages/Sma/People/Role/Index.vue': () => import('./assets/Index-D54phhqu.js'),
            './Pages/Sma/People/Supplier/Form.vue': () => import('./assets/Form-B2Srk7Ly.js'),
            './Pages/Sma/People/Supplier/Import.vue': () => import('./assets/Import-BKRfqk7X.js'),
            './Pages/Sma/People/Supplier/Index.vue': () => import('./assets/Index-CNyElmvd.js'),
            './Pages/Sma/People/Supplier/Statement.vue': () => import('./assets/Statement-CE0t5NEh.js'),
            './Pages/Sma/People/Supplier/View.vue': () => import('./assets/View-VDjp7Iye.js'),
            './Pages/Sma/People/User/Form.vue': () => import('./assets/Form-CtS6Nn7_.js'),
            './Pages/Sma/People/User/Index.vue': () => import('./assets/Index-DtIT79oj.js'),
            './Pages/Sma/People/User/View.vue': () => import('./assets/View-D1Hl487B.js'),
            './Pages/Sma/Pos/Components/AddGiftCard.vue': () => import('./assets/AddGiftCard-CetlmWQe.js'),
            './Pages/Sma/Pos/Components/FinalizeSale.vue': () => import('./assets/FinalizeSale-Wa9_I0ZU.js'),
            './Pages/Sma/Pos/Components/FormActions.vue': () => import('./assets/FormActions-Bdpoth1W.js'),
            './Pages/Sma/Pos/Components/FormItem.vue': () => import('./assets/FormItem-DUtTmGPS.js'),
            './Pages/Sma/Pos/Components/OpenOrder.vue': () => import('./assets/OpenOrder-DpEEIgO5.js'),
            './Pages/Sma/Pos/Components/OpenRegister.vue': () => import('./assets/OpenRegister-DJzQ0I-J.js'),
            './Pages/Sma/Pos/Components/OrderDiscount.vue': () => import('./assets/OrderDiscount-BMFqKitT.js'),
            './Pages/Sma/Pos/Components/OrderSummary.vue': () => import('./assets/OrderSummary-B6dWEyEN.js'),
            './Pages/Sma/Pos/Components/PrintBill.vue': () => import('./assets/PrintBill-BH8QHiVB.js'),
            './Pages/Sma/Pos/Components/PrintOrder.vue': () => import('./assets/PrintOrder-DBaayrTI.js'),
            './Pages/Sma/Pos/Components/PrintReceipt.vue': () => import('./assets/PrintReceipt-a3bgkM4s.js'),
            './Pages/Sma/Pos/Components/RegisterDetails.vue': () => import('./assets/RegisterDetails-DyPDMwow.js'),
            './Pages/Sma/Pos/Components/ShowOrders.vue': () => import('./assets/ShowOrders-DE4JNQ06.js'),
            './Pages/Sma/Pos/Components/UpdateFormItem.vue': () => import('./assets/UpdateFormItem-D65J69Uo.js'),
            './Pages/Sma/Pos/Modern.vue': () => import('./assets/Modern-BunCs0Zc.js'),
            './Pages/Sma/Pos/Orders.vue': () => import('./assets/Orders-Blbwqj2X.js'),
            './Pages/Sma/Pos/RegistersReport.vue': () => import('./assets/RegistersReport-EcGJPz8j.js'),
            './Pages/Sma/Pos/Setting.vue': () => import('./assets/Setting-CFREarCT.js'),
            './Pages/Sma/Pos/Simple.vue': () => import('./assets/Simple-CpFUso9w.js'),
            './Pages/Sma/Product/Adjustment/Form.vue': () => import('./assets/Form-BKeGKoWt.js'),
            './Pages/Sma/Product/Adjustment/Index.vue': () => import('./assets/Index-X57K0C9w.js'),
            './Pages/Sma/Product/Adjustment/QuickView.vue': () => import('./assets/QuickView-CS3ROaba.js'),
            './Pages/Sma/Product/Brand/Form.vue': () => import('./assets/Form-CBwr8Alv.js'),
            './Pages/Sma/Product/Brand/Import.vue': () => import('./assets/Import-DZeKFS8w.js'),
            './Pages/Sma/Product/Brand/Index.vue': () => import('./assets/Index-DM6_51-3.js'),
            './Pages/Sma/Product/Category/Form.vue': () => import('./assets/Form-9JRXHJMI.js'),
            './Pages/Sma/Product/Category/Import.vue': () => import('./assets/Import-WSsqSr2H.js'),
            './Pages/Sma/Product/Category/Index.vue': () => import('./assets/Index-DBM8Gfn-.js'),
            './Pages/Sma/Product/Form.vue': () => import('./assets/Form-CrXBrtJJ.js'),
            './Pages/Sma/Product/Import.vue': () => import('./assets/Import-G3JbPxc5.js'),
            './Pages/Sma/Product/Index.vue': () => import('./assets/Index-CFRbCHaJ.js'),
            './Pages/Sma/Product/Label.vue': () => import('./assets/Label-CuBmF1ra.js'),
            './Pages/Sma/Product/Promotion/Form.vue': () => import('./assets/Form-Bs8t33ak.js'),
            './Pages/Sma/Product/Promotion/Index.vue': () => import('./assets/Index-B9aoMPmB.js'),
            './Pages/Sma/Product/QuickView.vue': () => import('./assets/QuickView-DPN7KCGx.js'),
            './Pages/Sma/Product/StockCount/Form.vue': () => import('./assets/Form-DrnXSnDf.js'),
            './Pages/Sma/Product/StockCount/Index.vue': () => import('./assets/Index-HY3Duovp.js'),
            './Pages/Sma/Product/StockCount/QuickView.vue': () => import('./assets/QuickView-DMlLxZ2w.js'),
            './Pages/Sma/Product/Track.vue': () => import('./assets/Track-cVtmt6ru.js'),
            './Pages/Sma/Product/Transfer/Form.vue': () => import('./assets/Form-BpjU-wga.js'),
            './Pages/Sma/Product/Transfer/Index.vue': () => import('./assets/Index-C0lMPHW9.js'),
            './Pages/Sma/Product/Transfer/QuickView.vue': () => import('./assets/QuickView-DS2ynpPU.js'),
            './Pages/Sma/Product/Transfer/View.vue': () => import('./assets/View-DMQlfNfk.js'),
            './Pages/Sma/Product/Unit/Form.vue': () => import('./assets/Form-DD8gR9nh.js'),
            './Pages/Sma/Product/Unit/Index.vue': () => import('./assets/Index-xNSym43p.js'),
            './Pages/Sma/Report/Adjustment.vue': () => import('./assets/Adjustment-dhGrE1JU.js'),
            './Pages/Sma/Report/Brand.vue': () => import('./assets/Brand-DNtXY37a.js'),
            './Pages/Sma/Report/Category.vue': () => import('./assets/Category-BtAd0x4f.js'),
            './Pages/Sma/Report/Customer.vue': () => import('./assets/Customer-CZuIpyAN.js'),
            './Pages/Sma/Report/DailySales.vue': () => import('./assets/DailySales-D0pCx3Ba.js'),
            './Pages/Sma/Report/Expense.vue': () => import('./assets/Expense-BunrkPaJ.js'),
            './Pages/Sma/Report/Form.vue': () => import('./assets/Form-CTgEQL9e.js'),
            './Pages/Sma/Report/MonthlySales.vue': () => import('./assets/MonthlySales-BOPv8ozn.js'),
            './Pages/Sma/Report/Payment.vue': () => import('./assets/Payment-DPCtT_Sj.js'),
            './Pages/Sma/Report/Product.vue': () => import('./assets/Product-DggS-eIr.js'),
            './Pages/Sma/Report/Purchase.vue': () => import('./assets/Purchase-2E7MElhE.js'),
            './Pages/Sma/Report/ReturnOrder.vue': () => import('./assets/ReturnOrder-Ce6ZfIbn.js'),
            './Pages/Sma/Report/Sale.vue': () => import('./assets/Sale-CiBweKeF.js'),
            './Pages/Sma/Report/Staff.vue': () => import('./assets/Staff-CJMAgHfW.js'),
            './Pages/Sma/Report/Supplier.vue': () => import('./assets/Supplier-DxgiMwz5.js'),
            './Pages/Sma/Report/Transfer.vue': () => import('./assets/Transfer-DZZH3ocU.js'),
            './Pages/Sma/Setting/Account/Form.vue': () => import('./assets/Form-D5Vr2Dzc.js'),
            './Pages/Sma/Setting/Account/Index.vue': () => import('./assets/Index-B-6p6SvO.js'),
            './Pages/Sma/Setting/CustomField/Form.vue': () => import('./assets/Form-B8qqJcye.js'),
            './Pages/Sma/Setting/CustomField/Index.vue': () => import('./assets/Index-BJlNiuoF.js'),
            './Pages/Sma/Setting/Index.vue': () => import('./assets/Index-DwLc9a7k.js'),
            './Pages/Sma/Setting/Mail.vue': () => import('./assets/Mail-d6pl6fj9.js'),
            './Pages/Sma/Setting/Payment.vue': () => import('./assets/Payment-DVbGW3sU.js'),
            './Pages/Sma/Setting/ScaleBarcode.vue': () => import('./assets/ScaleBarcode-j68CqFuN.js'),
            './Pages/Sma/Setting/ScaleBarcodeDrawer.vue': () => import('./assets/ScaleBarcodeDrawer-CuIyRfLg.js'),
            './Pages/Sma/Setting/Store/Form.vue': () => import('./assets/Form-CmiI3vFU.js'),
            './Pages/Sma/Setting/Store/Index.vue': () => import('./assets/Index-BAdn7DJU.js'),
            './Pages/Sma/Setting/Tax/Form.vue': () => import('./assets/Form-B9kDiZXV.js'),
            './Pages/Sma/Setting/Tax/Index.vue': () => import('./assets/Index-DrFpe9_i.js'),
            './Pages/TermsOfService.vue': () => import('./assets/TermsOfService-ryqw0vQC.js'),
            './Pages/Welcome.vue': () => import('./assets/Welcome-BX203uce.js'),
          })
        );
        page2.then(p2 => {
          var _a;
          p2.default.layout = ((_a = p2.default) == null ? void 0 : _a.layout) || _sfc_main$1;
        });
        return page2;
      },
      setup({ App, props, plugin }) {
        router.on('success', event => {
          var _a, _b;
          if ((_a = event.detail.page.props.flash) == null ? void 0 : _a.message) {
            notify({
              group: 'main',
              type: 'success',
              title: 'Success!',
              text: event.detail.page.props.flash.message,
            });
          }
          if ((_b = event.detail.page.props.flash) == null ? void 0 : _b.error) {
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
            5e3
          );
        });
        return createSSRApp({
          render: () => h$1(App, props),
          mounted: () => {
            setTimeout(() => {
              document.addEventListener('keyup', shortcuts);
              document.getElementById('app-loading').style.display = 'none';
            }, 250);
          },
          beforeDestroy() {
            document.removeEventListener('keyup', shortcuts);
          },
        })
          .use(i18n)
          .use(plugin)
          .use(k)
          .mixin(mixin)
          .use(Notifications$1)
          .component('Head', Head)
          .component('Icon', _sfc_main$2)
          .component('Link', Link)
          .component('Header', Header);
      },
    }),
  13715
);
export {
  $currency as $,
  AuthenticationCard as A,
  _sfc_main$p as B,
  _sfc_main$e as C,
  _sfc_main$b as D,
  _sfc_main$7 as E,
  _sfc_main$g as F,
  _sfc_main$5 as G,
  $random as H,
  _sfc_main$q as I,
  _sfc_main$u as J,
  $can as K,
  LANGUAGES as L,
  _sfc_main$o as M,
  ApplicationLogo as N,
  _sfc_main$9 as O,
  $address as P,
  _sfc_main$l as Q,
  _sfc_main$3 as R,
  SectionBorder as S,
  T,
  $decimal as U,
  _sfc_main$i as V,
  calculate_item as W,
  convert_to_base_unit as X,
  discount_keypress as Y,
  check_promotions as Z,
  _sfc_main$1 as _,
  _sfc_main$t as a,
  _sfc_main$6 as a0,
  _sfc_main$4 as a1,
  _sfc_main$a as a2,
  useClickOutside as a3,
  _sfc_main$h as a4,
  ApplicationMark as a5,
  $number as a6,
  chunkArray as a7,
  $datetime as a8,
  _sfc_main$M as b,
  _sfc_main$A as c,
  _sfc_main$s as d,
  _sfc_main$y as e,
  _sfc_main$B as f,
  _sfc_main$F as g,
  _sfc_main$K as h,
  _sfc_main$C as i,
  _sfc_main$z as j,
  _sfc_main$D as k,
  _sfc_main$w as l,
  _sfc_main$n as m,
  _sfc_main$G as n,
  _sfc_main$x as o,
  axios$1 as p,
  _sfc_main$d as q,
  _sfc_main$j as r,
  _sfc_main$8 as s,
  _sfc_main$v as t,
  _sfc_main$k as u,
  _sfc_main$c as v,
  _sfc_main$E as w,
  _sfc_main$m as x,
  $extras as y,
  _sfc_main$f as z,
};
