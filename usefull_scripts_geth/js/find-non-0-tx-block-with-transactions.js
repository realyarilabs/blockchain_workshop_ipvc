/*
 * Find Non-Zero Transaction Count In A Range Of Blocks
 */
function checkTransactionCount(startBlockNumber, endBlockNumber) {
  console.log("Searching for non-zero transaction counts between blocks "  + startBlockNumber + " and " + endBlockNumber);
  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    var block = eth.getBlock(i);
    if (block != null) {
      if (block.transactions != null && block.transactions.length != 0) {
        console.log("Block #" + i + " has " + block.transactions.length + " transactions");
        block.transactions.forEach(function(t) {
            printTransaction(t)
        })
      }
    }
  }
}

function printTransaction(txHash) {
  var tx = eth.getTransaction(txHash);
  if (tx != null && tx.value > 0) {
    console.log("  tx hash          : " + tx.hash + "\n"
      + "   nonce           : " + tx.nonce + "\n"
      + "   blockHash       : " + tx.blockHash + "\n"
      + "   blockNumber     : " + tx.blockNumber + "\n"
      + "   transactionIndex: " + tx.transactionIndex + "\n"
      + "   from            : " + tx.from + "\n"
      + "   to              : " + tx.to + "\n"
      + "   value           : " + tx.value + "\n"
      + "   gasPrice        : " + tx.gasPrice + "\n"
      + "   gas             : " + tx.gas + "\n"
      + "   input           : " + tx.input + "\n\n");
  }
}
