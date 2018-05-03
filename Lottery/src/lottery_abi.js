import web3 from './web3';
import web3ws from './web3ws';
import { abi } from './abi';

// https://rinkeby.etherscan.io/address/0x0b4a3d7e97690c75780c435969b183d0f3d6d382
// current address of blockchain contract
const address = '0x0b4a3d7e97690c75780c435969b183d0f3d6d382';

export const lottery = new web3.eth.Contract(abi, address);
export const lotteryws = new web3ws.eth.Contract(abi, address);