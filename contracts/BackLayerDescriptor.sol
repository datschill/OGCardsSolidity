// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/ILayerDescriptor.sol";
import "./interfaces/IOGCards.sol";

contract BackLayerDescriptor is ILayerDescriptor {
    using Strings for uint256;
    using Strings for uint8;

    constructor() {}

    function svgLayer(address ogCards, uint256 tokenId, string memory font, string memory borderColor, IOGCards.Card memory card)
        external
        override
        view
        returns (string memory)
    {
        string memory backgroundColor = "#2c3e50";
        string memory circleElements = "";
        for (uint256 i=0; i<card.holders.length; i++) {
            address holder = card.holders[i];
            string memory fillColor = IOGCards(ogCards).isOG(holder) ? '#daa520' : '#212429';
            uint256 cx = ((card.dna / 10) * i) % 100;
            uint256 cy = ((card.dna / 100) * i) % 100;
            uint256 durCx = card.dna % 3 + i;
            uint256 durCy = card.dna % 3 + 2 + i;
            circleElements = string(abi.encodePacked(
                circleElements,
                '<circle cx="',cx.toString(),'%" cy="',cy.toString(),'%" r="2%" fill="',fillColor,'" stroke="',borderColor,'" >',
                    '<animate attributeName="cx" dur="',durCx.toString(),'" values="3%;97%;3%" repeatCount="indefinite" />',
                    '<animate attributeName="cy" dur="',durCy.toString(),'" values="3%;97%;3%" repeatCount="indefinite" />',
                '</circle>'
            ));
        }
        return string(abi.encodePacked(
            '<rect width="100%" height="100%" fill="',backgroundColor,'"/>',
            circleElements
        ));
    }

    function svgMask(uint8 maskType, string memory borderColor, bool isDef, bool isMask)
        public
        override
        pure
        returns (string memory)
    {
        return "";
    }
}