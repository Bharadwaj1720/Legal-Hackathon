// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentRegistry {
    struct Document {
        string hash;
        uint timestamp;
    }

    mapping(address => Document[]) public documents;

    event DocumentStored(address indexed user, string hash, uint timestamp);

    function storeDocument(string memory hash) public {
        documents[msg.sender].push(Document(hash, block.timestamp));
        emit DocumentStored(msg.sender, hash, block.timestamp);
    }

    function getDocuments() public view returns (Document[] memory) {
        return documents[msg.sender];
    }
}
