import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { isFunction } from 'lodash-es'
import type {
  AjaxAgent,
  NiceAxiosConfig,
  AjaxExecutor,
  NiceAxiosPlugin,
  AjaxResponse,
  ComposeResult
} from './types'
import { compose } from './utils/compose'

export { axios }

const getOrder = (plugin: NiceAxiosPlugin) => (isFunction(plugin) ? 0 : plugin.order)

export const fetch = (defaultAction: AjaxExecutor, plugins: NiceAxiosPlugin[]): AjaxAgent => {
  // 缓存执行器
  let cachedExecutor: (config: NiceAxiosConfig) => ComposeResult<AjaxResponse>
  return {
    add(list) {
      if (!list.length) return this

      return fetch(defaultAction, plugins.concat(list))
    },
    async attach(callback) {
      const newPlugins = new Promise<NiceAxiosPlugin[]>((resolve, reject) => {
        try {
          resolve(callback(plugins))
        } catch (e) {
          reject(e)
        }
      })
      const list = await newPlugins
      return fetch(defaultAction, list)
    },
    exec(args) {
      if (!cachedExecutor) {
        const list = plugins.concat([])
        // 默认升序 1,2,4,5,6
        list.sort((x, y) => getOrder(x) - getOrder(y))

        const data = list.map((v) => (isFunction(v) ? v : v.executor))

        cachedExecutor = compose(defaultAction, ...data).exec
      }

      return new Promise<AjaxResponse>((resolve, reject) => {
        try {
          resolve(cachedExecutor(args))
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}

/**
 * ajax高阶函数
 * @param plugins
 * @returns
 */
export const ajax = (plugins: NiceAxiosPlugin[]): AjaxAgent =>
  fetch(
    (config) => axios(config as AxiosRequestConfig).then((v) => ({ ...v, config }) as AjaxResponse),
    plugins
  )
