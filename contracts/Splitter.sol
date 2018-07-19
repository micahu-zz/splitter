pragma solidity ^0.4.23; // solhint-disable-line

import "./SafeMath.sol";


/// @title Splitter Smart Contract
/// @author Micah Uhrlass
/// @notice Splits requested ether among target accounts
contract Splitter {
    using SafeMath for uint256;

    /// TYPES
    address public owner;
    address public bob;
    address public carol;

    /// MAPPINGS
    mapping(address=>uint) public balances;
    
    /// EVENTS
    event DepositMade(address indexed from, address indexed to, uint tokens);

    event WithdrawalMade(address indexed by, uint tokens);

    event MemberAltered(address indexed member, bool isSender);

    /// CONSTRUCTOR
    constructor(address _bob, address _carol) public payable {
        require(_bob != address(0), "address must not equal 0");
        require(_carol != address(0), "address must not equal 0");
        require(_bob != _carol, "addresses must be distinct");
        owner = msg.sender;
        bob = _bob;
        carol = _carol;
    }

    /// FUNCTIONS
    function deposit() public payable returns (bool) {
        uint value = msg.value;
        if(!isEvenNumber(msg.value)) {
            value = value.sub(1);
            balances[owner] = balances[owner].add(1);
        }
        uint256 half = value.div(2);
        emit DepositMade(msg.sender, bob, half);
        emit DepositMade(msg.sender, carol, half);
        balances[bob] = balances[bob].add(half);
        balances[carol] = balances[carol].add(half);
        return true;
    }

    function withdraw() public returns (bool) {
        uint allowance = balances[msg.sender];
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
