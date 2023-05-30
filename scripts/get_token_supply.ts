import { ethers } from 'ethers'
import { appendFileSync, existsSync } from 'fs'
import { abiJson } from '../abi/abi'

const PATH = './data/fx-bridge-token-supply.csv'
const RPC_URL = 'https://eth-mainnet.g.alchemy.com/v2/v0kOjFNd0ddtgqqHqdsieXCGjcCGhWH9'


export type BridgeData = {
  block_height?: number
  block_time?: number
  PUNDIX?: string
  USDT?: string
  DAI?: string
  EURS?: string
  LINK?: string
  C98?: string
  WETH?: string
  BUSD?: string
  FRAX?: string
  USDC?: string
  WBTC?: string
}

const BRIDGE_ADDRESS = '0x6f1D09Fed11115d65E1071CD2109eDb300D80A27'
const ERC20_ABI = [{
  "constant": true,
  "inputs": [
    {
      "name": "_owner",
      "type": "address"
    }
  ],
  "name": "balanceOf",
  "outputs": [
    {
      "name": "balance",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}]
const provider = new ethers.JsonRpcProvider(RPC_URL)
const contract = new ethers.Contract(
  BRIDGE_ADDRESS,
  abiJson,
  provider
)

const saveAsCSV = (data: BridgeData) => {
  const csv = `${data.block_height},${data.block_time},${data.PUNDIX},${data.USDT},${data.DAI},${data.EURS},${data.LINK},${data.C98},${data.WETH},${data.BUSD},${data.FRAX},${data.USDC},${data.WBTC}\n`
  try {
    if (!existsSync(PATH)) {
      const header = 'block_height,block_time,PUNDIX,USDT,DAI,EURS,LINK,C98,WETH,BUSD,FRAX,USDC,WBTC\n'
      appendFileSync(PATH, header)
    }
    appendFileSync(PATH, csv)
  } catch (err) {
    console.error(err)
  }
}

export const getBridgeData = async () => {
  const tokenList = await contract.getBridgeTokenList()
  let res: BridgeData = {}
  res.block_height = await provider.getBlockNumber()
  const block = await provider.getBlock(res.block_height)
  if (block == undefined) return
  res.block_time = block.timestamp
  for (const token of tokenList) {
    const tokenAddress = token[0]
    const tokenSymbol = token[2]
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    )
    const balance = await tokenContract.balanceOf(BRIDGE_ADDRESS)
    res[tokenSymbol as keyof typeof res] = balance.toString()
  }
  saveAsCSV(res)
}

(async () => {
  await getBridgeData()
})().catch(console.error).finally(() => process.exit(0))

