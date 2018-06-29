pragma solidity ^0.4.24; // solhint-disable-line

/// @title ERC-20 Token Standard
/// @author Fabian Vogelsteller <fabian@ethereum.org>, Vitalik Buterin <vitalik.buterin@ethereum.org>
/// @dev https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
interface ERC20Interface {
    function decimals() public constant returns (uint8);
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);   // solhint-disable-line
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}


/// @title Safe Math library
/// @dev Math operations with safety checks that throw on error
/// @dev https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/math/SafeMath.sol
library SafeMath {
    /// @dev Multiplies two numbers, throws on overflow.
    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        if (a == 0) {
            return 0;
        }
        c = a * b;
        assert(c / a == b);
        return c;
    }

    /// @dev Integer division of two numbers, truncating the quotient.
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        // uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return a / b;
    }

    /// @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /// @dev Adds two numbers, throws on overflow.
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
}

/// @title Splitter Smart Contract
/// @author Micah Uhrlass
/// @notice Splits requested ether among target accounts
/// @dev Pausable: Gives ability for Owner to pull emergency stop to prevent actions on the network
/// @dev TokenDestructible: Gives owner ability to kill the contract and extract funds to a new contract
contract Splitter {
    using SafeMath for uint256;

    /// TODO: Consider - to hard-code A/B/C accounts or allow adding new accounts to network? (in case A/B/C have issues with their wallet)

    /// STORAGE MAPPINGS
    /// @title List of network members
    /// @dev Key is ethereum account of the participant
    /// @dev Value is a struct that contains the role of the participant
    mapping (address => NetworkMember) public network;

    /// TYPES
    struct NetworkMember {
        bool isSender;
        bool isReceiver;
        int256 allowance;
    }

    /// MODIFIERS
    modifier onlySender() {
        require(network[msg.sender].isSender, "must be a sender");
        _;
    }

    modifier onlyReceiver() {
        require(network[msg.sender].isReceiver, "must be a receiver");
        _;
    }

    constructor() public {} /// TODO: needed?

    /// EVENTS
    event DepositMade(
        address indexed _sender,
        uint256 _amount
    );

    event WithdrawalMade(
        address indexed _sender,
        uint256 _amount
    );

    /// FUNCTIONS
    function Deposit(uint256 amount) public onlySender {
        /// Deposit ETH to wallet
        /// Approve 2 accounts for ETH withdrawal from wallet
        /// emit event
    }

    function Withdraw() public onlyReceiver {
        /// address receiverWallet = 
        /// require() - allowance
        /// Empty wallet to account
        /// emit event
    }
}
