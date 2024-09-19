import { DecryptionProviderTypes, EncryptionTypes, IdentityTypes } from '@requestnetwork/types';

/**
 * Implementation of the decryption provider from private key
 * Allows to decrypt() with "ethereumAddress" identities thanks to their private key given in constructor() or addDecryptionParameters()
 */
export class SnapsDecryptionProvider
  implements DecryptionProviderTypes.IDecryptionProvider
{
  private invokeSnap;
  /** list of supported encryption method */
  public supportedMethods: EncryptionTypes.METHOD[] = [EncryptionTypes.METHOD.ECIES];
  /** list of supported identity types */
  public supportedIdentityTypes: IdentityTypes.TYPE[] = [IdentityTypes.TYPE.ETHEREUM_ADDRESS];

  /** Dictionary containing all the private keys indexed by address */
//   private decryptionParametersDictionary: IDecryptionParametersDictionary;

  constructor(invokeSnap: any) {
    this.invokeSnap = invokeSnap;
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

    const decryptedValue = await this.invokeSnap({ method: 'decrypt', params: {
      encryptedData,
      // :{
      //   type: 'ecies',
      //   value: 'e462a1c191d0ded75d658d18893c3ea9023b320924af170bc167d3b6fdfc14fc664527d2ee0387c84a41d671fe28b7ee15906b9d2cf4b7fb31b61541aa9bce6ede0ffe592b3b089f8caaa29d2b1a03afb7f08ed8adcd322cd1c40b97f4b2f1d9d3'
      // }, 
      identity
      // : {
      //   type: 'ethereumAddress',
      //   value: '0xb3de30b4be816dd066b1c5c5c8aed340b88a18a1'
      // }
    } });

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
    // TODO
    return true;
  }

}


