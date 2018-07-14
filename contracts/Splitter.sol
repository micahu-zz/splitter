pragma solidity ^0.4.23; // solhint-disable-line

import "./SafeMath.sol";


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
        bool isReceiver;
        bool isOwner;
        uint256 allowance;
    }

    address public owner;
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
    
    modifier onlyReceiver() {
        require(network[msg.sender].isReceiver, "must be a receiver");
        _;
    }
    
    /// EVENTS
    event DepositMade(address indexed from, address indexed to, uint tokens);

    event WithdrawalMade(address indexed by, uint tokens);

    event MemberAltered(address indexed member, bool isSender);

    /// CONSTRUCTOR
    constructor(address _alice, address _bob, address _carol) public payable {
        require(_alice != address(0) && _bob != address(0) && _carol != address(0), "address must not equal 0");
        require(_alice != _bob && _bob != _carol && _alice != _carol, "addresses must be distinct");
        network[msg.sender].isOwner = true;
        network[_alice].isSender = true;
        network[_bob].isReceiver = true;
        network[_carol].isReceiver = true;
        network[msg.sender].isReceiver = true;
        owner = msg.sender;
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

    function deposit() public payable onlySender returns (bool) {
        uint value = msg.value;
        if(!isEvenNumber(msg.value)) {
            value = value.sub(1);
            network[owner].allowance = network[owner].allowance.add(1);
        }
        uint256 half = value.div(2);
        emit DepositMade(msg.sender, bob, half);
        emit DepositMade(msg.sender, carol, half);
        network[bob].allowance = network[bob].allowance.add(half);
        network[carol].allowance = network[bob].allowance.add(half);
        return true;
    }

    function withdraw() public returns (bool) {
        uint allowance = network[msg.sender].allowance;
        require(allowance > 0, "nothing to withdraw, allowance equals 0");
        emit WithdrawalMade(msg.sender, allowance);
        msg.sender.transfer(allowance);
        return true;
    }

    function isEvenNumber(uint256 value) private pure returns (bool) {
        uint256 half = value.div(2); // discards any remainder
        if (value == half.mul(2)) return true;
        return false;
    }
    
}
