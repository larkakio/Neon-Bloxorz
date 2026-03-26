// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {DailyCheckIn} from "../src/CheckIn.sol";

contract CheckInTest is Test {
    DailyCheckIn public c;
    address public alice = address(0xA11CE);
    uint256 public fee;

    function setUp() public {
        c = new DailyCheckIn();
        fee = c.CHECK_IN_FEE();
        vm.deal(alice, 10 ether);
    }

    function test_fee() public view {
        assertEq(fee, 0.0000005 ether);
    }

    function test_checkIn_first() public {
        vm.startPrank(alice);
        c.checkIn{value: fee}();
        vm.stopPrank();
        assertEq(c.streak(alice), 1);
        assertEq(c.lastCheckDay(alice), block.timestamp / 1 days);
    }

    function test_revert_wrong_fee() public {
        vm.startPrank(alice);
        vm.expectRevert(DailyCheckIn.InvalidFee.selector);
        c.checkIn{value: fee - 1}();
        vm.stopPrank();
    }

    function test_revert_double_same_day() public {
        vm.startPrank(alice);
        c.checkIn{value: fee}();
        vm.expectRevert(DailyCheckIn.AlreadyCheckedInToday.selector);
        c.checkIn{value: fee}();
        vm.stopPrank();
    }
}
