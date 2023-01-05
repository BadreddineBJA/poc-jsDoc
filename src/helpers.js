const Types  = require('./types');

/**
 * @param {Types.UARTConfig} uartConfig
 */
function uart_helper(uartConfig)
{
    let resources = uartConfig.resources;
    let instance  = uartConfig.resources.instance;
    let infos = uartConfig.blocks.configs;
    console.log(`UART: ${resources} ${instance} ${infos}`);
};

/**
 * @param {Types.CRCconfig} crcConfig
 */
function crc_helper(crcConfig)
{
    let resources = crcConfig.resources;
    let init_type  = crcConfig.blocks.info.init_type;
    let configs = crcConfig.blocks.configs;
    console.log(`CRC: ${resources} ${init_type} ${configs}`);
};

/**
 * @param {Types.SystemConfig} systemConfig
 */
function system_helper(systemConfig)
{
    let blocks = systemConfig.blocks.configs;
    let configs = systemConfig.blocks.configs;
    console.log(`System: ${blocks} ${configs}`);
};

/**
 * @param {Types.TimConfig} timConfig
 */
function tim_helper(timConfig)
{
    let labels = timConfig.blocks.info.labels;
    let instance = timConfig.resources.instance;
    console.log(`System: ${labels} ${instance}`);
};