import { DecryptionProviderTypes, EncryptionTypes, IdentityTypes } from '@requestnetwork/types';
import { isEqual } from 'lodash';

interface QueueItem {
  method: string;
  params: any;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

interface CacheItem {
  result: any;
}

export class SnapsDecryptionProvider
  implements DecryptionProviderTypes.IDecryptionProvider
{
  private invokeSnap;
  private queue: QueueItem[] = [];
  private processingQueue: boolean = false;
  private cache: { [key: string]: CacheItem } = {};
  /** list of supported encryption method */
  public supportedMethods: EncryptionTypes.METHOD[] = [EncryptionTypes.METHOD.ECIES];
  /** list of supported identity types */
  public supportedIdentityTypes: IdentityTypes.TYPE[] = [IdentityTypes.TYPE.ETHEREUM_ADDRESS];

  constructor(invokeSnap: any) {
    this.invokeSnap = invokeSnap;
  }

  private createCacheKey(method: string, params: any): string {
    return JSON.stringify({ method, params });
  }

  private enqueue(method: string, params: any): Promise<any> {
    const cacheKey = this.createCacheKey(method, params);
    if (this.cache[cacheKey]) {
      return Promise.resolve(this.cache[cacheKey].result);
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ method, params, resolve, reject });
      this.processQueue(); // start processing if not already processing
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processingQueue) return; // already processing
    this.processingQueue = true;

    while (this.queue.length > 0) {
      const currentItem = this.queue.shift();
      if (currentItem) {
        const cacheKey = this.createCacheKey(currentItem.method, currentItem.params);
        try {
          console.log('START ', { method: currentItem.method, params: currentItem.params });
          const result = await this.invokeSnap({ method: currentItem.method, params: currentItem.params });
          console.log({ method: currentItem.method, params: currentItem.params }, result);
          this.cache[cacheKey] = { result };
          currentItem.resolve(result);
        } catch (error) {
          currentItem.reject(error);
        }
      }
    }

    this.processingQueue = false;
  }

  /**
   * Decrypts data
   *
   * @param data the encrypted data
   * @param identity identity to decrypt with
   *
   * @returns the data decrypted
   */
  public async decrypt(
    encryptedData: EncryptionTypes.IEncryptedData,
    identity: IdentityTypes.IIdentity,
  ): Promise<string> {
    if (encryptedData.type !== EncryptionTypes.METHOD.ECIES) {
      throw Error(`The data must be encrypted with ${EncryptionTypes.METHOD.ECIES}`);
    }

    if (!this.supportedIdentityTypes.includes(identity.type)) {
      throw Error(`Identity type not supported ${identity.type}`);
    }

    console.log('? decrypt?', identity);
    const decryptedValue = await this.enqueue('decrypt', { encryptedData, identity });
    console.log('decrypt:', identity, decryptedValue);
    return decryptedValue;
  }

  /**
   * Check if an identity is registered in the provider
   *
   * @param identity identity to check
   *
   * @returns true if the identity is registered, false otherwise
   */
  public async isIdentityRegistered(identity: IdentityTypes.IIdentity): Promise<boolean> {
    console.log('? isIdentityRegistered?', identity);
    const found = await this.enqueue('isRegistered', { identity });
    console.log('isIdentityRegistered:', identity, found);

    // const list = await this.enqueue('list', {});
    // console.log("#####################################################");
    // console.log(list)
    // console.log("#####################################################");

    return found;
  }
}
