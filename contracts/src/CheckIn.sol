// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Daily check-in with fixed micro-fee (0.0000005 ETH). Builder code suffix is appended offchain (ERC-8021).
contract DailyCheckIn {
    uint256 public constant CHECK_IN_FEE = 0.0000005 ether;

    address public owner;

    mapping(address => uint256) public lastCheckDay;
    mapping(address => uint256) public streak;

    event CheckedIn(address indexed user, uint256 indexed dayIndex, uint256 newStreak);
    event Withdrawal(address indexed to, uint256 amount);

    error InvalidFee();
    error AlreadyCheckedInToday();
    error Unauthorized();

    constructor() {
        owner = msg.sender;
    }

    function checkIn() external payable {
        if (msg.value != CHECK_IN_FEE) revert InvalidFee();

        uint256 day = block.timestamp / 1 days;
        if (lastCheckDay[msg.sender] == day) revert AlreadyCheckedInToday();

        uint256 prev = lastCheckDay[msg.sender];
        uint256 s = streak[msg.sender];

        if (prev == 0) {
            s = 1;
        } else if (prev == day - 1) {
            s += 1;
        } else {
            s = 1;
        }

        streak[msg.sender] = s;
        lastCheckDay[msg.sender] = day;

        emit CheckedIn(msg.sender, day, s);
    }

    function withdraw() external {
        if (msg.sender != owner) revert Unauthorized();
        uint256 bal = address(this).balance;
        (bool ok, ) = payable(owner).call{value: bal}("");
        require(ok, "withdraw failed");
        emit Withdrawal(owner, bal);
    }

    receive() external payable {}
}
