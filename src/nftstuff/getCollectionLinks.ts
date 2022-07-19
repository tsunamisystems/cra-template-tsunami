import { Chain } from '@rainbow-me/rainbowkit'
import { etherscanBlockExplorers } from 'wagmi'
import { allChains } from '../networks'
import { OpenseaCollectionStats, OpenseaContractResponse } from './openseaTypes'
export type ButtonInfo = {
  label: string
  link: string
}

// array of buttoninfos. opensea always first. etherscan always second. dont change stuff
export function getCollectionLinks(
  contractAddress: string,
  collectionSlug: string | undefined,
  chainId = 1
): { link: string; label: string }[] {
  if (chainId !== 1) {
    const x = allChains.reduce((prev: { [key: number]: Chain }, curr) => {
      prev[curr.id] = curr
      return prev
    }, {})
    const expl = x[chainId].blockExplorers?.default
    return [
      {
        label: `${expl?.name}`,
        link: `${expl?.url}/token/${contractAddress}`
      }
    ]
  }
  const first = [
    {
      label: 'etherscan',
      link: `https://etherscan.io/token/${contractAddress}`
    },
    {
      label: 'looksrare',
      link: `https://looksrare.org/collections/${contractAddress}`
    },
    {
      label: 'icytools',
      link: `https://icy.tools/collections/${contractAddress}/overview`
    }
  ]
  if (!collectionSlug) {
    // console.log("getCollectionLinks() with no slug");
    return [
      {
        label: 'opensea',
        link: `https://opensea.io/assets/ethereum/${contractAddress}/1`
      },
      ...first
    ]
  }
  // console.log(`getCollectionLinks(${collectionSlug})`);
  return [
    {
      label: 'opensea',
      link: `https://opensea.io/collection/${collectionSlug}`
    },
    ...first,
    {
      label: 'gem',
      link: `https://www.gem.xyz/collection/${collectionSlug}/?sort=rarity_asc`
    },
    {
      label: 'x2y2',
      link: `https://x2y2.io/collection/${collectionSlug}/items`
    }
  ]
}

export class OpenseaCollectionManager {
  public contractAddress: string
  public collectionSlug: string | undefined
  public collectionInfo: OpenseaContractResponse | undefined
  public collectionStats: OpenseaCollectionStats | undefined
  public get ready() {
    return !!this.collectionInfo && !!this.collectionStats
  }
  // setup
  constructor(contractAddress_: string, chainId = 1, auto = false) {
    this.contractAddress = contractAddress_
    if (!!auto) {
      // console.log("SETUP NEW");
      this.getContractInfoOpensea(contractAddress_)
        .then((info) => {
          this.collectionSlug = info.collection.slug
          this.collectionInfo = info
        })
        .catch((e) => {
          console.error('fetching opensea info:', e)
        })
      this.getContractStatsOpensea(contractAddress_)
        .then((stats) => {
          this.collectionStats = stats
        })
        .catch((e) => {
          console.error('fetching opensea stats:', e)
        })
    }
  }

  // collection info
  public async getContractInfoOpensea(contractAddress: string) {
    if (this.collectionInfo) {
      return this.collectionInfo
    }

    const url = `https://api.opensea.io/api/v1/asset_contract/${contractAddress}`
    console.log('fetching opensea collection info: %s', contractAddress)
    const resp = await fetch(url, { referrerPolicy: 'no-referrer' }).catch(
      () => {
        return new Response('error')
      }
    )
    const j = await resp.json()
    // console.log("INFO", j);
    return j as OpenseaContractResponse
  }

  public async getContractListingsOpensea(contractAddress: string) {
    const yurl = `https://api.opensea.io/v2/orders/ethereum/seaport/listings?asset_contract_address=${contractAddress}`
    const resp = await fetch(yurl, { referrerPolicy: 'no-referrer' })
    const j = await resp.json()
    // console.log("LISTINGS", j);
    return j as OpenseaContractResponse
  }

  public async listenOrderFulfilled() {
    const url = `https://api.opensea.io/api/v1/events?only_opensea=false&asset_contract_address=${this.contractAddress}&event_type=successful`
    const c = this.contractAddress
    const resp = await fetch(url, { referrerPolicy: 'no-referrer' })
    const j = await resp.json()
    // console.log('LISTINGS', j)
    return j as any[]
  }
  // collection stats
  public async getContractStatsOpensea(
    collection_slug: string,
    refresh = false
  ) {
    if (!refresh && this.collectionStats) {
      return this.collectionStats
    }
    const url = `https://api.opensea.io/api/v1/collection/${collection_slug}/stats`
    // console.log("fetching opensea collection stats: %s", collection_slug);
    const resp = await fetch(url, {
      referrerPolicy: 'no-referrer',
      cache: 'no-cache'
    })
    const j = (await resp.json()).stats
    // console.log("STATS", j);
    return j as OpenseaCollectionStats
  }
}
