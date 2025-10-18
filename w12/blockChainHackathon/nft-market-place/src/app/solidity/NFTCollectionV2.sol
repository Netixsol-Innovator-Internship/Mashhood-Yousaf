// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin
import "@openzeppelin/contracts@v4.9.3/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@v4.9.3/access/Ownable.sol";
import "@openzeppelin/contracts@v4.9.3/utils/Counters.sol";
import "@openzeppelin/contracts@v4.9.3/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts@v4.9.3/token/ERC20/IERC20.sol";

/**
 * @title NFTCollection
 * @dev ERC721 collection that allows:
 *  - owner minting (single + batch)
 *  - public minting by paying PlatformToken (tokenA)
 *  - baseURI management and withdraw of ETH
 *
 * Note: public minting requires buyer to approve tokenA to this contract.
 */
contract NFTCollection is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;

    Counters.Counter private _tokenIdCounter;
    string private _baseTokenURI;

    // Platform token used to pay for public mints (SMKT)
    IERC20 public immutable platformToken; // tokenA

    // Price for public mint in platformToken (in wei, with decimals of token)
    uint256 public publicMintPrice;

    event Minted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event BaseURIChanged(string newBaseURI);
    event PublicMintPriceChanged(uint256 newPrice);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        address _platformToken,
        uint256 _publicMintPrice
    ) ERC721(name_, symbol_) {
        require(_platformToken != address(0), "Invalid platform token");
        _baseTokenURI = baseURI_;
        platformToken = IERC20(_platformToken);
        publicMintPrice = _publicMintPrice;
        _tokenIdCounter.increment(); // start token IDs at 1
    }

    /// @notice Owner mints a single token with metadata URI (owner only)
    function mintTo(address to, string calldata tokenURI_) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        _tokenIdCounter.increment();
        emit Minted(to, tokenId, tokenURI_);
        return tokenId;
    }

    /// @notice Batch mint multiple NFTs to multiple addresses (owner only)
    function batchMint(address[] calldata recipients, string[] calldata tokenURIs) external onlyOwner {
        require(recipients.length == tokenURIs.length, "Length mismatch");
        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            emit Minted(recipients[i], tokenId, tokenURIs[i]);
            _tokenIdCounter.increment();
        }
    }

    /// @notice Public mint: user pays `publicMintPrice` of `platformToken` to mint an NFT to themselves
    /// @dev User must `approve` platformToken to this contract for `publicMintPrice` prior to calling.
    /// Tokens received are forwarded to contract owner (treasury). Change behavior here if you want token sink.
    function publicMint(string calldata tokenURI_) external returns (uint256) {
        require(publicMintPrice > 0, "Public mint price not set");
        // pull tokens from buyer
        platformToken.safeTransferFrom(msg.sender, owner(), publicMintPrice);

        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        _tokenIdCounter.increment();

        emit Minted(msg.sender, tokenId, tokenURI_);
        return tokenId;
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIChanged(newBaseURI);
    }

    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setPublicMintPrice(uint256 newPrice) external onlyOwner {
        publicMintPrice = newPrice;
        emit PublicMintPriceChanged(newPrice);
    }

    // withdraw ETH if contract receives any
    function withdraw(address payable recipient) external onlyOwner {
        require(recipient != address(0), "zero address");
        uint256 balance = address(this).balance;
        require(balance > 0, "no balance");
        (bool sent, ) = recipient.call{value: balance}("");
        require(sent, "transfer failed");
    }

    receive() external payable {}
    fallback() external payable {}
}
