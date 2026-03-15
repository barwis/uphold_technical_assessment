// Browser HTTP client for Uphold SDK
export function createFetchClient() {
  const defaultHeaders = {
    'user-agent': 'uphold-technical-assessment/1.0.0',
  };

  return {
    defaultHeaders,

    async request(
      url: string,
      method: string,
      body?: string,
      headers: Record<string, string> = {},
      _options?: unknown
    ): Promise<{
      body: unknown;
      headers: Record<string, string>;
      status: number;
    }> {
      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          ...defaultHeaders,
          ...headers,
        },
        body: body || undefined,
      });

      const responseBody = await response.json();

      // Convert Headers to plain object
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return {
        body: responseBody,
        headers: responseHeaders,
        status: response.status,
      };
    },
  };
}
