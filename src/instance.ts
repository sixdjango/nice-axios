import { AjaxContainer } from './container'
import { addCancelerPlugin, removeCancelerPlugin } from './plugins/ajaxCanceler'
import { mergeRequestPlugin } from './plugins/mergeRequestPlugin'
import { buildAfterPlugin, buildBeforePlugin } from '.'
import type { AjaxPluginFullConfig, NiceAxiosOptions } from '.'

let instance: AjaxContainer

// step 20

const getDefaultPlugins = (options?: NiceAxiosOptions) => {
  return [
    // 越小越前面

    // pre plugins
    { desc: '添加当前 Ajax 请求的手动取消功能：应该在所有插件中的第一个', order: -1040, executor: addCancelerPlugin },
    { desc: '合并请求', order: -1020, executor: mergeRequestPlugin },
    {
      desc: '基础业务前置插件',
      order: -1000,
      executor: buildBeforePlugin(options),
    },

    // order 越大，越早被执行
    // post plugins
    { desc: '通用后置逻辑', order: 1000, executor: buildAfterPlugin(options) },
    { desc: '移除当前请求的手动取消功能：应该在所有插件中的最后一个', order: 0, executor: removeCancelerPlugin },

  ]
}

/**
 * the plugin's order ,not more than -1000 ~ 1000 range and step length of 20
 *   // 越小越前面

  // pre plugins
  { desc: '添加当前 Ajax 请求的手动取消功能：应该在所有插件中的第一个', order: -1040, executor: addCancelerPlugin },
  { desc: '合并请求', order: -1020, executor: mergeRequestPlugin },
  {
    desc: '基础业务前置插件',
    order: -1000,
    executor: buildBeforePlugin,
  },

  // order 越大，越早被执行
  // post plugins
  { desc: '通用后置逻辑', order: 1000, executor: buildAfterPlugin },
  { desc: '移除当前请求的手动取消功能：应该在所有插件中的最后一个', order: 0, executor: removeCancelerPlugin },
 * @param customPlugins
 * @param options
 * @returns
 */
export const createNiceAxios = (customPlugins: AjaxPluginFullConfig[] = [], options?: NiceAxiosOptions) => {
  instance = new AjaxContainer([...getDefaultPlugins(options), ...customPlugins])
  return instance
}

/**
 * get nice_axios instance
 * @returns
 */
export const getNiceAxiosInstance = (customPlugins: AjaxPluginFullConfig[] = [], options?: NiceAxiosOptions) => {
  if (!instance)
    instance = createNiceAxios(customPlugins, options)

  return instance
}

