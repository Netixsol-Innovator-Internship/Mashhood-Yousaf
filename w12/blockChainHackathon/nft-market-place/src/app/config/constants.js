export const CONTRACT_ADDRESSES = {
  platformToken: "0x756366f30Cef03F57251aFeC152719441eb9409B",
  testBTC: "0x555C45e61cF0b0f5cC13E2FB9c3e613E398d9f7B",
  testUSD: "0xA38EA734Ce95Bd192F92C08Af835F49A6c6720e8",
  multiTokenDEX: "0xe6637422Be99F477bF743Ecd3E3E509076FBceaC",
  nftCollection: "0x9b41C04e9C7986542E5C89d99c24CA082cc9002B",
  nftMarketplace: "0x864CC2b02ac77BD254C2bc640E28655DB52163a7",
  tokenFaucet: "0xc4f952181163Ea44F8f533E9369FE0967663c7Ef",
};

export const KASPLEX_CHAIN = {
  id: 167012,
  name: "Kasplex",
  network: "kasplex",
  nativeCurrency: {
    decimals: 18,
    name: "KAS",
    symbol: "KAS",
  },
  rpcUrls: {
    public: { http: ["https://rpc.kasplextest.xyz"] },
    default: { http: ["https://rpc.kasplextest.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "KasplexScan",
      url: "https://explorer.testnet.kasplextest.xyz",
    },
  },
};

export const TOKENS = {
  SMKT: {
    address: CONTRACT_ADDRESSES.platformToken,
    name: "SwapMarket Token",
    symbol: "SMKT",
    decimals: 18,
  },
  TBTC: {
    address: CONTRACT_ADDRESSES.testBTC,
    name: "Test Bitcoin",
    symbol: "TBTC",
    decimals: 18,
  },
  TUSD: {
    address: CONTRACT_ADDRESSES.testUSD,
    name: "Test USD",
    symbol: "TUSD",
    decimals: 18,
  },
};
