// export const platformTokenABI = [
//   "function name() view returns (string)",
//   "function symbol() view returns (string)",
//   "function decimals() view returns (uint8)",
//   "function totalSupply() view returns (uint256)",
//   "function balanceOf(address) view returns (uint256)",
//   "function transfer(address to, uint256 amount) returns (bool)",
//   "function approve(address spender, uint256 amount) returns (bool)",
//   "function transferFrom(address from, address to, uint256 amount) returns (bool)",
//   "function mint(address to, uint256 amount) returns (bool)",
//   "function owner() view returns (address)",
//   "event Transfer(address indexed from, address indexed to, uint256 value)",
//   "event Approval(address indexed owner, address indexed spender, uint256 value)"
// ];

export const platformTokenABI = [
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address) external view returns (uint256)",
  "function transfer(address, uint256) external returns (bool)",
  "function approve(address, uint256) external returns (bool)",
  "function transferFrom(address, address, uint256) external returns (bool)",
  "function allowance(address, address) external view returns (uint256)",
  "function mint(address, uint256) external returns (bool)",
  "function transferOwnership(address) external",

  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Mint(address indexed to, uint256 amount)",
];