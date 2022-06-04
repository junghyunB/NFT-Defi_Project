// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";




// 클레이튼 토큰 import 
// contract '0xce146236fe4e48240cd8f7d22c38c07c7a6bab0b'

contract RandomJolaman is ERC721Enumerable, Ownable, AccessControl {
    using SafeMath for uint256;
    
    uint private _normalTokenIdCount;
    uint private _specialTokenIdCount; // whitelist 전용 token count

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant SPECIAL_MINTER_ROLE = keccak256("SPECIAL_MINTER_ROLE"); // whitelist 전용 minter role

    uint64 public mintingPrice = 2*10**18;
    uint private totalIncome; // 총 판매량

    uint constant public MAX_NORMAL_TOKEN_COUNT = 1000;
    uint constant public MAX_SPECIAL_TOKEN_COUNT = 10020;

    // 용도 모름
    // uint constant public TOKEN_RANK_LENGTH = 4;
    // uint constant public TOKEN_TYPE_LENGTH = 4;

    address public _owner;

    string public metadataURI; // metadata url public? or private?


    mapping(uint => bool) public AlreadyMint;
    mapping(uint => bool) public SpecialAlreadyMint;  

    
    constructor(string memory _metadataURI) ERC721("Jolaman", "JL") {
        _owner = msg.sender;
        metadataURI = _metadataURI;
        totalIncome = 0;
        _normalTokenIdCount = 0;
        _specialTokenIdCount = 10000;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // _grantRole(MINTER_ROLE, msg.sender);
        // _grantRole(SPECIAL_MINTER_ROLE, msg.sender);
    }

    struct JolamanTokenData {
        uint jolamanTokenType; //일반 1~1000 , special 10000~10019
    }

    // tokenId를 넣으면 그에맞는 rank, type 출력 매핑
    mapping(uint => JolamanTokenData) public mappedJolamanTokenData;
    // tokenid 넣으면 그에 맞는 address 출력
    mapping(uint => address) public tokenOwner;
    mapping(address => uint[]) public totalOwnedTokens;
    mapping(address => bool) public isWhiteList;

    // uint[TOKEN_RANK_LENGTH][TOKEN_TYPE_LENGTH] public gemTokenCount; // 무슨용도인지?

    // ERC721에서 tokenURI함수를 기본적으로 제공 해 주나 이 프로젝트에서는 그 함수를 프로젝트 취지에 맞춰서 사용
    function tokenURI(uint _tokenId) override public view returns (string memory) {
        // String.toString() openzeppelin 형변환 라이브러리 사용
        string memory jolamanTokenType = Strings.toString(mappedJolamanTokenData[_tokenId].jolamanTokenType);

        // abi.encodePacked(arg) arg들을 하나로 합쳐주는 함수
        // https://gateway.pinata.cloud/ipfs/QmT4Hef2VNKxr7fuJqZQMKfEPkm5jCLLPKraNrFJeSpg1s
        return string(abi.encodePacked(metadataURI, '/', jolamanTokenType, '.json'));
    }

    function addWhiteList(address _toWhiteList) public onlyOwner{
        isWhiteList[_toWhiteList] = true;
        _grantRole(SPECIAL_MINTER_ROLE, msg.sender);
    }
    function removeWhiteList(address _toWhiteList) public onlyOwner{
        isWhiteList[_toWhiteList] = false;
        renounceRole(SPECIAL_MINTER_ROLE, msg.sender);
    }
    function mappingWrap(uint _tokenId, address to) private {
        tokenOwner[_tokenId] = to;
        totalOwnedTokens[msg.sender].push(_tokenId);
    }

    //   payment는 msg.value 값을 넘겨줘야함
    function payment() public payable returns (bool) {
        require(checkBalance(), "check balance");
        require(checkVal(), "check price");
        (bool success,) = _owner.call{value: msg.value}(""); //owner에게 msg.sender가 msg.value만큼 송금
        // payable(_owner).transfer(value);
        require(success, "Failed to send money");

        totalIncome = totalIncome.add(msg.value);

        _grantRole(MINTER_ROLE, msg.sender);

        return true;
    }

    function safeMint(address to) public payable onlyRole(MINTER_ROLE) {
        require(MAX_NORMAL_TOKEN_COUNT > _normalTokenIdCount, "No more minting is possible");
        require(mintingPrice <= msg.value, "Not enough klay");

        uint256 tokenId = _normalTokenIdCount;
        _normalTokenIdCount = _normalTokenIdCount.add(1);
        JolamanTokenData memory randomTokenData = randomGenerator(msg.sender, tokenId);
        mappedJolamanTokenData[tokenId] = JolamanTokenData(randomTokenData.jolamanTokenType);

        mappingWrap(tokenId, to); //위줄도 wrap에 추가할 예정
        // tokenOwner[tokenId] = to;
        // totalOwnedTokens[msg.sender].push(tokenId);
        _mint(to, tokenId);
    }

    function payandMint() public payable {
        bool paymentStatus = payment();
        if (paymentStatus) {
            safeMint(msg.sender);
            // renounceRole(MINTER_ROLE, msg.sender);
        }
    }

    function safeMintforWhitelist(address to) public payable onlyRole(SPECIAL_MINTER_ROLE) {
        require(isWhiteList[msg.sender] == true);
        require(MAX_SPECIAL_TOKEN_COUNT > _specialTokenIdCount, "No more minting is possible");
        require(mintingPrice <= msg.value, "Not enough klay");
        

        uint256 tokenId = _specialTokenIdCount;
        _specialTokenIdCount = _specialTokenIdCount.add(1);
        JolamanTokenData memory randomTokenData = randomGenerator(msg.sender, tokenId);
        mappedJolamanTokenData[tokenId] = JolamanTokenData(randomTokenData.jolamanTokenType);

        mappingWrap(tokenId, to);
        _mint(to, tokenId);
    }

    function specialPayandMint() public payable {
        bool paymentStatus = payment();
        if (paymentStatus) {
            safeMintforWhitelist(msg.sender);
            // _revokeRole(SPECIAL_MINTER_ROLE, msg.sender); // removeWhiteList 에서 Revoke하기로함
            
        }
    }

       // 토큰아이디를 받아 그 NFT가 어떤 타입을 가지고있는지 반환하는 함수
    function getJolamanTokenType(uint _tokenId) public view returns(uint) {
        return mappedJolamanTokenData[_tokenId].jolamanTokenType;
    }

    // 랜덤 jolamanTokenType 발행 함수 => jolamanTokenType.toString().json == metadata
    function randomGenerator(address _msgSender, uint _tokenId) private returns (JolamanTokenData memory) {

        JolamanTokenData memory randomTokenData;
        uint tempNumer = uint(keccak256(abi.encodePacked(blockhash(block.timestamp), _msgSender, _tokenId))) % 1000;
        
        while (!AlreadyMint[tempNumer]) {
            tempNumer = uint(keccak256(abi.encodePacked(blockhash(block.timestamp), _msgSender, _tokenId))) % 1000;
        }
        if (!AlreadyMint[tempNumer]) {
            AlreadyMint[tempNumer] = true;
            randomTokenData.jolamanTokenType = tempNumer;
        }
        return randomTokenData;

    }
    function specialRandomGenerator(address _msgSender, uint _tokenId) private returns (JolamanTokenData memory) {
        JolamanTokenData memory randomTokenData;
        uint tempNumer = (uint(keccak256(abi.encodePacked(blockhash(block.timestamp), _msgSender, _tokenId))) % 20) + 10000;
        
        while (!SpecialAlreadyMint[tempNumer]) {
            tempNumer = (uint(keccak256(abi.encodePacked(blockhash(block.timestamp), _msgSender, _tokenId))) % 20) + 10000;
        }
        if (!SpecialAlreadyMint[tempNumer]) {
            SpecialAlreadyMint[tempNumer] = true;
            randomTokenData.jolamanTokenType = tempNumer;
        }
        return randomTokenData;
    }


    function getBalance() public view returns (uint256) {
        return msg.sender.balance;
    }

    function setMintingPrice(uint64 _price) public {
        mintingPrice = _price;
       
    }

    function checkBalance() private view returns (bool) {
        if (msg.sender.balance < msg.value) {
            return false;
        } else {
            return true;
        }
    }
    function checkVal() private view returns (bool) {
        if (mintingPrice != msg.value) {
            return false;
        } else {
            return true;
        }
    }

    function getCurrent() public view returns (uint, uint, uint, uint) {
        return (
            _normalTokenIdCount, 
            _specialTokenIdCount, 
            mintingPrice, 
            totalIncome
        );
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}