declare module '@uphold/uphold-sdk-javascript' {
  export interface SDKOptions {
    baseUrl?: string;
    clientId: string;
    clientSecret: string;
    accessTokenKey?: string;
    refreshTokenKey?: string;
    scope?: string;
    version?: string;
    itemsPerPage?: number;
  }

  export interface Ticker {
    ask: string;
    bid: string;
    currency: string;
    pair: string;
  }

  export default class SDK {
    constructor(options: SDKOptions);

    getTicker(): Promise<Ticker[]>;
    getTicker(pair: string): Promise<Ticker>;

    api(uri: string, options?: {
      authenticate?: boolean;
      headers?: Record<string, string>;
      method?: string;
      queryParams?: Record<string, unknown>;
      raw?: boolean;
      version?: string;
      body?: unknown;
    }): Promise<unknown>;
  }
}
