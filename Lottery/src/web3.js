import Web3 from 'web3';

const _infuraHttp = 'https://rinkeby.infura.io/FdJHU8ZABTe7w1V3hFkb';
const _web3HttpProv = new Web3.providers.HttpProvider(_infuraHttp);

let web3;
// check if metamask are installed
if (window.web3 && window.web3.currentProvider.isMetaMask) {
    // use my package version web3 with injected provider from Metamask 
    web3 = new Web3(window.web3.currentProvider);
    console.log('​web3.currentProvider 1', web3);
} else {
    console.log('MetaMask account not detected :(');
    web3 = new Web3(_web3HttpProv);
    console.log('​web3.currentProvider', web3);
    console.log(`Local provider for ${web3.currentProvider.host}, status: ${web3.currentProvider.connected}`);
}

console.log('​web3.currentProvider', web3);
// Check if Web3 has been injected by the browser (MetaMask).
// (since 'web3' is global, we need to use 'window')
console.log('Running Web3 version: ', web3.version);
export default web3;