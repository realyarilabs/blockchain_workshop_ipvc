pragma solidity ^0.4.23;

contract Lottery {
    address public manager;

    string public managerName;

    address[] public players;
    address[] public winners;
    
    event NewPlayer(
        string name,
        uint value,
        address account
    );
    
    event Transfer(
        address from,
        address to,
        uint amount
    );
    
    constructor (string _name) public {
        manager = msg.sender;
        managerName = _name;
    }
    
    function enter(string _name) public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
        // Send events for UI
        emit NewPlayer(
            _name,
            msg.value,
            msg.sender
            );
    }


    function random() public view  returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }
    

    function pickWinner() public restricted { 
        uint index = random() % players.length;
        
        emit Transfer(address(this), players[index], address(this).balance);
        
        players[index].transfer(address(this).balance);
        winners.push(players[index]);
        //reset Lottery
        players = new address[](0);
    }


    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
    
    function getWinners() public view returns (address[]) {
            return winners;
    }
     
}