## Blockchain Workshop
### Bitcoin, Ethereum and Smart Contracts Programming

---

## Emanuel Mota - @emota7
Founder of Yari Labs

emanuel@yarilabs.com

@yarilabs

---
## About the Talk 

* Intro 
* Blockchain Definitions 
* Ethereum Overview
* Smart Contracts 
* Solidity Programming Language
* ERC20 tokens
* Security Concerns
* Questions 
* Demos & Hands ON

---
### Intro / Get to know the audience !
---

## Wallets setup for the hands on ?
#### Telegram - https://t.me/bragablockchain

* [How to setup Ethereum Wallet](https://gist.github.com/emanuel/6d5dc064b2f26e1b397191854ed04d89)
* If help is need ask *Yari Labs* coaches 
* [www.ethereum.org](www.ethereum.org)
* [metamask.io](https://metamask.io)

---

## Blockchain Overview
+++

### Blockchain Overview
* A blockchain is a globally shared, transactional database. 
* everyone can read entries in the database 
* changes can only happen via transactions accepted by all others
+++

### Blockchain Overview
* transactions are always cryptographically signed
* bundled in blocks and chained together 
 <img src="https://s3.eu-west-2.amazonaws.com/braga-blockchain/blockchain.png" alt=“Blockchain” height="350">

---

### Bitcoin
* Created 3 January 2009 by Satoshi Nakamoto
* Cryptocurrency (Bitcoin)
* Bitcoin Blockchain
* One shared distributed ledger 
* Support for a "Script"
* Limited programmability 

---
### Ethereum 
Many times called "The World Computer"!
+++

### Ethereum 

   <div class="left">
     Ethereum Network
     <img src="https://s3-eu-west-1.amazonaws.com/www.yarilabs.com/assets/img/nodes.png" alt="Ethereum Network" height="400">
  </div>

  <div class="right">
    <p>
      “Each node of the Ethereum network hosts a blockchain database and 
      a node client capable of executing application code stored on blockchain.
      Nodes communicate through <span class="highlight">Wire protocol</span> and expose same interface but 
      can be implemented in different languages.”
    </p>
    <br>
    <p class="lowernote">
      Excerpt From: Roberto Infante. “Building Ethereum ÐApps” 
    </p>
  </div>

+++

### Ethereum
* 5 ethers are created with each new block (mined every 15-17 seconds)
+++

### Ethereum
* Bitcoin like distributed ledger 
* Cryptocurrency (Ether)
* Ethereum Virtual Machine (EVM) 
* Turing complete
+++

### Ethereum
* Ethereum Blockchain
  * Contracts (code) 
  * Storage
  * Logs
  * Events

+++

### Ethereum
* Two kinds of accounts 
  * External Accounts (wallets controlled by humans)
  * Contract Accounts (controlled by code)
  * every account has a balance 
+++

### Ethereum
* Code execution costs GAS 
* Transaction is a message sent from one account to another and can have a data
  payload

---

## Smart Contracts 

+++

### Smart Contracts

> "A smart contract is a computer program that directly controls digital assets
> and which is run in such an environment that it can be trusted to faithfully execute."
<div style="text-align: right"> (Vitalik Buterin) </div>
+++

### Smart Contracts 

Smart contract flow of data 
![smart_contract_flow](assets/sc_flow.png)
+++

![smart_contracts_applications](https://s3.eu-west-2.amazonaws.com/braga-blockchain/sc_application.png)
+++

### Smart Contracts 
* Contract = code (i.e. functions) + data (i.e. state) and resides on the blockchain 
* EVM is the runtime for Smart Contracts on Ethereum
* Accounts have a persistent memory area which is called storage
* Contracts can neither read nor write to any storage apart from their own
+++

### Smart Contracts 
* Contracts can call other contracts 
* 1024 max call stack depth
* Support Events
* Contracts can purge themselves from the blockchain (OPCODE selfdestruct)

---
## Solidity Programming Language
https://solidity.readthedocs.io/
+++

### Solidity 

Solidity is a statically typed, contract programming language that has similarities to 
Javascript, Java and C.

+++

### Solidity 

Has some contract-specific features like:
* modifier (guard) clauses
* event notifiers for listeners 
* custom global variables.
+++

### Solidity 
Hello World

```javascript
  pragma solidity ^0.4.19;

  contract HelloWorld {

  }

```
<p class="lowernote">
  <span class="highlight">version pragma</span> — declares the version of the compiler to be used 
  to avoid breaking changes introduced on future versions
</p>
+++

### Solidity 
Statically typed language 

```javascript
  contract Example {
    // This will be stored permanently in the blockchain
    uint myUnsignedInteger = 100;
    string name;
  }
```

* `uint data type` is an unsigned integer (non-negative number) 
* `int data type` is used for signed integers
* uint has 256 bits we can also have uint8, uint16, uint32 
+++

### Solidity 
More complex data types - Structs 

```javascript
  struct TokenHolder {
    uint age;
    string obs;
  }

  // Arrays
  string[5] stringArray;
  // a dynamic Array - has no fixed size, can keep growing:
  uint[] dynamicArray;
  // Public array
  TokenHolder[] public shareHolders;
```
+++

### Solidity 
Mappings and data type address 

```javascript 
  // For a financial app, storing a uint that holds the user's account balance:
  mapping (address => uint) public accountBalance;

  // Or could be used to store / lookup usernames based on userId
  mapping (uint => string) userIdToName;
```
<ul class="lowernote">
  <li> first example, the key is an address and the value is a uint</li> 
  <li> second example, the key is a uint and the value is a string</li>
</ul>
+++

### Solidity 
Function declarations 

```javascript
  uint[] scores;

  function addNewScore(string _clientId, uint _score) public {
     ... 
     _updateScores(_score);
  }

  function _updatesScores(string _clientId, uint _number) private {
    ...
    scores.push(_number) {
    ...
  }
```
+++

### Solidity 
More about functions 

```javascript
  string greeting = "Whazaaa ?";

  function sayHello() public returns (string) {
      return greeting;
  }
```
+++

### Solidity 
Function Modifiers 

```javascript
  function sayHello() public view returns (string) {

  function _multiply(uint a, uint b) private pure returns (uint) {
    return a * b;
  }

  // Functions can return many arguments, and by specifying returned arguments
  // names we don't need to explicitly return
  function increment(uint x, uint y) returns (uint x, uint y) {
      x += 1;
      y += 1;
  }
  // when a function returns multiple values we need to parallel assign 
  (x1, y1) = increment(1,2);
```
+++

### Solidity 
More on functions Modifiers

``` javascript
  modifier onlyAfter(uint _time) { require (now >= _time); _; }
  modifier onlyOwner { require(msg.sender == owner) _; }

  // Append right after function declaration
  function changeOwner(newOwner) onlyAfter(someTime) onlyOwner() {
      owner = newOwner;
  }
```
+++
### Solidity 
Payable function Modifier

``` javascript
  // All functions that receive ether must be marked 'payable'
  function depositEther() public payable {
      balances[msg.sender] += msg.value;
  }
```
+++
### Solidity 
Events 
<p class="lowernote">
  Events are a way for a contract to communicate that something happened 
  on the blockchain to a front-end client that is 'listening' for events 
</p>

```javascript
  // declare the event
  event IntegersAdded(uint x, uint y, uint result);

  function add(uint _x, uint _y) public returns(uint) {
      uint result = _x + _y;
      // fire an event to let the app know the function was called:
      IntegersAdded(_x, _y, result);
      return result;
  }
```
<p class="lowernote">
  A javascript implementation would look something like:
</p>
```javascript
  YourContract.IntegersAdded(function(error, result) { 
    // do something with result
  }
```
+++

### Solidity 
Important global variables 

```javascript
  this; // address of contract
  this.balance; // often used at end of contract life to transfer balance 
```
```javascript
  // ** msg - Current message received by the contract ** **
  msg.sender; // address of sender
  msg.value; // amount of eth sent to contract (in wei) function should be "payable"
  msg.data; // bytes, complete call data
  msg.gas; // remaining gas
```
```javascript
now; // current time (approximately) - uses Unix time
```
+++

## Important Design Notes

<ul>
  <li> 
    <span class="highlight">Obfuscation:</span> 
       All variables are publicly viewable on blockchain, so anything that is private needs to be obfuscated </li>
  <li> 
    <span class="highlight">Storage optimization:</span> 
       Writing to blockchain is expensive, as data is stored forever</li>
</ul>
+++

## Important Design Notes

<ul>
  <li> <span class="highlight">Cron Job:</span> Contracts must be manually called to handle time-based scheduling </li>
  <li> <span class="highlight">Cost of Gas:</span> the fuel Ethereum DApps run on</li>
</ul>
---
## Some Usefull Links
+++

### Some Usefull Links
* Ethereum website https://www.ethereum.org/
* Online compiler https://remix.ethereum.org/
* Online tools https://rinkeby.etherscan.io 
* https://etherscan.io (block explorer, tx submit)
* EthFiddle https://ethfiddle.com/
+++

### Some Usefull Links
* https://etherchain.org/
* http://infura.io (so you don’t have to run your own node/s)
* Truffle  https://github.com/ConsenSys/truffle. 
* Embark https://github.com/iurimatias/embark-framework
* Open Zeppelin https://openzeppelin.org/
* https://metamask.io/
---
## What is an ERC20 token?
+++

### ERC20 token
ERC stands for Ethereum Request for Comments

```javascript
  contract MyToken {
      /* This creates an array with all balances */
      mapping (address => uint256) public balanceOf;

      /* Initializes contract with initial supply tokens to the creator */
      function MyToken(
          uint256 initialSupply
          ) {
          // Give the creator all initial tokens
          balanceOf[msg.sender] = initialSupply;
      }
```
+++

### ERC20 token (continuation)

```javascript
      /* Send coins */
      function transfer(address _to, uint256 _value) {
          // Check if the sender has enough
          require(balanceOf[msg.sender] >= _value);
          // Check for overflows
          require(balanceOf[_to] + _value >= balanceOf[_to]); 
          balanceOf[msg.sender] -= _value;
          balanceOf[_to] += _value;
      }
  }
```
<p class="lowernote"> (from ethereum.org)</p>
+++

### ERC20 token
<p class="lowernote">
  An ERC20 token implements the following API
</p>
<ul class="lowernote">
  <li> name </li> 
  <li> symbol</li>
  <li> decimals</li>
  <li> transfer(to, value)</li>
  <li> transferFrom(from, to, value)</li>
  <li> approve(spender, value)</li>
  <li> approveAndCall(spender, value, extraData)</li>
  <li> burn(value)</li>
  <li> burnFrom(from, value)</li>
  <li>  </li>
  <li> plus trigger a set of events </li>
</ul>
<p class="lowernote">
  a complete spec of a ERC20 Token check  https://ethereum.org/token
  and https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
</p>
<!-- There are thousands of ethereum based tokens.(https://etherscan.io/tokens) -->
+++

### ERC20 token

```javascript
  contract ERC20Interface {
     function totalSupply() public constant returns (uint);
     function balanceOf(address tokenOwner) 
              public constant returns (uint balance);
     function allowance(address tokenOwner, address spender) 
              public constant returns (uint remaining);
     function transfer(address to, uint tokens) 
              public returns (bool success);
     function approve(address spender, uint tokens)
              public returns (bool success);
     function transferFrom(address from, address to, uint tokens)
              public returns (bool success);
 
     event Transfer(address indexed from, address indexed to, uint tokens);
     event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
 }
```
---

## Security Concerns
+++

* Smart Contracts are a new execution paradigm. Unstoppable applications. 'Code is law'
* The entire stack was developed from scratch (VM, compilers, consensus layer, etc.)
* Direct Financial incentives for Attackers

+++
### Security Concerns
* 18th June 2016
![The DAO hack](https://s3.eu-west-2.amazonaws.com/braga-blockchain/hack_1.png) 

* 19th July 2017
![Parity Wallet hack](https://s3.eu-west-2.amazonaws.com/braga-blockchain/hack_2.png) 

+++
### Security Concerns

* 24 April 2018
![BufferOverflow token hack](https://s3.eu-west-2.amazonaws.com/braga-blockchain/hack_4.png) 

* 26 April 2018
![MEW DNS hack](https://s3.eu-west-2.amazonaws.com/braga-blockchain/hack_3.png) 
+++
### Security Concerns

* Recursive Calls: [Understanding the DAO](https://www.coindesk.com/understanding-dao-hack-journalists)
* Technical Explanation: https://vessenes.com/more-ethereum-attacks-race-to-empty-is-the-real-deal/
* App security: [Parity Multisig Exploit](https://ethereum.stackexchange.com/questions/21618/what-is-the-exploit-behind-paritys-multisig-wallet-from-2017-07-19?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa)
* DNS: [DNS Hijacking](https://peckshield.com/2018/04/26/mew-dns-hijacking)
* OVERFLOW: [proxy overflow](https://peckshield.com/2018/04/25/proxyOverflow)
* OVERFLOW: [batch overflow](https://peckshield.com/2018/04/22/batchOverflow)

---
## Questions ?

### Emanuel Mota 
### http://yarilabs.com  
### @yarilabs

* emanuel@yarilabs.com 
* twitter: @emota7
* github: emanuel

---

## Demos 

### Xavier Francisco 
xavier@yarilabs.com

### Helder Pinto 
helder@yarilabs.com

---
## Hands ON 
* Prepare your rinkeby testnet wallets!
* Telegram - https://t.me/bragablockchain

