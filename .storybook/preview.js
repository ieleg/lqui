import Vue from "vue"
import ElementUI from "element-ui"

import "element-ui/lib/theme-chalk/index.css"
Vue.use(ElementUI)
import Drag from "../src/directive/drag.js"
import EventLimit from "../src/directive/eventLimit"
import VueCompositionAPI from "@vue/composition-api"

Vue.use(EventLimit)
Vue.use(Drag)
Vue.use(VueCompositionAPI)

export const parameters = {
  layout: "centered",
  controls: { expanded: true },
  docs: {
    inlineStories: true
  }
}

// export const globalTypes = {
//   locale: {
//     name: 'Locale',
//     description: 'Internationalization locale',
//     defaultValue: 'en',
//     toolbar: {
//       icon: 'globe',
//       items: [
//         { value: 'en', right: '🇺🇸', title: 'English' },
//         { value: 'ru', right: '🇷🇺', title: 'Русский' }
//       ]
//     }
//   }
// };

export const decorators = [
  args => ({
    beforeCreate: function () {},
    template: "<story />"
  })
]
