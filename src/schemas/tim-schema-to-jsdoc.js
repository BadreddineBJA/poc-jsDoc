const jsdoc = require("json-schema-to-jsdoc");
const fs = require("fs");
const path = require("path");

const timSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  componentid: "::Device:STM32U5xx HAL Code Gen:TIM Init",
  type: "object",
  additionalProperties: false,
  properties: {
    resources: {
      type: "object",
      additionalProperties: false,
      properties: {
        instance: {
          type: "object",
          query: {
            entity: ["peripheral.tim"],
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
              TIM_Base_InitTypeDef: {
                type: "object",
                description:
                  "TIM Time base Configuration Structure definition.",
                additionalProperties: false,
                properties: {
                  Prescaler: {
                    type: "integer",
                    description:
                      "Specifies the prescaler value used to divide the TIM clock. This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF Macro  __HAL_TIM_CALC_PSC()  can be used to calculate prescaler value",
                    minimum: 0,
                    maximum: 65535,
                    default: 0,
                  },
                  CounterMode: {
                    type: "string",
                    description:
                      "Specifies the counter mode. This parameter can be a value of  TIM Counter Mode",
                    oneOf: [
                      {
                        title: "UP",
                        const: "TIM_COUNTERMODE_UP",
                        actions: [
                          {
                            type: "include",
                            condition: "$resources.instance.features.cnt_dir>0",
                          },
                        ],
                      },
                      {
                        title: "DOWN",
                        const: "TIM_COUNTERMODE_DOWN",
                        actions: [
                          {
                            type: "include",
                            condition:
                              "($resources.instance.features.cnt_dir==0)||($resources.instance.features.cnt_dir==2)",
                          },
                        ],
                      },
                      {
                        title: "CENTERALIGNED1",
                        const: "TIM_COUNTERMODE_CENTERALIGNED1",
                        actions: [
                          {
                            type: "include",
                            condition:
                              "$resources.instance.features.cnt_dir==2",
                          },
                        ],
                      },
                      {
                        title: "CENTERALIGNED2",
                        const: "TIM_COUNTERMODE_CENTERALIGNED2",
                        actions: [
                          {
                            type: "include",
                            condition:
                              "$resources.instance.features.cnt_dir==2",
                          },
                        ],
                      },
                      {
                        title: "CENTERALIGNED3",
                        const: "TIM_COUNTERMODE_CENTERALIGNED3",
                        actions: [
                          {
                            type: "include",
                            condition:
                              "$resources.instance.features.cnt_dir==2",
                          },
                        ],
                      },
                    ],
                    default: "TIM_COUNTERMODE_DOWN",
                  },
                  Period: {
                    type: "integer",
                    description:
                      "Counter Period (AutoReload Register - 16 bits value)",
                    minimum: 0,
                    maximum: 65535,
                    actions: [
                      {
                        type: "set",
                        condition:
                          "($resources.instance.features.cnt_width==16)&&($config.TIM_modes.dithering==true)",
                        attributes: {
                          description:
                            "Integer Counter Period (AutoReload Register - 12 bits value)",
                          maximum: 4095,
                        },
                      },
                      {
                        type: "set",
                        condition:
                          "($resources.instance.features.cnt_width==32)&&($config.TIM_modes.dithering==false)",
                        attributes: {
                          description:
                            "Counter Period (AutoReload Register - 32 bits value)",
                          maximum: 4294967295,
                        },
                      },
                      {
                        type: "set",
                        condition:
                          "($resources.instance.features.cnt_width==32)&&($config.TIM_modes.dithering==true)",
                        attributes: {
                          description:
                            "Integer Counter Period (AutoReload Register - 28 bits value)",
                          maximum: 268435455,
                        },
                      },
                    ],
                    default: 0,
                  },
                  ClockDivision: {
                    type: "integer",
                    description:
                      "Specifies the clock division. This parameter can be a value of TIM Clock Division",
                    actions: [
                      {
                        type: "include",
                        condition:
                          "($resources.instance.features.nb_of_cc>0)||($resources.instance.features.etr_impl>0)",
                      },
                    ],
                    oneOf: [
                      {
                        title: "DIV1",
                        const: 1,
                      },
                      {
                        title: "DIV2",
                        const: 2,
                      },
                      {
                        title: "DIV4",
                        const: 4,
                      },
                    ],
                    default: 1,
                  },
                  RepetitionCounter: {
                    type: "integer",
                    description: "Repetition Counter (RCR - 8 bits value)",
                    minimum: 0,
                    maximum: 255,
                    actions: [
                      {
                        type: "set",
                        condition: "$resources.instance.features.rcr_impl>1",
                        attributes: {
                          maximum: 65535,
                          description:
                            "Repetition Counter (RCR - 16 bits value)",
                        },
                      },
                      {
                        type: "exclude",
                        condition: "$resources.instance.features.rcr_impl==0",
                      },
                    ],
                    default: 0,
                  },
                  AutoReloadPreload: {
                    type: "boolean",
                    description:
                      "Specifies the auto-reload preload. This parameter can be a value of  TIM Auto-Reload Preload",
                    default: false,
                  },
                },
              },
              channels: {
                type: "array",
                actions: [
                  {
                    type: "include",
                    condition: "$resources.instance.features.nb_of_cc>0",
                  },
                ],
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    channel: {
                      type: "integer",
                      oneOf: [
                        {
                          title: "CHANNEL 1",
                          const: 1,
                          constraints: [
                            {
                              target: "pinout",
                              id: "pin-mapping",
                              parameters: {
                                instance: "$resources.instance.name",
                                signals: ["TIM_CH1"],
                              },
                            },
                          ],
                        },
                        {
                          title: "CHANNEL 2",
                          const: 2,
                          actions: [
                            {
                              type: "include",
                              condition:
                                "$resources.instance.features.nb_of_cc>1",
                            },
                          ],
                          constraints: [
                            {
                              target: "pinout",
                              id: "pin-mapping",
                              parameters: {
                                instance: "$resources.instance.name",
                                signals: ["TIM_CH2"],
                              },
                            },
                          ],
                        },
                        {
                          title: "CHANNEL 3",
                          const: 3,
                          actions: [
                            {
                              type: "include",
                              condition:
                                "$resources.instance.features.nb_of_cc>2",
                            },
                          ],
                          constraints: [
                            {
                              target: "pinout",
                              id: "pin-mapping",
                              parameters: {
                                instance: "$resources.instance.name",
                                signals: ["TIM_CH3"],
                              },
                            },
                          ],
                        },
                        {
                          title: "CHANNEL 4",
                          const: 4,
                          actions: [
                            {
                              type: "include",
                              condition:
                                "$resources.instance.features.nb_of_cc>3",
                            },
                          ],
                          constraints: [
                            {
                              target: "pinout",
                              id: "pin-mapping",
                              parameters: {
                                instance: "$resources.instance.name",
                                signals: ["TIM_CH4"],
                              },
                            },
                          ],
                        },
                        {
                          title: "CHANNEL 5",
                          const: 5,
                          actions: [
                            {
                              type: "include",
                              condition:
                                "$resources.instance.features.nb_of_cc>4",
                            },
                          ],
                        },
                        {
                          title: "CHANNEL 6",
                          const: 6,
                          actions: [
                            {
                              type: "include",
                              condition:
                                "$resources.instance.features.nb_of_cc>5",
                            },
                          ],
                        },
                      ],
                    },
                    mode: {
                      type: "integer",
                      description: "Mode defined for the channel",
                      oneOf: [
                        {
                          title: "PWM",
                          const: 1,
                          actions: [
                            {
                              type: "include",
                              condition: "$item.channel.features.pwm",
                            },
                          ],
                        },
                      ],
                      default: 1,
                    },
                    TIM_OC_InitTypeDef: {
                      type: "object",
                      description:
                        "TIM Output Compare Configuration Structure definition.",
                      additionalProperties: false,
                      properties: {
                        OCMode: {
                          type: "string",
                          description:
                            "Specifies the TIM mode. This parameter can be a value of  TIM Output Compare and PWM Modes",
                          oneOf: [
                            {
                              title: "TIMING",
                              const: "TIM_OCMODE_TIMING",
                            },
                            {
                              title: "ACTIVE",
                              const: "TIM_OCMODE_ACTIVE",
                            },
                            {
                              title: "INACTIVE",
                              const: "TIM_OCMODE_INACTIVE",
                            },
                            {
                              title: "TOGGLE",
                              const: "TIM_OCMODE_TOGGLE",
                            },
                            {
                              title: "PWM1",
                              const: "TIM_OCMODE_PWM1",
                            },
                            {
                              title: "PWM2",
                              const: "TIM_OCMODE_PWM2",
                            },
                            {
                              title: "FORCED_ACTIVE",
                              const: "TIM_OCMODE_FORCED_ACTIVE",
                            },
                            {
                              title: "FORCED_INACTIVE",
                              const: "TIM_OCMODE_FORCED_INACTIVE",
                            },
                            {
                              title: "RETRIGERRABLE_OPM1",
                              const: "TIM_OCMODE_RETRIGERRABLE_OPM1",
                            },
                            {
                              title: "RETRIGERRABLE_OPM2",
                              const: "TIM_OCMODE_RETRIGERRABLE_OPM2",
                            },
                            {
                              title: "COMBINED_PWM1",
                              const: "TIM_OCMODE_COMBINED_PWM1",
                              actions: [
                                {
                                  type: "include",
                                  condition: "$item.mode==1",
                                },
                              ],
                            },
                            {
                              title: "COMBINED_PWM2",
                              const: "TIM_OCMODE_COMBINED_PWM2",
                              actions: [
                                {
                                  type: "include",
                                  condition: "$item.mode==1",
                                },
                              ],
                            },
                            {
                              title: "ASSYMETRIC_PWM1",
                              const: "TIM_OCMODE_ASSYMETRIC_PWM1",
                              actions: [
                                {
                                  type: "include",
                                  condition: "$item.mode==1",
                                },
                              ],
                            },
                            {
                              title: "ASSYMETRIC_PWM2",
                              const: "TIM_OCMODE_ASSYMETRIC_PWM2",
                              actions: [
                                {
                                  type: "include",
                                  condition: "$item.mode==1",
                                },
                              ],
                            },
                            {
                              title: "PULSE_ON_COMPARE",
                              const: "TIM_OCMODE_PULSE_ON_COMPARE",
                            },
                            {
                              title: "DIRECTION_OUTPUT",
                              const: "TIM_OCMODE_DIRECTION_OUTPUT",
                            },
                          ],
                          default: "TIM_OCMODE_TIMING",
                        },
                        Pulse: {
                          type: "integer",
                          description:
                            "Specifies the pulse value to be loaded into the Capture Compare Register. This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF (or 0xFFEF if dithering is activated) Macros  __HAL_TIM_CALC_PULSE() ,  __HAL_TIM_CALC_PULSE_DITHER()  can be used to calculate Pulse value",
                          minimum: 0,
                          maximum: 65535,
                          default: 0,
                        },
                        OCPolarity: {
                          type: "string",
                          description:
                            "Specifies the output polarity. This parameter can be a value of  TIM Output Compare Polarity",
                          oneOf: [
                            {
                              title: "HIGH",
                              const: "TIM_OCPOLARITY_HIGH",
                            },
                            {
                              title: "LOW",
                              const: "TIM_OCPOLARITY_LOW",
                            },
                          ],
                          default: "TIM_OCPOLARITY_HIGH",
                        },
                        OCNPolarity: {
                          type: "string",
                          description:
                            "Specifies the complementary output polarity. This parameter can be a value of  TIM Complementary Output Compare Polarity   This parameter is valid only for timer instances supporting break feature.",
                          actions: [
                            {
                              type: "show",
                              condition: "gethwfeature(break)",
                            },
                          ],
                          oneOf: [
                            {
                              title: "HIGH",
                              const: "TIM_OCNPOLARITY_HIGH",
                            },
                            {
                              title: "LOW",
                              const: "TIM_OCNPOLARITY_LOW",
                            },
                          ],
                          default: "TIM_OCNPOLARITY_HIGH",
                        },
                        OCFastMode: {
                          type: "string",
                          description:
                            "Specifies the Fast mode state. This parameter can be a value of  TIM Output Fast State   This parameter is valid only in PWM1 and PWM2 mode.",
                          actions: [
                            {
                              type: "show",
                              condition: "('PWM' in OCMode)",
                            },
                          ],
                          oneOf: [
                            {
                              title: "DISABLE",
                              const: "TIM_OCFAST_DISABLE",
                            },
                            {
                              title: "ENABLE",
                              const: "TIM_OCFAST_ENABLE",
                            },
                          ],
                          default: "TIM_OCFAST_DISABLE",
                        },
                        OCIdleState: {
                          type: "string",
                          description:
                            "Specifies the TIM Output Compare pin state during Idle state. This parameter can be a value of  TIM Output Compare Idle State   This parameter is valid only for timer instances supporting break feature.",
                          actions: [
                            {
                              type: "show",
                              condition: "gethwfeature(break)",
                            },
                          ],
                          oneOf: [
                            {
                              title: "SET",
                              const: "TIM_OCIDLESTATE_SET",
                            },
                            {
                              title: "RESET",
                              const: "TIM_OCIDLESTATE_RESET",
                            },
                          ],
                          default: "TIM_OCIDLESTATE_SET",
                        },
                        OCNIdleState: {
                          type: "string",
                          description:
                            "Specifies the TIM Output Compare pin state during Idle state. This parameter can be a value of  TIM Complementary Output Compare Idle State   This parameter is valid only for timer instances supporting break feature.",
                          actions: [
                            {
                              type: "show",
                              condition: "gethwfeature(break)",
                            },
                          ],
                          oneOf: [
                            {
                              title: "SET",
                              const: "TIM_OCNIDLESTATE_SET",
                            },
                            {
                              title: "RESET",
                              const: "TIM_OCNIDLESTATE_RESET",
                            },
                          ],
                          default: "TIM_OCNIDLESTATE_SET",
                        },
                      },
                      actions: [
                        {
                          type: "include",
                          condition: "$item.mode>0",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

fs.writeFileSync(path.join(__dirname, "types", "tim-types"), jsdoc(timSchema /* , optionsObject */));

