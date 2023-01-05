//var helpers = {};

module.exports = {
  /*
  Brief: Retrieve the complete of EXTI lines configured in different
         configuration
  Input:
    Gpio_Config: GPIO config list for all the groups
  Output='' =>
  {
    "found_exti": boolean // if one of the config enabled an exti
    "exti": [] // list of the exti lines enabled
  }

  example='' =>
  {
    found_exti: true,
    exti: [
      12,
      1,
      7,
      5,
    ],
    label_exti: [
      {
        exti: 12,
        grp_name: "group1",
        grp_label: "gpio_runmode",
        cfg_label: "cfg1",
        pin_label: "gpio_label_4",
      },
      {
        exti: 1,
        grp_name: "group1",
        grp_label: "gpio_runmode",
        cfg_label: "cfg2",
        pin_label: "gpio_label_5",
      },
      {
        exti: 7,
        grp_name: "group1",
        grp_label: "gpio_runmode",
        cfg_label: "cfg2",
        pin_label: "gpio_label_7",
      },
      {
        exti: 5,
        grp_name: "group2",
        grp_label: "gpio_runmode2",
        cfg_label: "cfg3",
        pin_label: "gpio_label_9",
      },
      {
        exti: 5,
        grp_name: "group2",
        grp_label: "gpio_runmode2",
        cfg_label: "cfg3",
        pin_label: "gpio_label_10",
      },
    ],
  }
  */
  helper_exti_get_gpio(Gpio_Config) {
    console.log(`[INFO] helper_exti_get_gpio`);
    var groups = Gpio_Config["group"];

    var result = { found_exti: false, exti: [], label_exti: [] };

    groups.forEach((group) => {
      var configs = group["configs"];
      var gpio_list_hw = group["gpio_list"];
      var grp_name = group["name"];
      var grp_label = group["infos"]["label"];
      configs.forEach((config) => {
        var gpio_list = config["gpio_list"];
        var cfg_label = config["cfg_name"];
        gpio_list.forEach((list, index) => {
          var pin_label = list["label"];
          if (list["exti"]) {
            var exti_line = gpio_list_hw[index]["gpio"]["pin"];
            var labels = {
              exti: exti_line,
              grp_name: grp_name,
              grp_label: grp_label,
              cfg_label: cfg_label,
              pin_label: pin_label,
            };
            result["found_exti"] = true;
            result["label_exti"].push(labels);
            if (result["exti"].indexOf(exti_line) === -1) {
              result["exti"].push(exti_line);
            }
          }
        });
      });
    });

    return result;
  },
  /*
  Brief: Function to retrieve EXTI information for all the pins which are enabled EXTI
  Input:
    gpio_list_hw: hw gpio list (from pinout settings)
    gpio_list: sw gpio list (user configuration)
  Output='' =>
  {
    found_exti: boolean, // EXTI line has been enabled on 1 GPIO
    exti_list: [], // list of EXTI configuration for the GPIO port
  }

  example='' =>
  {
    found_exti: true,
    exti_list: [
      {
        port: "GPIOI",
        line: 12,
        trigger: "RISING",
        pin_label: "gpio_label_9",
      },
    ],
  }
  */
  helper_exti_get_config(gpio_list) {
    console.log(`[INFO] helper_exti_get_config`);
    if (typeof gpio_list === "undefined") {
      console.log(`[ERROR] helper_exti_get_config: gpio_list=${gpio_list}`);
      return {};
    }
    var result = { found_exti: false, exti_list: [] };

    gpio_list.forEach((gpio) => {
      var gpio_hw = gpio_list["pad"];
      var list_exti = { port: "", line: "", trigger: "" };
      var exti = gpio["exti"];
      if (exti) {
        result["found_exti"] = true;
        list_exti["line"] = gpio_hw["pin"];
        list_exti["port"] = gpio_hw["port"];
        list_exti["trigger"] = gpio["exti_trigger"];
        list_exti["pin_label"] = gpio["label"];
        result["exti_list"].push(list_exti);
      }
    });

    return result;
  },
};
//module.exports.helpers = helpers;
