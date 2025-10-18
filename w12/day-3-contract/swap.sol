// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Swap {
    IERC20 public tokenA;       
    IERC20 public tokenB;        

    uint256 public reserveA;    // amount of tokens in pool, pool creates when we add two tokens and thier amount to swap;
    uint256 public reserveB;    // amount of tokens in pool;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
    event Swapped(address indexed user, string direction, uint256 amountIn, uint256 amountOut);


    constructor(address _tokenA, address _tokenB) {
        require(_tokenA != address(0) && _tokenB != address(0), "Invalid token address");
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    /// @notice Add liquidity to the pool
    /// @dev you have t0 approve 

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "Amounts should be greater then 0");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    /// @dev formula (x * y = k)
    /// @notice Swap Token A for Token B
    function swapAforB(uint256 amountAIn) external {
        require(amountAIn > 0, "Amount must be > 0");
        require(reserveB > 0 && reserveA > 0, "No liquidity");

        // Output 
        uint256 amountBOut = (reserveB * amountAIn) / (reserveA + amountAIn);
        require(amountBOut > 0 && amountBOut < reserveB, "Invalid output");

        // Transfer A in, B 
        tokenA.transferFrom(msg.sender, address(this), amountAIn);
        tokenB.transfer(msg.sender, amountBOut);

        reserveA += amountAIn;
        reserveB -= amountBOut;

        emit Swapped(msg.sender, "A->B", amountAIn, amountBOut);
    }

    function swapBforA(uint256 amountBIn) external {
        require(amountBIn > 0, "Amount should be greater then 0");
        require(reserveA > 0 && reserveB > 0, "addLiquidity");

        uint256 amountAOut = (reserveA * amountBIn) / (reserveB + amountBIn);
        require(amountAOut > 0 && amountAOut < reserveA, "Invalid output");

        // Transfer B in, A out
        tokenB.transferFrom(msg.sender, address(this), amountBIn);
        tokenA.transfer(msg.sender, amountAOut);

        reserveB += amountBIn;
        reserveA -= amountAOut;

        emit Swapped(msg.sender, "B->A", amountBIn, amountAOut);
    }

    function getSwapAmount(uint256 amountIn, bool aToB) external view returns (uint256) {
        if (aToB) {
            return (reserveB * amountIn) / (reserveA + amountIn);
        } else {
            return (reserveA * amountIn) / (reserveB + amountIn);
        }
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }
}