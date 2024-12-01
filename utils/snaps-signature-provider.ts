import { IdentityTypes, SignatureProviderTypes, SignatureTypes } from '@requestnetwork/types';

// import { areEqualIdentities, normalize, recoverSigner } from '@requestnetwork/utils';

interface QueueItem {
  method: string;
  params: any;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

interface CacheItem {
  result: any;
}

export class SnapsSignatureProvider
  implements SignatureProviderTypes.ISignatureProvider
{
  private invokeSnap;
  
  /** list of supported encryption method */
  public supportedMethods: SignatureTypes.METHOD[] = [SignatureTypes.METHOD.EDDSA_POSEIDON];
  /** list of supported identity types */
  public supportedIdentityTypes: IdentityTypes.TYPE[] = [IdentityTypes.TYPE.POSEIDON_ADDRESS];

  constructor(invokeSnap: any) {
    this.invokeSnap = invokeSnap;
  }

  /**
   * Signs data
   *
   * @param data The data to sign
   * @param signer The identity to sign with
   *
   * @returns The signed data
   */
  public async sign(
    data: any,
    signer: IdentityTypes.IIdentity,
    rawSignature = false,
  ): Promise<SignatureTypes.ISignedData> {
    if (!this.supportedIdentityTypes.includes(signer.type)) {
      throw Error(`Identity type not supported ${signer.type}`);
    }
  
    const signature = await this.invokeSnap({ method: 'sign_eddsa', params: { identity: signer, data, rawSignature } });

    return {
      data,
      signature: {
        method: SignatureTypes.METHOD.EDDSA_POSEIDON,
        value: signature,
      },
    };
  }
}
