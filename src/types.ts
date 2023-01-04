// @ts-ignore ts error TS7016
import Web3 from 'web3'

export enum PriceType {
  Current = 'current',
  Previous = 'previous',
}

export enum Network {
  Mainnet = 'mainnet',
  Goerli = 'goerli',
  Polygon = 'polygon',
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export interface State {
  network: Network
}

export interface ButtonEvent {
  detail: {
    type: string
  }
}

export interface AssetNFT {
  nftLink: string
  sendTipLink: string
  owner: string
  imageUrl?: string
  displaytext?: string
  data?: { [key: string]: string; }
}
