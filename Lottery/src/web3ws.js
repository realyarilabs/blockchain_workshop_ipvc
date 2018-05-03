import Web3 from 'web3';

const _infuraWs = 'wss://rinkeby.infura.io/ws';
const _web3WsProv = new Web3.providers.WebsocketProvider(_infuraWs);

let web3ws = new Web3(_web3WsProv);
console.log('​Using websocket from: ', _infuraWs);
export default web3ws;
