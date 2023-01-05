const jsdoc = require("json-schema-to-jsdoc");
const fs = require("fs");
const path = require("path");

const uartSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  componentid: "::Device:STM32U5xx HAL Code Gen:UART Init",
  type: "object",
  additionalProperties: false,
  functions: [
    {
      path: "/other/path/scripts/common_script.js",
      accessor: "common",
    },
  ],
  properties: {
    resources: {
      type: "object",
      additionalProperties: false,
      properties: {
        instance: {
          type: "object",
          query: {
            entity: [
              "peripheral.uart",
              "peripheral.usart",
              "peripheral.lpuart",
            ],
            title: "name",
          },
        },
      },
    },
    blocks: {
      type: "object",
      additionalProperties: false,
      properties: {
        info: {
          type: "object",
          additionalProperties: false,
          properties: {
            labels: {
              title: "Label",
              type: "array",
              items: {
                type: "string",
              },
            },
            init_type: {
              title: "resource initialization code generation",
              type: "string",
              oneOf: [
                {
                  const: "called",
                },
                {
                  const: "enabled",
                },
                {
                  const: "disabled",
                },
              ],
              description:
                "generate or not the PPP init code, call it or not at boot",
              $comment:
                "generate the init code of your PPP or not (enabled/disabled), call it automatically at startup or not (called/enabled)",
              default: "called",
            },
            function: {
              title: "Function",
              type: "string",
              oneOf: [
                {
                  title: "Asynchronous",
                  const: "ASYNC",
                  actions: [
                    {
                      type: "include",
                      condition:
                        "$resources.instance.features.asynchronous==true",
                    },
                  ],
                  constraints: [
                    {
                      target: "pinout",
                      id: "pin-mapping",
                      parameters: {
                        instance: "$resources.instance.name",
                        signals: ["USART_TX", "USART_RX"],
                      },
                    },
                  ],
                },
                {
                  title: "Synchronous",
                  const: "SYNC",
                  actions: [
                    {
                      type: "include",
                      condition:
                        "$resources.instance.features.synchronous==true",
                    },
                  ],
                  constraints: [
                    {
                      target: "pinout",
                      id: "pin-mapping",
                      parameters: {
                        instance: "$resources.instance.name",
                        signals: ["USART_TX", "USART_RX"],
                      },
                    },
                  ],
                },
                {
                  title: "IrDA",
                  const: "IRDA",
                  actions: [
                    {
                      type: "include",
                      condition: "$resources.instance.features.irda==true",
                    },
                  ],
                  constraints: [
                    {
                      target: "pinout",
                      id: "pin-mapping",
                      parameters: {
                        instance: "$resources.instance.name",
                        signals: ["USART_TX", "USART_RX"],
                      },
                    },
                  ],
                },
                {
                  title: "SmartCard",
                  const: "SMARTCARD",
                  actions: [
                    {
                      type: "include",
                      condition: "$resources.instance.features.smartcard==true",
                    },
                  ],
                  constraints: [
                    {
                      target: "pinout",
                      id: "pin-mapping",
                      parameters: {
                        instance: "$resources.instance.name",
                        signals: ["USART_TX", "USART_RX"],
                      },
                    },
                  ],
                },
                {
                  title: "Single Wire (Half-Duplex)",
                  const: "half_duplex_single_wire_mode",
                  actions: [
                    {
                      type: "include",
                      condition:
                        "$resources.instance.features.halfDuplex==true",
                    },
                  ],
                  constraints: [
                    {
                      target: "pinout",
                      id: "pin-mapping",
                      parameters: {
                        instance: "$resources.instance.name",
                        signals: ["USART_TX"],
                      },
                    },
                  ],
                },
                {
                  title: "Multiprocessor Communication",
                  const: "multiprocessor_communication",
                  constraints: [
                    {
                      target: "pinout",
                      id: "pin-mapping",
                      parameters: {
                        instance: "$resources.instance.name",
                        signals: ["USART_TX", "USART_RX"],
                      },
                    },
                  ],
                },
                {
                  title: "Modbus Communication",
                  const: "modbuscommunication",
                  constraints: [
                    {
                      target: "pinout",
                      id: "pin-mapping",
                      parameters: {
                        instance: "$resources.instance.name",
                        signals: ["USART_TX"],
                      },
                    },
                  ],
                },
                {
                  title: "LIN",
                  const: "lin",
                  actions: [
                    {
                      type: "include",
                      condition: "$resources.instance.features.lin==true",
                    },
                  ],
                  constraints: [
                    {
                      target: "pinout",
                      id: "pin-mapping",
                      parameters: {
                        instance: "$resources.instance.name",
                        signals: ["USART_TX", "USART_RX"],
                      },
                    },
                  ],
                },
                {
                  title: "Disabled",
                  const: "Disabled",
                },
              ],
              default: "Disabled",
            },
          },
        },
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
              UART_InitTypeDef: {
                type: "object",
                additionalProperties: false,
                actions: [
                  {
                    type: "exclude",
                    condition: "$info.function=='modbuscommunication'",
                  },
                ],
                properties: {
                  BaudRate: {
                    type: "integer",
                    description:
                      "This member configures the UART communication baud rate.\n Value between Min_Data=0 and Max_Data=20000000\n The baud rate register is computed using the following formula:\n LPUART:\n =======\n Baud Rate Register = ((256 * lpuart_ker_ckpres) / ((huart->Init.BaudRate)))\n where lpuart_ker_ck_pres is the UART input clock divided by a prescaler\n UART:\n =====\n - If oversampling is 16 or in LIN mode,\n    Baud Rate Register = ((uart_ker_ckpres) / ((huart->Init.BaudRate)))\n - If oversampling is 8,\n    Baud Rate Register[15:4] = ((2 * uart_ker_ckpres) /\n    ((huart->Init.BaudRate)))[15:4]\n    Baud Rate Register[3] =  0\n    Baud Rate Register[2:0] =  (((2 * uart_ker_ckpres) /\n    ((huart->Init.BaudRate)))[3:0]) >> 1\n where uart_ker_ck_pres is the UART input clock divided by a prescaler",
                    minimum: 0,
                    maximum: 20000000,
                    actions: [
                      {
                        type: "set",
                        condition: "",
                        attributes: {
                          minimum:
                            "$common.getMinBaudRate($clock.getInputFrequency($resources.instance.name), $config.prescaler, $config.oversampling)",
                          maximum:
                            "$common.getMaxBaudRate($clock.getInputFrequency($resources.instance.name), $config.prescaler, $config.oversampling)",
                        },
                      },
                    ],
                    default: 0,
                  },
                  WordLength: {
                    type: "string",
                    description:
                      "Specifies the number of data bits transmitted or received in a frame. This parameter can be a value of  UARTEx Word Length .",
                    oneOf: [
                      {
                        title: "7B",
                        const: "UART_WORDLENGTH_7B",
                        actions: [
                          {
                            type: "exclude",
                            condition: "$info.function=='lin'",
                          },
                        ],
                      },
                      {
                        title: "8B",
                        const: "UART_WORDLENGTH_8B",
                      },
                      {
                        title: "9B",
                        const: "UART_WORDLENGTH_9B",
                        actions: [
                          {
                            type: "exclude",
                            condition: "$info.function=='lin'",
                          },
                        ],
                      },
                    ],
                    default: "UART_WORDLENGTH_7B",
                  },
                  StopBits: {
                    type: "string",
                    description:
                      "Specifies the number of stop bits transmitted. This parameter can be a value of  UART Number of Stop Bits .",
                    oneOf: [
                      {
                        title: "0_5",
                        const: "UART_STOPBITS_0_5",
                        actions: [
                          {
                            type: "include",
                            condition:
                              "$resources.instance.features.smartcard==true",
                          },
                        ],
                      },
                      {
                        title: "1",
                        const: "UART_STOPBITS_1",
                      },
                      {
                        title: "1_5",
                        const: "UART_STOPBITS_1_5",
                        actions: [
                          {
                            type: "include",
                            condition:
                              "$resources.instance.features.smartcard==true",
                          },
                        ],
                      },
                      {
                        title: "2",
                        const: "UART_STOPBITS_2",
                      },
                    ],
                    default: "UART_STOPBITS_1",
                  },
                  Parity: {
                    type: "string",
                    description:
                      "Specifies the parity mode. This parameter can be a value of  UART Parity   When parity is enabled, the computed parity is inserted at the MSB position of the transmitted data (9th bit when the word length is set to 9 data bits; 8th bit when the word length is set to 8 data bits).",
                    oneOf: [
                      {
                        title: "NONE",
                        const: "UART_PARITY_NONE",
                      },
                      {
                        title: "EVEN",
                        const: "UART_PARITY_EVEN",
                      },
                      {
                        title: "ODD",
                        const: "UART_PARITY_ODD",
                      },
                    ],
                    default: "UART_PARITY_NONE",
                  },
                  Mode: {
                    type: "string",
                    description:
                      "Specifies whether the Receive or Transmit mode is enabled or disabled. This parameter can be a value of  UART Transfer Mode .",
                    oneOf: [
                      {
                        title: "RX",
                        const: "UART_MODE_RX",
                      },
                      {
                        title: "TX",
                        const: "UART_MODE_TX",
                      },
                      {
                        title: "TX_RX",
                        const: "UART_MODE_TX_RX",
                      },
                    ],
                    default: "UART_MODE_RX",
                  },
                  HwFlowCtl: {
                    type: "string",
                    description:
                      "Specifies whether the hardware flow control mode is enabled or disabled. This parameter can be a value of  UART Hardware Flow Control .",
                    oneOf: [
                      {
                        title: "NONE",
                        const: "UART_HWCONTROL_NONE",
                      },
                      {
                        title: "RTS",
                        const: "UART_HWCONTROL_RTS",
                        constraints: [
                          {
                            target: "pinout",
                            id: "pin-mapping",
                            parameters: {
                              instance: "$resources.instance.name",
                              signals: ["UART_RTS"],
                            },
                          },
                        ],
                      },
                      {
                        title: "CTS",
                        const: "UART_HWCONTROL_CTS",
                        constraints: [
                          {
                            target: "pinout",
                            id: "pin-mapping",
                            parameters: {
                              instance: "$resources.instance.name",
                              signals: ["UART_CTS"],
                            },
                          },
                        ],
                      },
                      {
                        title: "RTS_CTS",
                        const: "UART_HWCONTROL_RTS_CTS",
                        constraints: [
                          {
                            target: "pinout",
                            id: "pin-mapping",
                            parameters: {
                              instance: "$resources.instance.name",
                              signals: ["UART_RTS", "UART_CTS"],
                            },
                          },
                        ],
                      },
                    ],
                    actions: [
                      {
                        type: "include",
                        condition: "$info.function=='asynchronous'",
                      },
                      {
                        type: "exclude",
                        condition:
                          "$config.UART_InitTypeDef.hardware_flow_control_rs485",
                      },
                    ],
                    default: "UART_HWCONTROL_NONE",
                  },
                  hardware_flow_control_rs485: {
                    title: "Hardware Flow Control (RS485)",
                    actions: [
                      {
                        type: "include",
                        condition: "$info.function=='asynchronous'",
                      },
                      {
                        type: "include",
                        condition:
                          "$resources.instance.features.driverEnable==true",
                      },
                      {
                        type: "include",
                        condition:
                          "$config.UART_InitTypeDef.HwFlowCtl=='UART_HWCONTROL_NONE'",
                      },
                    ],
                    type: "boolean",
                    default: false,
                    constraints: [
                      {
                        target: "pinout",
                        id: "pin-mapping",
                        parameters: {
                          instance: "$resources.instance.name",
                          signals: ["UART_DE"],
                        },
                      },
                    ],
                  },
                  OverSampling: {
                    type: "string",
                    description:
                      "Specifies whether the Over sampling 8 is enabled or disabled, to achieve higher speed (up to f_PCLK/8). This parameter can be a value of  UART Over Sampling .",
                    oneOf: [
                      {
                        title: "16",
                        const: "UART_OVERSAMPLING_16",
                      },
                      {
                        title: "8",
                        const: "UART_OVERSAMPLING_8",
                        actions: [
                          {
                            type: "exclude",
                            condition: "$info.function=='lin'",
                          },
                        ],
                      },
                    ],
                    default: "UART_OVERSAMPLING_16",
                  },
                  OneBitSampling: {
                    type: "string",
                    description:
                      "Specifies whether a single sample or three samples' majority vote is selected. Selecting the single sample method increases the receiver tolerance to clock deviations. This parameter can be a value of  UART One Bit Sampling Method .",
                    oneOf: [
                      {
                        title: "DISABLE",
                        const: "UART_ONE_BIT_SAMPLE_DISABLE",
                      },
                      {
                        title: "ENABLE",
                        const: "UART_ONE_BIT_SAMPLE_ENABLE",
                      },
                    ],
                    default: "UART_ONE_BIT_SAMPLE_DISABLE",
                  },
                  ClockPrescaler: {
                    type: "string",
                    description:
                      "Specifies the prescaler value used to divide the UART clock source. This parameter can be a value of  UART Clock Prescaler .",
                    oneOf: [
                      {
                        title: "DIV1",
                        const: "UART_PRESCALER_DIV1",
                      },
                      {
                        title: "DIV2",
                        const: "UART_PRESCALER_DIV2",
                      },
                      {
                        title: "DIV4",
                        const: "UART_PRESCALER_DIV4",
                      },
                      {
                        title: "DIV6",
                        const: "UART_PRESCALER_DIV6",
                      },
                      {
                        title: "DIV8",
                        const: "UART_PRESCALER_DIV8",
                      },
                      {
                        title: "DIV10",
                        const: "UART_PRESCALER_DIV10",
                      },
                      {
                        title: "DIV12",
                        const: "UART_PRESCALER_DIV12",
                      },
                      {
                        title: "DIV16",
                        const: "UART_PRESCALER_DIV16",
                      },
                      {
                        title: "DIV32",
                        const: "UART_PRESCALER_DIV32",
                      },
                      {
                        title: "DIV64",
                        const: "UART_PRESCALER_DIV64",
                      },
                      {
                        title: "DIV128",
                        const: "UART_PRESCALER_DIV128",
                      },
                      {
                        title: "DIV256",
                        const: "UART_PRESCALER_DIV256",
                      },
                    ],
                    default: "UART_PRESCALER_DIV1",
                  },
                },
                description: "UART Init Structure definition.",
              },
              UART_MultiProcessor_Init: {
                type: "object",
                actions: [
                  {
                    type: "include",
                    condition: "$info.function=='multiprocessor_communication'",
                  },
                ],
                additionalProperties: false,
                properties: {
                  Address: {
                    minimum: 0,
                    maximum: 15,
                    type: "integer",
                    description: "Wake-Up Address",
                    actions: [
                      {
                        type: "include",
                        condition:
                          "$config.UART_MultiProcessor_Init.WakeUpMethod=='UART_WAKEUPMETHOD_ADDRESSMARK'",
                      },
                      {
                        type: "set",
                        condition:
                          "$config.UART_MultiProcessor_Init.AddressLength=UART_ADDRESS_DETECT_7B & $config.UART_InitTypeDef.WordLength=WORDLENGTH_7B",
                        attributes: {
                          maximum: 63,
                        },
                      },
                      {
                        type: "set",
                        condition:
                          "$config.UART_MultiProcessor_Init.AddressLength=UART_ADDRESS_DETECT_7B & $config.UART_InitTypeDef.WordLength=WORDLENGTH_8B",
                        attributes: {
                          maximum: 127,
                        },
                      },
                      {
                        type: "set",
                        condition:
                          "$config.UART_MultiProcessor_Init.AddressLength=UART_ADDRESS_DETECT_7B & $config.UART_InitTypeDef.WordLength=WORDLENGTH_9B",
                        attributes: {
                          maximum: 255,
                        },
                      },
                    ],
                    default: 0,
                  },
                  WakeUpMethod: {
                    type: "string",
                    description: "Wake-Up Method",
                    oneOf: [
                      {
                        title: "Idle Line",
                        const: "UART_WAKEUPMETHOD_IDLELINE",
                      },
                      {
                        title: "Address Mark",
                        const: "UART_WAKEUPMETHOD_ADDRESSMARK",
                      },
                    ],
                    default: "UART_WAKEUPMETHOD_IDLELINE",
                  },
                  AddressLength: {
                    type: "string",
                    description: "Wake-up address length",
                    oneOf: [
                      {
                        title: "4 Bits",
                        const: "UART_ADDRESS_DETECT_4B",
                      },
                      {
                        title: "7 Bits",
                        const: "UART_ADDRESS_DETECT_7B",
                      },
                    ],
                    actions: [
                      {
                        type: "include",
                        condition:
                          "$config.UART_MultiProcessor_Init.WakeUpMethod=='UART_WAKEUPMETHOD_ADDRESSMARK'",
                      },
                    ],
                    default: "UART_ADDRESS_DETECT_4B",
                  },
                },
                description:
                  "UART Multi processor initialization structure definition.",
              },
              UART_AdvFeatureInitTypeDef: {
                type: "object",
                additionalProperties: false,
                properties: {
                  AdvFeatureInit: {
                    type: "string",
                    description:
                      "Specifies which advanced UART features is initialized. Several Advanced Features may be initialized at the same time . This parameter can be a value of  UART Advanced Feature Initialization Type .",
                    oneOf: [
                      {
                        title: "NO_INIT",
                        const: "UART_ADVFEATURE_NO_INIT",
                      },
                      {
                        title: "TXINVERT_INIT",
                        const: "UART_ADVFEATURE_TXINVERT_INIT",
                      },
                      {
                        title: "RXINVERT_INIT",
                        const: "UART_ADVFEATURE_RXINVERT_INIT",
                      },
                      {
                        title: "DATAINVERT_INIT",
                        const: "UART_ADVFEATURE_DATAINVERT_INIT",
                      },
                      {
                        title: "SWAP_INIT",
                        const: "UART_ADVFEATURE_SWAP_INIT",
                      },
                      {
                        title: "RXOVERRUNDISABLE_INIT",
                        const: "UART_ADVFEATURE_RXOVERRUNDISABLE_INIT",
                      },
                      {
                        title: "DMADISABLEONERROR_INIT",
                        const: "UART_ADVFEATURE_DMADISABLEONERROR_INIT",
                      },
                      {
                        title: "AUTOBAUDRATE_INIT",
                        const: "UART_ADVFEATURE_AUTOBAUDRATE_INIT",
                      },
                      {
                        title: "MSBFIRST_INIT",
                        const: "UART_ADVFEATURE_MSBFIRST_INIT",
                      },
                    ],
                    default: "UART_ADVFEATURE_NO_INIT",
                  },
                  TxPinLevelInvert: {
                    type: "string",
                    description:
                      "Specifies whether the TX pin active level is inverted. This parameter can be a value of  UART Advanced Feature TX Pin Active Level Inversion .",
                    oneOf: [
                      {
                        title: "DISABLE",
                        const: "UART_ADVFEATURE_TXINV_DISABLE",
                      },
                      {
                        title: "ENABLE",
                        const: "UART_ADVFEATURE_TXINV_ENABLE",
                      },
                    ],
                    default: "UART_ADVFEATURE_TXINV_DISABLE",
                  },
                  RxPinLevelInvert: {
                    type: "string",
                    description:
                      "Specifies whether the RX pin active level is inverted. This parameter can be a value of  UART Advanced Feature RX Pin Active Level Inversion .",
                    oneOf: [
                      {
                        title: "DISABLE",
                        const: "UART_ADVFEATURE_RXINV_DISABLE",
                      },
                      {
                        title: "ENABLE",
                        const: "UART_ADVFEATURE_RXINV_ENABLE",
                      },
                    ],
                    default: "UART_ADVFEATURE_RXINV_DISABLE",
                  },
                  DataInvert: {
                    type: "string",
                    description:
                      "Specifies whether data are inverted (positive/direct logic vs negative/inverted logic). This parameter can be a value of  UART Advanced Feature Binary Data Inversion .",
                    oneOf: [
                      {
                        title: "DISABLE",
                        const: "UART_ADVFEATURE_DATAINV_DISABLE",
                      },
                      {
                        title: "ENABLE",
                        const: "UART_ADVFEATURE_DATAINV_ENABLE",
                      },
                    ],
                    default: "UART_ADVFEATURE_DATAINV_DISABLE",
                  },
                  Swap: {
                    type: "string",
                    description:
                      "Specifies whether TX and RX pins are swapped. This parameter can be a value of  UART Advanced Feature RX TX Pins Swap .",
                    oneOf: [
                      {
                        title: "DISABLE",
                        const: "UART_ADVFEATURE_SWAP_DISABLE",
                      },
                      {
                        title: "ENABLE",
                        const: "UART_ADVFEATURE_SWAP_ENABLE",
                      },
                    ],
                    default: "UART_ADVFEATURE_SWAP_DISABLE",
                  },
                  OverrunDisable: {
                    type: "string",
                    description:
                      "Specifies whether the reception overrun detection is disabled. This parameter can be a value of  UART Advanced Feature Overrun Disable .",
                    oneOf: [
                      {
                        title: "ENABLE",
                        const: "UART_ADVFEATURE_OVERRUN_ENABLE",
                      },
                      {
                        title: "DISABLE",
                        const: "UART_ADVFEATURE_OVERRUN_DISABLE",
                      },
                    ],
                    default: "UART_ADVFEATURE_OVERRUN_ENABLE",
                  },
                  DMADisableonRxError: {
                    type: "string",
                    description:
                      "Specifies whether the DMA is disabled in case of reception error. This parameter can be a value of  UART Advanced Feature DMA Disable On Rx Error .",
                    oneOf: [
                      {
                        title: "ENABLEONRXERROR",
                        const: "UART_ADVFEATURE_DMA_ENABLEONRXERROR",
                      },
                      {
                        title: "DISABLEONRXERROR",
                        const: "UART_ADVFEATURE_DMA_DISABLEONRXERROR",
                      },
                    ],
                    default: "UART_ADVFEATURE_DMA_ENABLEONRXERROR",
                  },
                  AutoBaudRateEnable: {
                    type: "string",
                    description:
                      "Specifies whether auto Baud rate detection is enabled. This parameter can be a value of  UART Advanced Feature Auto BaudRate Enable .",
                    oneOf: [
                      {
                        title: "DISABLE",
                        const: "UART_ADVFEATURE_AUTOBAUDRATE_DISABLE",
                      },
                      {
                        title: "ENABLE",
                        const: "UART_ADVFEATURE_AUTOBAUDRATE_ENABLE",
                      },
                    ],
                    default: "UART_ADVFEATURE_AUTOBAUDRATE_DISABLE",
                  },
                  AutoBaudRateMode: {
                    type: "string",
                    description:
                      "If auto Baud rate detection is enabled, specifies how the rate detection is carried out. This parameter can be a value of  UART Advanced Feature AutoBaud Rate Mode .",
                    oneOf: [
                      {
                        title: "ONSTARTBIT",
                        const: "UART_ADVFEATURE_AUTOBAUDRATE_ONSTARTBIT",
                      },
                      {
                        title: "ONFALLINGEDGE",
                        const: "UART_ADVFEATURE_AUTOBAUDRATE_ONFALLINGEDGE",
                      },
                      {
                        title: "ON0X7FFRAME",
                        const: "UART_ADVFEATURE_AUTOBAUDRATE_ON0X7FFRAME",
                      },
                      {
                        title: "ON0X55FRAME",
                        const: "UART_ADVFEATURE_AUTOBAUDRATE_ON0X55FRAME",
                      },
                    ],
                    default: "UART_ADVFEATURE_AUTOBAUDRATE_ONSTARTBIT",
                  },
                  MSBFirst: {
                    type: "string",
                    description:
                      "Specifies whether MSB is sent first on UART line. This parameter can be a value of  UART Advanced Feature MSB First .",
                    oneOf: [
                      {
                        title: "DISABLE",
                        const: "UART_ADVFEATURE_MSBFIRST_DISABLE",
                      },
                      {
                        title: "ENABLE",
                        const: "UART_ADVFEATURE_MSBFIRST_ENABLE",
                      },
                    ],
                    default: "UART_ADVFEATURE_MSBFIRST_DISABLE",
                  },
                },
                description:
                  "UART Advanced Features initialization structure definition.",
              },
            },
          },
        },
      },
    },
  },
};

fs.writeFileSync(
  path.join(__dirname, "types", "uart-types"),
  jsdoc(uartSchema /* , optionsObject */)
);
