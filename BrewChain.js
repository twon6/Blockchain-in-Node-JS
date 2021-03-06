const Crypto = require('crypto');				//npm install crypto
const MerkleTree = require('merkletreejs'); 	//npm install merkletreejs

const BrewChain = function() {
	let chain = [];
	let currentBlock = {};
	let genesisBlock = {};
	let difficulty = 3;

	function init(){
		genesisBlock = { 
            index: 0
		  , timestamp: new Date().getTime()
		  , data: 'our genesis data'
		  , previousHash: "-1"
		  , nonce: 0
		  , hash: 9999999999999
		  , merkleRoot: 0
		};

		genesisBlock.merkleRoot = createTree(genesisBlock.data);

		genesisBlock.hash = Crypto.createHash('SHA256').update(genesisBlock.merkleRoot, genesisBlock.timestamp, 
			JSON.stringify(genesisBlock.data), genesisBlock.index, genesisBlock.nonce);

		chain.push(genesisBlock);
		currentBlock = genesisBlock; 
	}

	function createHash(timestamp, data, index, previousHash, nonce ) {
		return Crypto.createHash('SHA256').update(timestamp+JSON.stringify(data)+index+previousHash+nonce).digest('hex');
	}

	function createTree (data){
        let leaves = [data.toString()].map(x => Crypto.createHash('sha256').update(x).digest('hex'));
        var tree = new MerkleTree(leaves, "sha256");
        const root = tree.getRoot();
    
        let str = "";

        for(let i = 0; i < 31; i++)
            str += root[i] + ","; 
        
        str += root[31];
        return str;
    }

	function addToChain(block){

		if(checkNewBlockIsValid(block, currentBlock)){
			chain.push(block);
			currentBlock = block; 
			return true;
		}
		
		return false;
	}

	function createBlock(data){
		let newBlock = {
		    timestamp: new Date().getTime()
		  , data: data
		  , index: currentBlock.index+1
		  , previousHash: currentBlock.hash
		  , nonce: 0
		  , hash: 999999999999999
		  , merkleRoot: 0
		};

		newBlock.merkleRoot = createTree(newBlock.data);
		
		//Getting a hash for the current block for mining
		newBlock.hash = createHash(newBlock.merkleRoot, newBlock.timestamp, 
			JSON.stringify(newBlock.data), newBlock.index, newBlock.previousHash, newBlock.nonce);

	 	newBlock = mineBlock(newBlock);

		return newBlock;
	}

	function mineBlock(newBlock){
        //Creating a string of 0 to show computing power
        while(newBlock.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            newBlock.nonce++;
			newBlock.hash = createHash(newBlock.timestamp, JSON.stringify(newBlock.data), 
				newBlock.index, newBlock.previousHash, newBlock.nonce);;
		}
		
		console.log("Block mined: " + newBlock.hash);
		return newBlock;
	};    
	
	//Loops through chain counting the number of votes for a 
	//given person. 
	function countVotes(name){
		let counter = 0;
		for(let i = 1; i < chain.length; i++){
			block = chain[i];

			if(block.data == name)
				counter++;
		}
		return counter;
	}

	function getLatestBlock(){
		return currentBlock;
	}

	function getTotalBlocks(){
		return chain.length;
	}

	function getChain(){
		return chain;
	}

	function replaceChain(newChain){
		chain = newChain;
		currentBlock = chain[chain.length-1];
	}

	function checkNewBlockIsValid(block, previousBlock){
		if(previousBlock.index + 1 !== block.index){
			//Invalid index
			return false;
		}else if (previousBlock.hash !== block.previousHash){
			//The previous hash is incorrect
			return false;
		}else if(!hashIsValid(block)){
			//The hash isn't correct
			return false;
		}
		
		return true;
	}	

	function hashIsValid(block){
		return (createHash(block.timestamp, JSON.stringify(block.data), block.index, block.previousHash, block.nonce) == block.hash);
	}
	
	function checkNewChainIsValid(newChain){
		//Is the first block the genesis block?
		if(createHash(newChain[0]) !== genesisBlock.hash ){
			return false;
		}

		let previousBlock = newChain[0];
		let blockIndex = 1;

        while(blockIndex < newChain.length){
        	let block = newChain[blockIndex];

        	if(block.previousHash !== createHash(previousBlock)){
        		return false;
        	}

        	if(block.hash.slice(-3) !== "000"){	
        		return false;
        	}

        	previousBlock = block;
        	blockIndex++;
        }

        return true;
	}

	//Loops through the chain comparing the hashes of the currentBlock and the previous 
    //to make sure they match 
	function isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            //Recalculate the hash to make sure the data is the same
            //And the data has not been changed
            if(currentBlock.hash != currentBlock.calcHash())
                return false;
            
            //Compares the hashes of the current and previous block
            //making sure they are the same
            if(currentBlock.prevHash !== previousBlock.hash)
                return false;

            let str = this.createTree(currentBlock.data)

            if(str !== currentBlock.merkelRoot)
                return false;
        }
        return true;
    };

	return {
		init,
		createBlock,
		addToChain,
		checkNewBlockIsValid,
		getLatestBlock,
		getTotalBlocks,
		getChain,
		checkNewChainIsValid,
		replaceChain
	};
};

module.exports = BrewChain;