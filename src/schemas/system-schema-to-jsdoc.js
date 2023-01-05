const jsdoc = require("json-schema-to-jsdoc");
const fs = require("fs");
const path = require("path");

const systemSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  componentid: "::Device:$FAMILYNAME_UC$ HAL Code Gen:System Init",
  type: "object",
  additionalProperties: false,
  properties: {
    blocks: {
      type: "object",
      additionalProperties: false,
      properties: {
        configs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              cfg_name: {
                type: "string",
                title: "Config name",
                description: "name of the configuration",
                minLength: 0,
                maxLength: 9,
                default: "",
              },
              vdd_value: {
                type: "integer",
                description: "Value of VDD in mv",
                minimum: 0,
                maximum: 3300,
                default: 3300,
              },
              tick_init_priority: {
                type: "string",
                description: "tick interrupt priority (lowest by default)",
                default: "((1UL<<__NVIC_PRIO_BITS) - 1UL)",
              },
              prefetch_enable: {
                type: "boolean",
                description: "Use prefetch",
                default: false,
              },
              use_spi_crc: {
                type: "boolean",
                description:
                  "Use to activate CRC feature inside HAL SPI Driver",
                default: false,
              },
              use_sd_transmitter: {
                type: "boolean",
                description: "SDMMC peripheral configuration",
                default: false,
              },
              check_param: {
                type: "boolean",
                description:
                  "Enable run time parameter check (if fail API shall return HAL_INVALID_PARAM)",
                default: false,
              },
              check_process_state: {
                type: "boolean",
                description:
                  "Enable protection of transition state to be thread safe (switch USE_HAL_CHECK_PROCESS_STATE)",
                default: false,
              },
              assert_dbg_param: {
                type: "boolean",
                description: "Enable check param for HAL and LL",
                default: false,
              },
              assert_dbg_state: {
                type: "boolean",
                description:
                  "Enable check state for HAL (define in pre-compilation)",
                default: false,
              },
              hal_mutex: {
                type: "boolean",
                description: "Enable semaphore creation for OS",
                default: false,
              },
              gpio_clk_enable_model: {
                type: "string",
                description:
                  "Enable the gating of the peripheral clock inside the HAL_GPIO_Init",
                oneOf: [
                  {
                    title: "HAL_CLK_ENABLE_NO",
                    const: "HAL_CLK_ENABLE_NO",
                  },
                  {
                    title: "HAL_CLK_ENABLE_PERIPH_ONLY",
                    const: "HAL_CLK_ENABLE_PERIPH_ONLY",
                  },
                  {
                    title: "HAL_CLK_ENABLE_PERIPH_PWR_SYSTEM",
                    const: "HAL_CLK_ENABLE_PERIPH_PWR_SYSTEM",
                  },
                ],
                default: "HAL_CLK_ENABLE_PERIPH_PWR_SYSTEM",
              },
              i2c_clk_enable_model: {
                type: "string",
                description:
                  "Enable the gating of the peripheral clock inside the HAL_I2C_Init",
                oneOf: [
                  {
                    title: "HAL_CLK_ENABLE_NO",
                    const: "HAL_CLK_ENABLE_NO",
                  },
                  {
                    title: "HAL_CLK_ENABLE_PERIPH_ONLY",
                    const: "HAL_CLK_ENABLE_PERIPH_ONLY",
                  },
                ],
                default: "HAL_CLK_ENABLE_PERIPH_ONLY",
              },
            },
          },
        },
      },
    },
  },
};

fs.writeFileSync(path.join(__dirname, "types", "system-types"), jsdoc(systemSchema /* , optionsObject */));