// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {BitMaps} from "@openzeppelin/contracts/utils/structs/BitMaps.sol";

contract CoffeCoin is ERC20, Ownable {
    BitMaps.BitMap private allowList;

    /////////
    // Errors
    /////////
    error NotAllowlisted();
    error YouHaveExceededMaxSupply(uint256);
    error WrongMaxAmountAllowlist();
    error AlreadyClaimed();

    //////////////////
    // State variables
    //////////////////
    bytes32 private s_merkleRoot;
    uint256 private immutable i_maxSupply;

    ////////////
    // Functions
    ////////////
    constructor(uint256 _maxSupply, uint256 _maxSupplyAllowlist) ERC20("CoffeCoin", "CFC") {
        if (_maxSupplyAllowlist == 0 || _maxSupplyAllowlist >= _maxSupply) {
            revert WrongMaxAmountAllowlist();
        }
        _mint(msg.sender, _maxSupply - _maxSupplyAllowlist);
        i_maxSupply = _maxSupply;
    }

    function mintTokensAllowlist(bytes32[] memory _proof, uint256 _index, uint256 _amount) public {
        // check if already claimed
        if (BitMaps.get(allowList, _index)) {
            revert AlreadyClaimed();
        }
        if (totalSupply() + _amount > i_maxSupply) {
            revert YouHaveExceededMaxSupply(i_maxSupply);
        }
        verify(_proof, msg.sender, _index, _amount);

        // set as claimed
        BitMaps.setTo(allowList, _index, true);
        _mint(msg.sender, _amount);
    }

    function verify(
        bytes32[] memory proof,
        address addr,
        uint256 index,
        uint256 amount
    ) public view {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(addr, index, amount))));
        if (!MerkleProof.verify(proof, s_merkleRoot, leaf)) {
            revert NotAllowlisted();
        }
    }

    function updateMerkleRoot(bytes32 _root) external onlyOwner {
        s_merkleRoot = _root;
    }

    // Getter functions
    function getRoot() public view returns (bytes32) {
        return s_merkleRoot;
    }

    function getMaxSupply() public view returns (uint256) {
        return i_maxSupply;
    }

    function getBitMaps(uint256 _index) public view returns (bool) {
        return BitMaps.get(allowList, _index);
    }
}
