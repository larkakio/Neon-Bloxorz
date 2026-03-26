// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {DailyCheckIn} from "../src/CheckIn.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        DailyCheckIn c = new DailyCheckIn();
        console2.log("DailyCheckIn deployed at:", address(c));
        vm.stopBroadcast();
    }
}
