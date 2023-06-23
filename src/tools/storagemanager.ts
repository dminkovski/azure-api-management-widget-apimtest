// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export enum StorageType {
  LocalStorage = "localStorage",
  SessionStorage = "sessionStorage", // Storage does not persist across tabs
}

/**
 * A class wrapping storing data in local or session Storage
 */
export class StorageManager {
  private storage: Storage;

  constructor(storageType: StorageType = StorageType.SessionStorage) {
    if (storageType === StorageType.LocalStorage) {
      this.storage = window.localStorage;
    } else {
      this.storage = window.sessionStorage;
    }
  }

  /**
   * Get Item from Storage
   * @param key
   * @returns any
   */
  public getItem(key: string): any {
    const item = this.storage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (error) {
        console.error(`Failed to parse item '${key}' from storage.`, error);
      }
    }
    return null;
  }

  /**
   * Set Item in Storage
   * @param key
   * @param value
   */
  public setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Failed to serialize item '${key}' for storage.`, error);
    }
  }

  /**
   * Remove Item from Storage
   * @param key
   */
  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  /**
   * Clear Storage
   */
  public clear(): void {
    this.storage.clear();
  }
}
