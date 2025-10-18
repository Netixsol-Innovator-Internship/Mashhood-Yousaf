// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTMarketPlace
 *
 * Integrates with:
 *  - NFTCollection (ERC721)
 *  - MultiTokenDEX (your DEX - uses getReserves, getAmountOut, swap)
 *  - Platform tokens: tokenA (SMKT), tokenB (TUSD), tokenC (TBTC)
 *
 * Flow:
 *  - Sellers list NFTs with price in tokenA (platform token)
 *  - Buyers can pay in tokenA, tokenB or tokenC.
 *    - If tokenA: simple transferFrom buyer -> seller
 *    - If tokenB/C: buyer transfers payment token to marketplace,
 *      marketplace approves DEX, calls DEX.swap(paymentToken, tokenA, amountIn, minAmountOut),
 *      receives tokenA, then forwards tokenA to seller.
 *
 * Important:
 *  - Buyer must approve marketplace to spend payment token before buy.
 *  - Marketplace uses DEX feePercent (reads from DEX) to compute required input for target output.
 */

interface INFTCollection {
    function ownerOf(uint256 tokenId) external view returns (address);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function getApproved(uint256 tokenId) external view returns (address);
}

interface IMultiTokenDEX {
    // get reserves for token pair (returns reserves in order of tokenA, tokenB as stored by DEX)
    function getReserves(address tokenA, address tokenB) external view returns (uint256 reserveA, uint256 reserveB);
    // compute amountOut using DEX's formula (amountIn, reserveIn, reserveOut)
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) external view returns (uint256);
    // perform swap (caller must approve DEX to pull tokenIn from caller)
    function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external returns (uint256);
    // fee percent (e.g., 3 means 3/1000)
    function feePercent() external view returns (uint256);
}

contract NFTMarketPlace is ReentrancyGuard,  Ownable(msg.sender) {
    using SafeERC20 for IERC20;

    INFTCollection public immutable nftCollection;
    IMultiTokenDEX public immutable dex;

    address public immutable tokenA; // platform token (SMKT)
    address public immutable tokenB; // TUSD
    address public immutable tokenC; // TBTC

    // price stored in tokenA units
    uint256 public basePriceTokenA;

    struct Listing {
        address seller;
        uint256 priceInTokenA;
        bool active;
    }

    mapping(uint256 => Listing) public listings;

    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTUnlisted(uint256 indexed tokenId);
    event NFTBought(uint256 indexed tokenId, address indexed buyer, address paymentToken, uint256 paidAmount);

    constructor(
        address _nftCollection,
        address _dex,
        address _tokenA,
        address _tokenB,
        address _tokenC,
        uint256 _basePriceTokenA
    ) {
        require(_nftCollection != address(0), "Invalid NFT address");
        require(_dex != address(0), "Invalid DEX address");
        require(_tokenA != address(0) && _tokenB != address(0) && _tokenC != address(0), "Invalid tokens");

        nftCollection = INFTCollection(_nftCollection);
        dex = IMultiTokenDEX(_dex);
        tokenA = _tokenA;
        tokenB = _tokenB;
        tokenC = _tokenC;
        basePriceTokenA = _basePriceTokenA;

        transferOwnership(msg.sender);
    }

    // ----------------------
    // Admin Functions
    // ----------------------
    function setBasePrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Invalid price");
        basePriceTokenA = newPrice;
    }

    // ----------------------
    // Listing Logic
    // ----------------------
    function listNFT(uint256 tokenId, uint256 priceInTokenA) external {
        require(nftCollection.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(
            nftCollection.isApprovedForAll(msg.sender, address(this)) ||
            nftCollection.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listings[tokenId] = Listing({
            seller: msg.sender,
            priceInTokenA: priceInTokenA,
            active: true
        });

        emit NFTListed(tokenId, msg.sender, priceInTokenA);
    }

    function unlistNFT(uint256 tokenId) external {
        Listing storage l = listings[tokenId];
        require(l.active, "Not listed");
        require(l.seller == msg.sender || msg.sender == owner(), "Not authorized");

        delete listings[tokenId];
        emit NFTUnlisted(tokenId);
    }

    // ----------------------
    // Buying Logic
    // ----------------------
    function buyWithTokenA(uint256 tokenId) external nonReentrant {
        _buyNFT(tokenId, tokenA);
    }

    function buyWithTokenB(uint256 tokenId) external nonReentrant {
        _buyNFT(tokenId, tokenB);
    }

    function buyWithTokenC(uint256 tokenId) external nonReentrant {
        _buyNFT(tokenId, tokenC);
    }

    /// @dev internal buy flow. paymentToken must be one of tokenA/B/C
    function _buyNFT(uint256 tokenId, address paymentToken) internal {
        Listing storage l = listings[tokenId];
        require(l.active, "NFT not listed");

        address seller = l.seller;
        uint256 priceA = l.priceInTokenA;
        require(seller != address(0), "Invalid seller");
        require(seller != msg.sender, "Seller cannot buy own NFT");

        if (paymentToken == tokenA) {
            // direct transfer of tokenA from buyer -> seller
            IERC20(tokenA).safeTransferFrom(msg.sender, seller, priceA);
        } else {
            // paymentToken is tokenB or tokenC; convert to tokenA via DEX
            require(paymentToken == tokenB || paymentToken == tokenC, "Unsupported payment token");

            // Determine how much paymentToken buyer must send to receive >= priceA in tokenA
            uint256 requiredInput = _getAmountInForOutput(paymentToken, tokenA, priceA);
            require(requiredInput > 0, "Invalid required input");

            // Transfer payment tokens from buyer to marketplace
            IERC20(paymentToken).safeTransferFrom(msg.sender, address(this), requiredInput);

            // Approve DEX to pull paymentToken from marketplace
            IERC20(paymentToken).safeIncreaseAllowance(address(dex), requiredInput);

            // Call DEX.swap(paymentToken -> tokenA), marketplace will receive tokenA
            uint256 receivedA = dex.swap(paymentToken, tokenA, requiredInput, priceA);
            require(receivedA >= priceA, "Insufficient output from swap");

            // Forward tokenA to seller
            IERC20(tokenA).safeTransfer(seller, priceA);

            // If DEX returned more tokenA than priceA, keep or forward extra to seller
            if (receivedA > priceA) {
                uint256 extra = receivedA - priceA;
                IERC20(tokenA).safeTransfer(seller, extra);
            }
        }

        // Transfer NFT to buyer
        nftCollection.safeTransferFrom(seller, msg.sender, tokenId);

        // Remove listing
        delete listings[tokenId];

        emit NFTBought(tokenId, msg.sender, paymentToken, priceA);
    }

    // ----------------------
    // Price helpers
    // ----------------------
    /// @notice Compute how much `paymentToken` is required to get `desiredOut` of `tokenA`.
    /// Uses DEX reserves and feePercent to compute inverse of getAmountOut formula.
    function _getAmountInForOutput(address tokenIn, address tokenOut, uint256 desiredOut) internal view returns (uint256) {
        // fetch reserves in DEX. We need reserveIn and reserveOut in same order
        (uint256 rA, uint256 rB) = dex.getReserves(tokenOut, tokenIn); // pass (tokenA, tokenIn) so rA is reserveA (tokenOut), rB is reserveIn (tokenIn)
        // In our mapping: reserveOut = rA (tokenOut), reserveIn = rB (tokenIn)
        uint256 reserveOut = rA;
        uint256 reserveIn = rB;

        require(reserveOut > desiredOut, "Not enough liquidity");

        uint256 fee = dex.feePercent(); // e.g., 3 (means 3/1000)
        uint256 K = 1000;

        // amountInWithFee = (reserveIn * desiredOut * K) / (reserveOut - desiredOut)
        // then amountIn = ceil(amountInWithFee / (K - fee));
        // Avoid overflow: use uint256 intermediate (solidity 0.8 has checked arithmetic)
        uint256 numerator = reserveIn * desiredOut * K;
        uint256 denominator = (reserveOut - desiredOut);
        if (denominator == 0) return 0;
        uint256 amountInWithFee = (numerator + denominator - 1) / denominator; // ceil division

        uint256 denom2 = (K - fee);
        if (denom2 == 0) return 0;
        // ceil division for amountIn
        uint256 amountIn = (amountInWithFee + denom2 - 1) / denom2;
        return amountIn;
    }

    /// @notice Public price calculator: how much paymentToken needed for a listed NFT
    function calculatePriceInToken(uint256 tokenId, address paymentToken) external view returns (uint256) {
        Listing memory l = listings[tokenId];
        if (!l.active) return 0;
        if (paymentToken == tokenA) return l.priceInTokenA;
        require(paymentToken == tokenB || paymentToken == tokenC, "Unsupported payment token");
        return _getAmountInForOutput(paymentToken, tokenA, l.priceInTokenA);
    }

    // ----------------------
    // Owner utilities
    // ----------------------
    function withdrawToken(address token, uint256 amount, address to) external onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }
}
