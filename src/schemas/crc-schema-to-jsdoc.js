const jsdoc = require("json-schema-to-jsdoc");
const fs = require("fs");
const path = require("path");

const schema1 = {
    $schema: "http://json-schema.org/draft-07/schema",
    componentid: "::Device:STM32U5xx HAL Code Gen:CRC Init",
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
              entity: "peripheral.crc",
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
                CRC_InitTypeDef: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    DefaultPolynomialUse: {
                      type: "boolean",
                      description:
                        "This parameter is a value of  Indicates whether or not default polynomial is used  and indicates if default polynomial is used. If set to DEFAULT_POLYNOMIAL_ENABLE, resort to default X^32 + X^26 + X^23 + X^22 + X^16 + X^12 + X^11 + X^10 +X^8 + X^7 + X^5 + X^4 + X^2+ X +1. In that case, there is no need to set GeneratingPolynomial field. If otherwise set to DEFAULT_POLYNOMIAL_DISABLE, GeneratingPolynomial and CRCLength fields must be set.",
                      actions: [
                        {
                          type: "include",
                          condition:
                            "$resources.instance.features.fullPoly==true",
                        },
                      ],
                      default: true,
                    },
                    DefaultInitValueUse: {
                      type: "boolean",
                      description:
                        "This parameter is a value of  Indicates whether or not default init value is used  and indicates if default init value is used. If set to DEFAULT_INIT_VALUE_ENABLE, resort to default 0xFFFFFFFF value. In that case, there is no need to set InitValue field. If otherwise set to DEFAULT_INIT_VALUE_DISABLE, InitValue field must be set.",
                      default: true,
                    },
                    CRC_Polynomial: {
                      type: "object",
                      description:
                        "Set CRC generating polynomial as a 7, 8, 16 or 32-bit long value for a polynomial degree respectively equal to 7, 8, 16 or 32. This field is written in normal, representation e.g., for a polynomial of degree 7, X^7 + X^6 + X^5 + X^2 + 1 is written 0x65. No need to specify it if DefaultPolynomialUse is set to DEFAULT_POLYNOMIAL_ENABLE.",
                      objectType: "polynomial",
                      actions: [
                        {
                          type: "include",
                          condition:
                            "$resources.instance.features.fullPoly==true",
                        },
                        {
                          type: "exclude",
                          condition:
                            "$config.CRC_InitTypeDef.DefaultPolynomialUse==true",
                        },
                      ],
                      size: [32, 16, 8],
                      force: [0],
                    },
                    InputDataFormat: {
                      type: "string",
                      description:
                        "This parameter is a value of  Input Buffer Format  and specifies input data format. Can be either  \n CRC_INPUTDATA_FORMAT_BYTES  input data is a stream of bytes (8-bit data)  \n CRC_INPUTDATA_FORMAT_HALFWORDS  input data is a stream of half-words (16-bit data)  \n CRC_INPUTDATA_FORMAT_WORDS  input data is a stream of words (32-bit data)",
                      oneOf: [
                        {
                          title: "BYTES",
                          const: "CRC_INPUTDATA_FORMAT_BYTES",
                        },
                        {
                          title: "HALFWORDS",
                          const: "CRC_INPUTDATA_FORMAT_HALFWORDS",
                        },
                        {
                          title: "WORDS",
                          const: "CRC_INPUTDATA_FORMAT_WORDS",
                        },
                      ],
                      default: "CRC_INPUTDATA_FORMAT_BYTES",
                    },
                    InitValue: {
                      type: "integer",
                      description:
                        "Init value to initiate CRC computation. No need to specify it if DefaultInitValueUse is set to DEFAULT_INIT_VALUE_ENABLE.",
                      actions: [
                        {
                          type: "exclude",
                          condition:
                            "$config.CRC_InitTypeDef.DefaultInitValueUse==true",
                        },
                      ],
                      default: 0,
                    },
                    InputDataInversionMode: {
                      type: "string",
                      description:
                        "This parameter is a value of  Input Data Inversion Modes  and specifies input data inversion mode. Can be either one of the following values  \n CRC_INPUTDATA_INVERSION_NONE  no input data inversion  \n CRC_INPUTDATA_INVERSION_BYTE  byte-wise inversion, 0x1A2B3C4D becomes 0x58D43CB2  \n CRC_INPUTDATA_INVERSION_HALFWORD  halfword-wise inversion, 0x1A2B3C4D becomes 0xD458B23C  \n CRC_INPUTDATA_INVERSION_WORD  word-wise inversion, 0x1A2B3C4D becomes 0xB23CD458",
                      oneOf: [
                        {
                          title: "NONE",
                          const: "CRC_INPUTDATA_INVERSION_NONE",
                        },
                        {
                          title: "BYTE",
                          const: "CRC_INPUTDATA_INVERSION_BYTE",
                        },
                        {
                          title: "HALFWORD",
                          const: "CRC_INPUTDATA_INVERSION_HALFWORD",
                        },
                        {
                          title: "WORD",
                          const: "CRC_INPUTDATA_INVERSION_WORD",
                        },
                      ],
                      default: "CRC_INPUTDATA_INVERSION_NONE",
                    },
                    OutputDataInversionMode: {
                      type: "boolean",
                      description:
                        "This parameter is a value of  Output Data Inversion Modes  and specifies output data (i.e. CRC) inversion mode. Can be either  \n CRC_OUTPUTDATA_INVERSION_DISABLE  no CRC inversion,  \n CRC_OUTPUTDATA_INVERSION_ENABLE  CRC 0x11223344 is converted into 0x22CC4488",
                      default: false,
                    },
                  },
                  description: "CRC Init Structure definition.",
                },
              },
            },
          },
        },
      },
    },
};
  
fs.writeFileSync(path.join(__dirname, "types", "crc-types"), jsdoc(schema1 /* , optionsObject */));