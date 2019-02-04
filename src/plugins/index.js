import Vue from 'vue'

import system from '@/plugins/system'
import messaging from '@/plugins/messaging'
import crm from '@/plugins/crm'
import logger from '@/plugins/logger'

Vue.use(logger)
Vue.use(system)
Vue.use(crm)
Vue.use(messaging)
