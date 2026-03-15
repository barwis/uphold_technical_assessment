// Browser storage adapter for Uphold SDK
export function createBrowserStorage() {
  return {
    async getItem(key: string): Promise<string | null> {
      return Promise.resolve(localStorage.getItem(key));
    },

    async setItem(key: string, value: string): Promise<void> {
      localStorage.setItem(key, value);
      return Promise.resolve();
    },

    async removeItem(key: string): Promise<void> {
      localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
}
