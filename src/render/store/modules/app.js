import IPC from '@/util/IPC.js'
const { getGlobal } = require('@electron/remote')
const application = getGlobal('application')
const state = {
  stat: {
    nginx: false,
    php: false,
    mysql: false,
    apache: false,
    memcached: false,
    redis: false
  },
  hosts: [],
  config: {
    server: {
      nginx: {
        current: {}
      },
      php: {
        current: {}
      },
      mysql: {
        current: {}
      },
      apache: {
        current: {}
      },
      memcached: {
        current: {}
      },
      redis: {
        current: {}
      }
    },
    password: '',
    setup: {
      common: {
        showItem: {
          Hosts: true,
          Nginx: true,
          Apache: true,
          Mysql: true,
          Php: true,
          Memcached: true,
          Redis: true,
          NodeJS: true,
          Tools: true
        }
      },
      nginx: {
        dirs: []
      },
      apache: {
        dirs: []
      },
      mysql: {
        dirs: []
      },
      php: {
        dirs: []
      },
      memcached: {
        dirs: []
      },
      redis: {
        dirs: []
      }
    }
  }
}
const getters = {
  stat: (state) => state.stat,
  hosts: (state) => state.hosts,
  config: (state) => state.config,
  server: (state) => state.config?.server ?? {},
  password: (state) => state.config?.password ?? '',
  setup: (state) => state.config?.setup ?? {}
}

const mutations = {
  UPDATE_SERVER_STAT(state, stat) {
    state.stat = { ...state.stat, ...stat }
  },
  UPDATE_HOSTS(state, hosts) {
    state.hosts.splice(0)
    state.hosts.push(...hosts)
  },
  INIT_CONFIG(state, obj) {
    state.config = obj
  },
  SET_CUSTOM_DIR(state, { typeFlag, dir, index }) {
    const common = state.config.setup[typeFlag]
    const dirs = JSON.parse(JSON.stringify(common.dirs))
    if (index !== undefined) {
      dirs[index] = dir
    } else {
      dirs.push(dir)
    }
    common.dirs = dirs
  },
  DEL_CUSTOM_DIR(state, { typeFlag, index }) {
    const common = state.config.setup[typeFlag]
    const dirs = JSON.parse(JSON.stringify(common.dirs))
    dirs.splice(index, 1)
    common.dirs = dirs
  }
}
const actions = {
  updateServerStat({ commit }, stat) {
    commit('UPDATE_SERVER_STAT', stat)
  },
  updateHosts({ commit }, hosts) {
    commit('UPDATE_HOSTS', hosts)
  },
  initHost({ commit }) {
    IPC.send('app-fork:host', 'hostList').then((key, res) => {
      IPC.off(key)
      if (res?.hosts) {
        commit('UPDATE_HOSTS', res.hosts)
      }
    })
  },
  initConfig({ commit }) {
    const config = application.configManager.getConfig()
    if (!config.password) {
      config.password = ''
    }
    if (!config.server.memcached) {
      config.server.memcached = {
        current: {}
      }
    }
    if (!config.server.redis) {
      config.server.redis = {
        current: {}
      }
    }
    commit('INIT_CONFIG', {
      server: config.server,
      password: config.password,
      setup: config.setup
    })
  },
  saveConfig({ state }) {
    const args = JSON.parse(
      JSON.stringify({
        server: state.config.server,
        password: state.config.password,
        setup: state.config.setup
      })
    )
    IPC.send('application:save-preference', args)
  }
}
export default { state, getters, mutations, actions }