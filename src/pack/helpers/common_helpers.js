const Types = require("../../typescript/index");

module.exports = {
  /*
  Brief: return if register callback has been enabled for the module
  Input:
    Settings: global settings set by the user
    module: module to check
  Output='' => 1 or 0
  */

  /**
   * @typedef {object} Settings
   * @property {object} [resources]
   * @property {object} [resources.instance]
   * @property {object} [blocks]
   * @property {object} [blocks.info]
   * @property {array} [blocks.info.labels]
   * @property {string} [blocks.info.init_type="called"] generate or not the PPP init code, call it or not at boot
   * @property {array} [blocks.configs]
   */

  /**
   *
   * @param {Settings} Settings
   * @param {*} Module
   * @returns
   */
  helper_common_get_register_callback(Settings, Module) {
    let result = 0;
    let resources = Settings["resources"];
    for (let resource in resources) {
      if (
        resources[resource].hasOwnProperty("componentid") &&
        resources[resource]["componentid"].includes(Module)
      ) {
        if (
          resources[resource].hasOwnProperty("register_callback") &&
          resources[resource]["register_callback"]
        ) {
          result = 1;
          break;
        }
      }
    }
    return result;
  },
  /*
  Brief: return if dma has been enabled for the following module
  Input:
    Settings: global settings set by the user
    module: module to check
  Output='' => 1 or 0
  */

  /**
   *
   * @param {Settings} Settings
   * @param {*} Module
   * @returns
   */
  helper_common_get_dma_activation(Settings, Module) {
    let result = 0;
    let resources = Settings["resources"];
    for (let resource in resources) {
      if (
        resources[resource].hasOwnProperty("componentid") &&
        resources[resource]["componentid"].includes("DMA")
      ) {
        if (resources[resource].hasOwnProperty("configs")) {
          let configs = resources[resource]["configs"];
          configs.forEach((config) => {
            let json_format = JSON.stringify(config);
            JSON.parse(json_format, (key, value) => {
              if (key == "Request") {
                if (value.includes(Module)) {
                  result = 1;
                }
              }
              return value;
            });
          });
        }
      }
    }
    return result;
  },

  /*
  Brief: Prepare an object will be used by hal_target.h.hbs template
  Input:
    global_ctxt: global context of the project
    ex
    TARGET template global_ctxt: {
        'STMicroelectronics::Device:STM32 HAL Code Gen:UART Init@0.1.0': [ { instanceid: 4, name: 'UART', settings: [Object] } ],
        'STMicroelectronics::Device:STM32 HAL Code Gen:TIM Init@0.1.0': [
            { instanceid: 4, name: 'TIM_CH1', settings: [Object] },
            { instanceid: 5, name: 'TIM_CH2', settings: [Object] }
        ],
        'STMicroelectronics::Utility:Debug:basic trace&Configurable@0.0.2': [ { instanceid: 4, name: 'TRACE', settings: [Object] } ]
    }
  Output=''
{
  component: [
    "CRC",
    "UART",
    "TIM",
  ],
  periphs: [
    {
      resource_inst: "crc_instance0",
      fct_name: "crc_instance0_undefined",
      fct_name_labels: [
        "mx_bring_up_undefined",
      ],
      generated: true,
      default: false,
    },
    {
      resource_inst: "usart1_instance0",
      fct_name: "usart1_instance0_config1",
      fct_name_labels: [
        "mx_bring_up_config1",
      ],
      generated: true,
      default: true,
    },
    {
      resource_inst: "usart1_instance0",
      fct_name: "usart1_instance0_config2",
      fct_name_labels: [
        "mx_bring_up_config2",
      ],
      generated: true,
      default: false,
    },
    {
      resource_inst: "tim1_instance0",
      fct_name: "tim1_instance0_config1",
      fct_name_labels: [
        "mx_bring_up_config1",
      ],
      generated: true,
      default: false,
    },
  ],
  list_resource_hw: [
    {
      hw_resource: "CRC",
      labels: [
        "mx_bring_up",
      ],
    },
    {
      hw_resource: "USART1",
      labels: [
        "mx_bring_up",
      ],
    },
    {
      hw_resource: "TIM1",
      labels: [
        "mx_bring_up",
      ],
    },
  ],
  need_goto_end: true,
}
  */

  /**
   * @param {Types.ISWConfig} global_ctxt
   * @returns
   */
  helper_common_get_target_context(global_ctxt) {
    // let entries = Object.entries(global_ctxt);
    // for (let [key, value] of entries) {
    //   console.log("instanceid", key, value[0].instanceid);
    //   console.log("", key, value[0].name);
    //   console.log("", key, value[0].settings.blocks.info.init_type);
    // }

    try {
      console.log(`[INFO] helper_common_get_target_context`);
      let result = {
        component: [],
        periphs: [],
        list_resource_hw: [],
        need_goto_end: true,
      };
      let temp, length, Cgroup;
      for (const [key, value] of Object.entries(global_ctxt)) {
        if (key != undefined) {
          temp = key.split(":");
          length = temp.length;
          Cgroup = temp[3];
          if (Cgroup == "STM32 HAL Code Gen") {
            temp = temp[length - 1];
            temp = temp.split(" ");
            result["component"].push(temp[0]);
            const instanceList = value;
            instanceList.forEach((instance) => {
              let instanceid = instance.instanceid;
              let labels = [];
              if (
                instance.settings.blocks !== undefined &&
                instance.settings.blocks.info !== undefined
              ) {
                let resource = instance.settings.resources.instance.id;
                labels = instance.settings.blocks.info.labels;
                let name_labels = [];
                labels.forEach((label) => {
                  name_labels.push(
                    "mx_" + label.toLowerCase().replace("-", "_")
                  );
                });
                if (!result["list_resource_hw"].hasOwnProperty(resource)) {
                  let periph = {
                    hw_resource: resource,
                    labels: name_labels,
                  };
                  result["list_resource_hw"].push(periph);
                }
                let generated = false;
                if (instance.settings.blocks.info.init_type != "disabled") {
                  generated = true;
                }
                let fct_name_labels = [];
                let fct_name, resource_inst;
                if (instance.settings.blocks.configs !== undefined) {
                  instance.settings.blocks.configs.forEach((config) => {
                    let cfg_name = config["cfg_name"];
                    resource_inst =
                      resource.toLowerCase() + "_instance" + instanceid;
                    fct_name = resource_inst + addConfigLC(cfg_name);
                    labels.forEach((label) => {
                      let fct_name_label;
                      fct_name_label =
                        "mx" + addConfigLC(label) + addConfigLC(cfg_name);
                      fct_name_labels.push(fct_name_label);
                    });
                    let default_called = false;
                    if (config.hasOwnProperty("default")) {
                      default_called = config["default"];
                      if (default_called) {
                        result["need_goto_end"] = true;
                      }
                    }
                    let periph = {
                      resource_inst: resource_inst,
                      fct_name: fct_name,
                      fct_name_labels: fct_name_labels,
                      generated: generated,
                      default: true,
                    };
                    result["periphs"].push(periph);
                  });
                } else {
                  let periph = {
                    resource_inst: resource.toLowerCase() + "_instancex",
                    fct_name: resource.toLowerCase() + "_instancex_cfgy",
                    fct_name_labels: ["mx_labely"],
                  };
                  result["periphs"].push(periph);
                  console.log(
                    `[WARNING] helper_common_get_target_context: no configs block`
                  );
                }
              } else {
                let resource = "undefined";
                if (
                  instance.settings.blocks !== undefined &&
                  instance.settings.blocks.info !== undefined
                ) {
                  resource = instance.settings.resources.instance.id;
                }
                let periph = {
                  resource_inst: resource.toLowerCase() + "_instancex",
                  fct_name: resource.toLowerCase() + "_instancex_cfgy",
                  fct_name_labels: ["mx_labely"],
                  generated: false,
                  default: false,
                };
                let hw = {
                  hw_resource: resource,
                  labels: ["mx_labely"],
                };
                result["list_resource_hw"].push(hw);
                result["periphs"].push(periph);
                console.log(
                  `[WARNING] helper_common_get_target_context: no blocks or info block`
                );
              }
            });
          }
        }
      }
      return result;
    } catch (error) {
      console.log("[ERROR]: helper_common_get_target_context", error);
      //return {}
    }
  },

  /*
  Brief: Function to allow the call of the partial
  Input:
    component: SW component which allow to call the partial (ex UART will called UART_partial.hbs)
  Output='PPP' (ex 'UART'   )

  */
  helper_common_get_partial(component) {
    console.log(`[INFO] helper_common_get_partial`);
    return component;
  },

  helper_common_get_resource_ctxt(global_ctxt, component) {
    console.log(`[INFO] helper_common_get_resource_ctxt`);
    let result = undefined;
    let temp, length, Cgroup;
    for (const [key, value] of Object.entries(global_ctxt)) {
      if (key != undefined) {
        temp = key.split(":");
        length = temp.length;
        Cgroup = temp[3];
        if (Cgroup == "STM32 HAL Code Gen") {
          temp = temp[length - 1];
          temp = temp.split(" ");
          if (temp[0] == component) {
            result = value;
          }
        }
      }
    }
    return result;
  },
};
//module.exports.helpers = helpers;
