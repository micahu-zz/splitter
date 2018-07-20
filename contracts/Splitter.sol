pragma solidity ^0.4.23; // solhint-disable-line

import "./SafeMath.sol";


/// @title Splitter Smart Contract
/// @author Micah Uhrlass
/// @notice Splits requested ether among target accounts
contract Splitter {
    using SafeMath for uint256;

    /// MAPPINGS
    mapping(address=>uint) public balances;
    
    /// EVENTS
    event FundsSplit(address indexed from, address indexed to1, address indexed to2, uint tokens, uint remainder);

    event WithdrawalMade(address indexed by, uint tokens);

    event MemberAltered(address indexed member, bool isSender);

    /// CONSTRUCTOR
    constructor() public {
        require(msg.value == 0);
    }

    /// FUNCTIONS
    function splitFunds(address recipient1, address recipient2) public payable returns (bool) {
        uint value = msg.value;
        uint256 half = value.div(2);
        uint256 remainder = value % 2;
        emit FundsSplit(msg.sender, recipient1, recipient2, half, remainder);
        balances[msg.sender] = msg.sender.balance.add(remainder);
        balances[recipient1] = recipient1.balance.add(half);
        balances[recipient2] = recipient2.balance.add(half);
        return true;
    }

    function withdraw() public returns (bool) {
        uint allowance = msg.sender.balance;
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
