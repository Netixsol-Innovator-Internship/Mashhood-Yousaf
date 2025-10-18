export const tokenFaucetABI = [
  // Read
  "function platformToken() view returns (address)",
  "function claimAmount() view returns (uint256)",
  "function cooldownPeriod() view returns (uint256)",
  "function lastClaimTime(address user) view returns (uint256)",
  "function totalClaimed(address user) view returns (uint256)",
  "function getFaucetBalance() view returns (uint256)",
  "function canClaim(address user) view returns (bool)",
  "function getTimeUntilNextClaim(address user) view returns (uint256)",
  "function getUserClaimInfo(address user) view returns (uint256 lastClaim, uint256 totalClaimedAmount, bool canClaimNow, uint256 timeUntilNext)",

  // Write
  "function claimTokens() external",
  "function setClaimAmount(uint256 _newAmount) external",
  "function setCooldownPeriod(uint256 _newPeriod) external",
  "function withdrawTokens(uint256 amount) external",

  // Events
  "event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp)",
  "event ClaimAmountUpdated(uint256 newAmount)",
  "event CooldownUpdated(uint256 newPeriod)",
];
