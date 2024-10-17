
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Demo{
    //Array
    uint[10] public items;

    //Enum
    enum Status {Paid, Deliver, Recieve}
    Status public correntStatus;

    function pay() public {
        correntStatus = Status.Paid;
    }

    function delivered() public {
        correntStatus = Status.Paid;
    }
}