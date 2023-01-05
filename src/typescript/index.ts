export interface ISWConfig {
  [key: string]: [IPResource];
}

export interface Features {
  fullPoly: number;
}

export interface Instance {
  id: string;
  digitalName: string;
  resourceType: string;
  version: string;
  features: Features;
}

export interface Resources {
  instance: Instance;
}

export interface Info {
  labels: string[];
  init_type: string;
}

export interface CRCPolynomial {
  size: number;
  value: number;
}

export interface CRCInitTypeDef {
  DefaultPolynomialUse: boolean;
  CRC_Polynomial: CRCPolynomial;
  DefaultInitValueUse: boolean;
  InputDataFormat: string;
  InitValue: number;
  InputDataInversionMode: string;
  OutputDataInversionMode: boolean;
}

export interface Config {
  cfg_name: string;
  CRC_InitTypeDef: CRCInitTypeDef;
}

export interface Blocks {
  info: Info;
  configs: Config[];
}

export interface Settings {
  resources: Resources;
  blocks: Blocks;
}

export interface IPResource {
  instanceid: number;
  name: string;
  settings: Settings;
}
