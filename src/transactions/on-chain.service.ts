import { web3Wrapper } from '../web3Config'
import { OnChainTransactionStatus } from './dto/on-chain-transaction-status.dto';
import { Inject, Logger, NotImplementedException } from '@nestjs/common';
import { toBN } from 'web3-utils';
import * as fs from "fs"
import { ItemMetadata } from 'src/itemv2/dto/item-metadata';
import { ConfigType } from '@nestjs/config';
import allConfig from 'src/config/allConfig';
import { TransactionReceipt } from 'caver-js';
import { SolidityEvent } from './dto/event';
// import Web3 from 'web3';

/*
Unlike transaction service, This is adapter to block chain
This is utility class so will not have any status variable
*/
export class OnChainService {
  constructor(
    @Inject(allConfig.KEY) private config: ConfigType<typeof allConfig>,
  ) {
    Logger.log(config.chainRpcEndpoint)
    Logger.log(config.contractAddress)
    const wr = new web3Wrapper(config.chainRpcEndpoint, config.contractAddress,
      config.ownerWalletAccount, config.ownerWalletKey);
    this.caver = wr.caver;
    this.contract = wr.nftTokenContract;
  };
  caver;
  contract; // web3 contract

  async getBlockNumber(): Promise<number> {
    try {
      const result = await this.caver.klay.getBlockNumber();
      return result;
    } catch (error) {
      throw new Error(error)
    }
  }

  async queryEvent(eventType: string, fromBlock: number, toBlock: number) {
    const res1: object[] =
      await this.contract.getPastEvents(eventType,
        { fromBlock: fromBlock, toBlock: toBlock, filter: { from: process.env.CHAIN_OWNER_ACCOUNT } })
    const res2: object[] = await this.contract.getPastEvents(eventType,
      { fromBlock: fromBlock, toBlock: toBlock, filter: { to: process.env.CHAIN_OWNER_ACCOUNT } })

    const rr: SolidityEvent[] = []
    res1 && res1.map(i => rr.push(Object.assign(new SolidityEvent(), i)));
    res2 && res2.map(i => rr.push(Object.assign(new SolidityEvent(), i)));

    return rr;
  }

  async queryTransaction(transactionHash: string)
    : Promise<OnChainTransactionStatus> {
    try {
      Logger.log("value:" + transactionHash)
      const result = await this.caver.transaction.getTransactionByHash(transactionHash);
      console.log(result)

      const status = new OnChainTransactionStatus();
      if (!result) {
        status.isGood = false;
        return status;
      }
      status.isGood = result.status === true;
      status.blockNumber = result.blockNumber;
      return status
    } catch (error) {
      throw new Error(error);
    }
  }


  // TODO: Add common errors
  async rawSendNft(toAccount: string, nftId: number): Promise<TransactionReceipt> {

    const nftIdBn = toBN(nftId);
    console.log(this.config.ownerWalletAccount)

    const tx = await this.contract.methods.safeTransferFrom(
      this.config.ownerWalletAccount,
      toAccount,
      nftIdBn
    )

    const signedTx = await this.caver.wallet.sign(this.config.ownerWalletAccount, tx);
    console.log(signedTx)
    const result = await this.caver.rpc.klay.sendRawTransaction(signedTx);
    return result;
  }

  // depredated all below

  async findOwnerByNftId(nftId: number): Promise<string> {
    try {
      const nftIdBn = toBN(nftId);
      // const result = await mintAnimalTokenContract.methods.ownerOf(nftId).call();
      const result = await this.contract.methods.ownerOf(nftIdBn).call();
      return result;
    } catch (error) {
      throw new Error(error)
    }
  }


  async getLevelOfNft(nftId: number): Promise<number> {

    const nftIdBn = toBN(nftId);
    const result = await this.contract.methods.addInfo(
      nftIdBn
    ).call();
    Logger.log(result);
    return result;
  }

  async sendTransactionWithSign(tx: any): Promise<TransactionReceipt> {
    const signedTx = await this.caver.wallet.sign(this.config.ownerWalletAccount, tx);
    console.log(signedTx)
    // this.caver.wallet.sendTransaction()
    const result = await this.caver.rpc.klay.sendRawTransaction(signedTx);
    return result;
  }

  async increaseLevelOfNft(nftId: number, v: number) {

    const nftIdBn = toBN(nftId);
    console.log(this.config.ownerWalletAccount)
    const tx = await this.contract.methods.increaseAddInfo(
      nftIdBn, v
    )
    return this.sendTransactionWithSign(tx)
  }

  async queryNftMetaData(nftId: number): Promise<ItemMetadata> {
    const fromOffline = true;
    var rawFile;
    if (fromOffline) {
      try {
        rawFile = fs.readFileSync("src/resources/metadata/" + nftId + ".json", "utf8");
      } catch (error) {
        throw new Error("Cannot Read Metadata of " + nftId)
      }

      const obj: ItemMetadata = JSON.parse(rawFile)
      Logger.log(JSON.stringify(obj));
      return obj
    }
    throw new NotImplementedException();
  }



}