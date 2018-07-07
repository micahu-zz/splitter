pragma solidity ^0.4.24; // solhint-disable-line


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
contract Splitter {
    using SafeMath for uint256;

    /// STORAGE MAPPINGS
    /// @title List of network members
    /// @dev Key is ethereum account of the participant
    /// @dev Value is a struct that contains the role of the participant
    mapping (address => NetworkMember) public network;

    /// TYPES
    struct NetworkMember {
        bool isSender;
        bool isOwner;
    }

    address public alice;
    address public bob;
    address public carol;

    /// MODIFIERS
    modifier onlyOwner() {
        require(network[msg.sender].isOwner, "must be the contract owner");
        _;
    }

    modifier onlySender() {
        require(network[msg.sender].isSender, "must be a sender");
        _;
    }
    
    /// EVENTS
    event Transfer(address indexed from, address indexed to, uint tokens);

    event MemberAltered(address indexed member, bool isSender);

    /// CONSTRUCTOR
    constructor(address _alice, address _bob, address _carol) public payable {
        require(_alice != _bob, "addresses must be distinct");
        require(_bob != _carol, "addresses must be distinct");
        require(_alice != _carol, "addresses must be distinct");
        network[msg.sender].isOwner = true;
        network[_alice].isSender = true;
        alice = _alice;
        bob = _bob;
        carol = _carol;
    }

    /// FUNCTIONS
    function alterNetworkMember(address _member, bool _isSender) public onlyOwner returns (bool) {
        require(msg.sender != _member, "owner may not alter self");
        NetworkMember storage newMember = network[_member];
        newMember.isSender = _isSender;
        emit MemberAltered(_member, _isSender);
        return true;
    }

    function deposit(uint256 amount) public payable onlySender returns (bool) {
        require(isEvenNumber(amount), "value in wei must be divisible by 2");
        uint256 half = amount.div(2);
        bob.transfer(half);
        carol.transfer(half);
        emit Transfer(msg.sender, bob, half);
        emit Transfer(msg.sender, carol, half);
        return true;
    }

    function isEvenNumber(uint256 value) private pure returns (bool) {
        uint256 half = value.div(2); // discards any remainder
        if (value == half.mul(2)) return true;
        return false;
    }
    
}
