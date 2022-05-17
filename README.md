# P2E game Repository

Frontend (Stage, Testnet) App is deployed at http://3.36.104.36:3001/
Please install testnet klaytn with kaikas

For previous commit log: https://github.com/YONGBAAM/p2egame-nft

Stage Frontend: https://github.com/YONGBAAM/p2egame-nft-frontend

run in prod setting
npm run start:prod

run in dev setting (local DB)
npm run start:dev

# APIs

## ping (hello)
GET / 

## register transaction for deposit

POST /chain/register
{
    "transactionHash": "0x224eb034abd39a08108047c3796a1dd7734e7777a406cd83426775eb88a00bcb",
    "eventType": "Transfer",
    "registeredFrom": "0x61050E06036bE54d82872865053D8Ae32d5f5e82",
    "actionType": "deposit"

}

response 20x

## Withdrawal request of Game Item
POST /chain/withdrawal
{
    "contract": "0xb9d822aE53D407F0aE77BCB8C6F8956c1ddEe671",
    "walletAddress": "0x61050E06036bE54d82872865053D8Ae32d5f5e82",
    "nftId":14

}
response 20x


## Consuming Event
Automatically consume emit events of registered smart-contract every 10sec


# TODOs
유닛 테스트 보완 + 엔드투엔드 유닛테스트 추가
Eth지갑 case sensitiveness 고려
범용 721 or 1155 이용 + 멀티 컨트랙 서포트
Use Enum-like for Transaction type and action type.
