// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
// Using OpenZeppelin v4.9.3 imports - Remix supports the @v4.9.3 suffix.
import "@openzeppelin/contracts@v4.9.3/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@v4.9.3/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts@v4.9.3/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts@v4.9.3/access/Ownable.sol";
/// @title MyToken - ERC20 with mint/burn/pause and owner access
/// @notice Simple, audited OpenZeppelin-based ERC20 template for Remix testing
contract MyToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    uint8 private immutable _decimals;
    /// @param name_ Token name
    /// @param symbol_ Token symbol
    /// @param initialSupply initial supply in whole tokens (not including decimals)
    /// @param decimals_ number of decimals to use (commonly 18)
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        uint8 decimals_
    ) ERC20(name_, symbol_) {
        _decimals = decimals_;
        _mint(msg.sender, initialSupply * (10 ** uint256(_decimals)));
    }
    /// @notice Owner-only mint
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    /// @notice Pause all token transfers (owner only)
    function pause() external onlyOwner {
        _pause();
    }
    /// @notice Unpause token transfers (owner only)
    function unpause() external onlyOwner {
        _unpause();
    }
    // Override _beforeTokenTransfer required by Solidity for multiple inheritance
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }
    /// @notice decimals override to allow custom decimals
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}