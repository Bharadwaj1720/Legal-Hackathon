// blockchain.js
const crypto = require('crypto');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data; // e.g., document hash, username, etc.
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256').update(
      this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)
    ).digest('hex');
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, Date.now().toString(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newData) {
    const latestBlock = this.getLatestBlock();
    const newBlock = new Block(
      latestBlock.index + 1,
      Date.now().toString(),
      newData,
      latestBlock.hash
    );
    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }

  getChain() {
    return this.chain;
  }
}

module.exports = new Blockchain();
