pragma solidity ^0.4.23; // solhint-disable-line

import "./SafeMath.sol";


/// @title Splitter Smart Contract
/// @author Micah Uhrlass
/// @notice Splits requested ether among target accounts
contract Splitter {
    using SafeMath for uint256;

    mapping(address=>uint) public balances;

    event FundsSplit(address indexed from, address indexed to1, address indexed to2, uint value, uint half, uint remainder);

    event WithdrawalMade(address indexed by, uint tokens);

    function splitFunds(address recipient1, address recipient2) public payable returns (bool) {
        require(recipient1 != address(0), "missing 1st recipient's address");
        require(recipient2 != address(0), "missing 2nd recipient's address");
        require(msg.value > 0, "msg.value equals 0");
        uint256 half = msg.value.div(2); // discards any remainder
        uint256 remainder = msg.value.sub(half.mul(2));
        emit FundsSplit(msg.sender, recipient1, recipient2, msg.value, half, remainder);
        if (remainder > 0) {balances[msg.sender] = balances[msg.sender].add(remainder);}
        balances[recipient1] = balances[recipient1].add(half);
        balances[recipient2] = balances[recipient2].add(half);
        return true;
    }

    function withdraw() public returns (bool) {
        uint allowance = balances[msg.sender];
        require(allowance > 0, "nothing to withdraw, allowance equals 0");
        emit WithdrawalMade(msg.sender, allowance);
        msg.sender.transfer(allowance);
        return true;
    }
}
