module.exports = {
  /*
  Input:
    clock_domain: clock_domain section
  Output for SystemClockConfig on G4 =>
  {
    HSI: true,
    PLL: true,
    OscillatorType: "RCC_OSCILLATORTYPE_HSI",
    PLLSource: "RCC_PLLSOURCE_HSI",
    PLLN: 75,
    PLLM: "RCC_PLLM_DIV4",
    PLLP: "RCC_PLLP_DIV2",
    PLLQ: "RCC_PLLQ_DIV2",
    PLLR: "RCC_PLLR_DIV2",
    SysClkSource: "RCC_SYSCLKSOURCE_PLLCLK",
    AHBPrescaler: "RCC_SYSCLK_DIV1",
    APB1Prescaler: "RCC_HCLK_DIV1",
    APB2Prescaler: "RCC_HCLK_DIV1"
  }
  */

/**
 * @typedef {Object} ClockConfig
 * @property {string} id - ID
 * @property {number} value: clock value
 * @property {number} frequency: clock Frequency
 /

 /**
  * @typedef {Object} CLOCK_HAL_CONFIG
  * @property {boolean} HSI
  * @property {boolean} MSI
  * @property {boolean} PLL
  * @property {string} PLLRGE
  * @property {number} PLLFRACN
  * @property {string} PLLMBOOST
  * @property {string} OscillatorType
  */

  /**
   * @param {ClockConfig[]} clock_domain
   * @returns {CLOCK_HAL_CONFIG}
   */
  helper_rcc_get_hal_clock_config_object_u5(clock_domain) {
    console.log(`[INFO] helper_rcc_get_hal_clock_config_object_u5`);
    if (typeof clock_domain === "undefined") {
      console.log(
        `[ERROR] helper_rcc_get_hal_clock_config_object_u5: clock_domain=${clock_domain}`
      );
      return {};
    }
     /**
     * @type {CLOCK_HAL_CONFIG}
     */
    let result = {
      HSI: false,
      MSI: false,
      PLL: false,
      PLLRGE: "RCC_PLLVCIRANGE_0",
      PLLFRACN: 0,
      PLLMBOOST: "RCC_PLLMBOOST_DIV1",
      OscillatorType: "",
    };

    clock_domain.forEach((element) => {
      let id = element.id;
      let value = element.value;
      /* Look for Oscillator type */
      if (id == "HSI") {
        result["HSI"] = true;
        if (result["OscillatorType"] != "") result["OscillatorType"] += " | ";
        result["OscillatorType"] += "RCC_OSCILLATORTYPE_HSI";
      }
      if (id == "MSIS") {
        result["MSI"] = true;
        if (result["OscillatorType"] != "") result["OscillatorType"] += " | ";
        result["OscillatorType"] += "RCC_OSCILLATORTYPE_MSI";
        const map_msis_range = {
          48000000: "RCC_MSIRANGE_0",
          24000000: "RCC_MSIRANGE_1",
          16000000: "RCC_MSIRANGE_2",
          12000000: "RCC_MSIRANGE_3",
          4000000: "RCC_MSIRANGE_4",
          2000000: "RCC_MSIRANGE_5",
          1330000: "RCC_MSIRANGE_6",
          1000000: "RCC_MSIRANGE_7",
          3072000: "RCC_MSIRANGE_8",
          1536000: "RCC_MSIRANGE_9",
          1024000: "RCC_MSIRANGE_10",
          768000: "RCC_MSIRANGE_11",
          400000: "RCC_MSIRANGE_12",
          200000: "RCC_MSIRANGE_13",
          133000: "RCC_MSIRANGE_14",
          100000: "RCC_MSIRANGE_15",
        };
        result["MSIRange"] = map_msis_range[value];
      }
      /* Look for PLL configuration */
      if (id == "PLL1_Clock_Source") {
        result["PLL"] = true;
        const map_pll_clk_src = {
          HSE_Input: "RCC_PLLSOURCE_HSE",
          HSI_Input: "RCC_PLLSOURCE_HSI",
          MSIS_Input: "RCC_PLLSOURCE_MSI",
        };
        result["PLLSource"] = map_pll_clk_src[value];
      }
      if (id == "PLLN") {
        result["PLLN"] = value;
      }
      /* No PLLMBOOST in the DFP structure */
      if (id == "PLLMBOOST") {
        result["PLLMBOOST"] = "RCC_PLLMBOOST_DIV" + value;
      }
      if (id == "PLLM") {
        result["PLLM"] = value;
      }
      if (id == "PLLP") {
        result["PLLP"] = value;
      }
      if (id == "PLLQ") {
        result["PLLQ"] = value;
      }
      if (id == "PLLR") {
        result["PLLR"] = value;
      }
      /* No PLLRGE in the DFP structure */
      if (id == "PLLRGE") {
        result["PLLRGE"] = "RCC_PLLVCIRANGE_" + value;
      }
      /* No PLLFRACN in the DFP structure */
      if (id == "PLLFRACN") {
        result["PLLFRACN"] = value;
      }
      if (id == "System_Clock_Source") {
        const map_sys_clk_src = {
          MSIS_Input: "RCC_SYSCLKSOURCE_MSI",
          HSI_Input: "RCC_SYSCLKSOURCE_HSI",
          HSE_Input: "RCC_SYSCLKSOURCE_HSE",
          pll1_Input: "RCC_SYSCLKSOURCE_PLLCLK",
        };
        result["SysClkSource"] = map_sys_clk_src[value];
      }
      if (id == "AHB_divider") {
        result["AHBPrescaler"] = "RCC_SYSCLK_DIV" + value;
      }
      if (id == "APB1_divider") {
        result["APB1Prescaler"] = "RCC_HCLK_DIV" + value;
      }
      if (id == "APB2_divider") {
        result["APB2Prescaler"] = "RCC_HCLK_DIV" + value;
      }
      if (id == "APB3_divider") {
        result["APB3Prescaler"] = "RCC_HCLK_DIV" + value;
      }
    });

    return result;
  },

  /**
   * @typedef {Object} ClockInput
   * @property {boolean} found
   * @property {string} clockselection
   * @property {string} input
  */ 
  

  /**
   * @param {ClockConfig[]} clock_domain
   * @param {string} hw_resource 
   * @returns {ClockInput}
   */
  helper_rcc_get_clock_input(clock_domain, hw_resource) {
    let result = {
      found: false,
      clockselection: "Usart1ClockSelection",
      input: "RCC_USART1CLKSOURCE_PCLK2",
    };
    const input_map_hal = {
      APB2_Input: "RCC_USART1CLKSOURCE_PCLK2",
      System_Input: "RCC_USART1CLKSOURCE_SYSCLK",
      LSE_Input: "RCC_USART1CLKSOURCE_LSE",
      HSI_Input: "RCC_USART1CLKSOURCE_HSI",
    };

    const resource_map_clk_selection = {
      USART1: "Usart1ClockSelection",
      USART2: "Usart2ClockSelection",
      USART3: "Usart3ClockSelection",
      USART6: "Usart6ClockSelection",
      UART4: "Uart4ClockSelection",
      UART5: "Uart5ClockSelection",
    };

    let clock_source = hw_resource + "_Clock_Source";
    clock_domain.forEach((clock) => {
      if (clock.id == clock_source) {
        if (
          input_map_hal.hasOwnProperty(clock.value) &&
          resource_map_clk_selection.hasOwnProperty(hw_resource)
        ) {
          result["found"] = true;
          result["clockselection"] = resource_map_clk_selection[hw_resource];
          result["input"] = input_map_hal[clock.value];
        } else {
          console.log(
            `[ERROR] helper_rcc_get_clock_input: input or hw_resource not possible`
          );
        }
        return;
      }
    });
    return result;
  },
};
