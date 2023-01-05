/** CRC Types */
/**
 * @typedef {object} CRCconfig
 * @property {object} [resources]
 * @property {object} [resources.instance]
 * @property {object} [blocks]
 * @property {object} [blocks.info]
 * @property {array} [blocks.info.labels]
 * @property {string} [blocks.info.init_type="called"] generate or not the PPP init code, call it or not at boot
 * @property {array} [blocks.configs]
 */

/** System Types */
/**
 * @typedef {object} SystemConfig
 * @property {object} [blocks]
 * @property {array} [blocks.configs]
 */

/** Tim Types */
/**
 * @typedef {object} TimConfig
 * @property {object} [resources]
 * @property {object} [resources.instance]
 * @property {object} [blocks]
 * @property {object} [blocks.info]
 * @property {array} [blocks.info.labels]
 * @property {string} [blocks.info.init_type="called"] generate or not the PPP init code, call it or not at boot
 * @property {array} [blocks.configs]
 */

/** UART types */
/**
 * @typedef {object} UARTConfig
 * @property {object} [resources]
 * @property {object} [resources.instance]
 * @property {object} [blocks]
 * @property {object} [blocks.info]
 * @property {array} [blocks.info.labels]
 * @property {string} [blocks.info.init_type="called"] generate or not the PPP init code, call it or not at boot
 * @property {string} [blocks.info.function="Disabled"]
 * @property {array} [blocks.configs]
 */

export {}