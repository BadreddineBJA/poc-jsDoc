const Types = require('../types');

module.exports = {
  /*
  Brief: provide a structure which allows to group pins using the
         same configuration on a given port
  Input:
    gpio_list: sw gpio list (user configuration)
  Output='' =>
  {
    GPIOS: [], // list of GPIO using the same SW configuration
    list_gpio: [], // list of the GPIO port
  }

  example='' =>
  {
    GPIOS: [
      {
        port: "LPGPIO1",
        pins: "GPIO_PIN_0",
        mode: "GPIO_MODE_INPUT",
        pull: "GPIO_NOPULL",
      },
      {
        port: "GPIOH",
        pins: "GPIO_PIN_9 | GPIO_PIN_7",
        mode: "GPIO_MODE_OUTPUT_OD",
        pull: "GPIO_PULLUP",
        speed: "GPIO_SPEED_FREQ_VERY_HIGH",
      },
      {
        port: "GPIOI",
        pins: "GPIO_PIN_12",
        mode: "GPIO_MODE_OUTPUT_OD",
        pull: "GPIO_NOPULL",
        speed: "GPIO_SPEED_FREQ_HIGH",
      },
    ],
    list_gpio: [
      "LPGPIO1",
      "GPIOH",
      "GPIOI",
    ],
    hslv: [
      {
        port: "LPGPIO1",
        pins: "GPIO_PIN_0",
        high_speed_low_voltage: true,
      },
      {
        port: "GPIOH",
        pins: "GPIO_PIN_9",
        high_speed_low_voltage: false,
      },
    ],
  }
  */
/**
 * @param {Types.GPIO_Type[]} gpio_list
 * @returns {}
 */
  helper_gpio_get_pin_config(gpio_list) {
    console.log(`[INFO] helper_gpio_get_pin_config`);
    if (typeof gpio_list === "undefined") {
      console.log(`[ERROR] helper_gpio_get_pin_config: gpio_list=${gpio_list}`);
      return {};
    }
    var result = { GPIOS: [], list_gpio: [], hslv: [] };
    const map_lpgio = {
      PA1: 0,
      PA3: 1,
      PA6: 2,
      PB1: 3,
      PB10: 4,
      PC2: 5,
      PD13: 6,
      PD2: 7,
      PC10: 8,
      PB0: 9,
      PC12: 10,
      PB3: 11,
      PB3: 12,
      PE0: 13,
      PE2: 14,
      PE3: 15,
    };

    gpio_list.forEach((gpio) => {
      var gpio_init = gpio["config"];
      var port = "GPIO" + gpio["pad"]["port"];
      var pin = "GPIO_PIN_" + gpio["pad"]["pin"];
      // convert GPIOx pin y to LPGPIO1 pin z if low_power enabled on the pin
      if (gpio_init["mode"].hasOwnProperty("low_power")) {
        if (gpio_init["mode"]["low_power"]) {
          var name = gpio_list_hw[index]["gpio"]["name"];
          port = "LPGPIO1";
          pin = "GPIO_PIN_" + map_lpgio[name];
        }
      }
      var mode = "GPIO_MODE_" + gpio_init["mode"]["config"];
      var pull = "GPIO_" + gpio_init["pull"];
      var speed_is_present = false;
      if (gpio_init.hasOwnProperty("speed")) {
        var speed = "GPIO_SPEED_" + gpio_init["speed"];
        speed_is_present = true;
      }

      // find all the same configuration used for GPIO to put pin together
      var found_gpio = false;
      result["GPIOS"].forEach((gpio_description) => {
        if (
          gpio_description["port"] == port &&
          gpio_description["mode"] == mode &&
          gpio_description["pull"] == pull
        ) {
          if (
            (speed_is_present && gpio_description["speed"] == speed) ||
            !speed_is_present
          ) {
            gpio_description["pins"] = gpio_description["pins"] + " | " + pin;
            found_gpio = true;
          }
        }
      });

      // find all the same hslv configuration used for GPIO to put pin together
      var hslv_is_present = false;
      if (gpio_init.hasOwnProperty("high_speed_low_voltage")) {
        var hslv = gpio_init["high_speed_low_voltage"];
        hslv_is_present = true;
      }
      var found_hslv = false;
      result["hslv"].forEach((gpio_description) => {
        if (
          hslv_is_present &&
          gpio_description["port"] == port &&
          gpio_description["high_speed_low_voltage"] == hslv
        ) {
          gpio_description["pins"] = gpio_description["pins"] + " | " + pin;
          found_hslv = true;
        }
      });

      if (!found_gpio) {
        var list_pin_gpio = {};
        list_pin_gpio["port"] = port;
        list_pin_gpio["pins"] = pin;
        list_pin_gpio["mode"] = mode;
        list_pin_gpio["pull"] = pull;
        if (speed_is_present) {
          list_pin_gpio["speed"] = speed;
        }
        result["GPIOS"].push(list_pin_gpio);
        if (result["list_gpio"].indexOf(port) < 0) {
          result["list_gpio"].push(port);
        }
      }
      if (hslv_is_present && !found_hslv) {
        var list_hslv = {};
        list_hslv["port"] = port;
        list_hslv["pins"] = pin;
        list_hslv["high_speed_low_voltage"] = hslv;
        result["hslv"].push(list_hslv);
      }
    });

    return result;
  },
  /*
  Brief: retrieve the pin information in the GPIO hw list
  Input:
    gpio_list_hw: hw gpio list (from pinout settings)
    index: index of the pin to retrieve
*/
  helper_gpio_get_pin_hw(gpio_list_hw, index) {
    console.log(`[INFO] helper_gpio_get_pin_hw`);
    if (typeof gpio_list_hw === "undefined") {
      console.log(`[ERROR] helper_gpio_get_pin_hw: gpio_list_hw=${gpio_list_hw}, index=${index}`);
      return {};
    }
    return gpio_list_hw[index];
  },
  /*
Input:
  globalMap: all the global map
  Resource: current resource (ex: USART1)
  CfgName: current config name (ex: cfg1)
{
  signals: [
    {
      instance: "::Device:STM32 HAL Code Gen:UART Init:instance#0",
      cfg_name: "",
      type: "external",
      resource: "USART1",
      name: "USART1_TX",
      pad: {
        port: "A",
        pin: 9,
      },
      function: {
        type: "alternate",
        id: "AF7",
      },
    },
    {
      instance: "::Device:STM32 HAL Code Gen:UART Init:instance#0",
      cfg_name: "",
      resource: "USART1",
      type: "external",
      name: "USART1_RX",
      pad: {
        port: "A",
        pin: 10,
      },
      function: {
        type: "alternate",
        id: "AF7",
      },
    },
  ],
}
*/

/**
 * @param {string} CfgName - configuration name  
 * @param {Types.Signal[]} Signals 
 * @returns 
 */
  helper_gpio_get_gpioservice_object(CfgName, Signals) {
    console.log(`[INFO] helper_gpio_get_gpioservice_object`);
    var result = {};

    if (typeof Signals !== "undefined" && typeof CfgName !== "undefined") {
      var signal_result = [];
      Signals.forEach((signal) => {
        if (signal["cfg_name"] == CfgName) {
          signal_result.push(signal);
        }
      });
      result["signals"] = signal_result;
    }
    else
    {
      console.log(`[ERROR] helper_gpio_get_gpioservice_object: Resource=${Resource}, CfgName=${Resource}`);
    }
    return result;
  },
};
