// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract BuyMeACoffee {
    // Event to emit when a memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos received
    Memo[] memos;

    // Address of contract deployer 
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev Buy a coffee for the contract owner
     * @param name Name of the coffee buyer
     * @param message Message from the buyer 
     */
    function buyCoffee(string memory name, string memory message) public payable {
        require(msg.value > 0, "Can't buy coffee with 0 ETH!");

        // Add memo to storage 
        memos.push(Memo(
            msg.sender, 
            block.timestamp,
            name, 
            message
        ));

        // Emit a new log event when a new memo is created 
        emit NewMemo(
            msg.sender, 
            block.timestamp,
            name, 
            message
        );
    }

    /**
     * @dev Send the entire balance stored in the contract to the owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev retrieve all of the memos stored on the blockchain
     */
    function getMemos() public view returns (Memo[] memory){
        return memos;
    }

}