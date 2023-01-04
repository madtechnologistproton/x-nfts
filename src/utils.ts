// @ts-ignore ts error TS7016
import Web3 from 'web3'
import { provider as Web3Provider } from 'web3-core'
// @ts-ignore ts error TS2732
import NFT_ABI from './abis/Nft.json'
// @ts-ignore ts error TS2732
import BASE_INCOME_STREAM_ABI from './abis/BaseIncomeStream.json'
import { Network, AssetNFT } from './types'

export const toBaseDenomination = (value: number, decimals: number) =>
  +value.toFixed() / Math.pow(10, decimals)

export const getProvider = (network?: string, infuraId?: string) => {
  switch (network) {
    case 'goerli':
    case 'testnet':
    case 'testnets':
      return new Web3.providers.HttpProvider(
        `https://goerli.infura.io/v3/${infuraId}`
      )
    case 'polygon':
      return new Web3.providers.HttpProvider('https://polygon-rpc.com')
    case 'xdai':
      return new Web3.providers.HttpProvider('https://rpc.gnosischain.com')
    case 'arbitrum':
      return new Web3.providers.HttpProvider('https://arb1.arbitrum.io/rpc')
    case 'mainnet':
    case 'main':
    case 'ethereum':
    default:
      return new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${infuraId}`
      )
  }
}
Web3.givenProvider ||
  new Web3.providers.HttpProvider('https://mainnet.infura.io')

export const ipfsFormat = (ipfsLink: string) => {
  if (ipfsLink.includes('ipfs://')) {
    return `https://ipfs.io/ipfs/${ipfsLink.replace('ipfs://', '')}`
  }
  if (ipfsLink.includes('storageapi.fleek.one')) {
    return ipfsLink.replace('storageapi.fleek.one', 'storageapi2.fleek.co')
  }
  return ipfsLink
}
export const getNFTContract = async (
  provider: Web3Provider,
  contractAddress: string,
  tokenId: string,
  baseIncomeStreamAddress: string,
):Promise<AssetNFT | null> => {
  const nftLink = 'https://exitandutility.on.fleek.co/nft/?id=1&network_id=137&contract=0xd2cb5a9138CB641E9c08129e4AC0e51778925cDc'
  const web3 = new Web3(provider)
  const nftContract = new web3.eth.Contract(NFT_ABI, contractAddress)
  const tokenUri = await nftContract.methods.tokenURI(tokenId).call()
  if (tokenUri) {
    const response = await fetch(ipfsFormat(tokenUri))
    const responseJson = await response.json()
    if (!!responseJson.name || !!responseJson.image) {
    
      const owner = await nftContract.methods.ownerOf(tokenId).call()

      const myBaseIncomeStreamContract = new web3.eth.Contract(
        BASE_INCOME_STREAM_ABI,
        baseIncomeStreamAddress
      )

      const data = await myBaseIncomeStreamContract.methods
        .getOwnerMetadata(contractAddress, tokenId)
        .call()
      const sendTipLink = `https://exitandutility.on.fleek.co/tip?receiver=${owner}`

      if (data) {
        const responseMetadata = await fetch(ipfsFormat(data))
        const responseMetadataJson = await responseMetadata.json()
        let newResponseMetadata = {...responseMetadataJson};
        if (newResponseMetadata?.image) {
          delete newResponseMetadata.image;
        }
        return {
          nftLink,
          sendTipLink,
          owner,
          imageUrl: responseMetadataJson?.image,
          displaytext: responseMetadataJson?.displaytext,
          data: {
            ...newResponseMetadata,
          }
        
        }
      } else {
        return {
          nftLink,
          sendTipLink,
          owner,
        }
      }
    } else {
      return null
    }
  }
  return null
}

export const networkFromString = (name: string) => {
  switch (name) {
    case 'rinkeby':
    case 'testnet':
    case 'testnets':
      return Network.Goerli
    case 'mainnet':
    case 'main':
    default:
      return Network.Mainnet
  }
}
