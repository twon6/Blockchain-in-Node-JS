# Blockchain-Node-JS


Implementing Blockchain in Node JS. I used the the following sources to assist my implementation. Currentlly, when I add a block to a peer I just overwrite the chain accross all the peer to the chain with the new block. 

Helped me understand the fundementals of mining, and blocks (https://www.youtube.com/watch?v=zVqczFZr124&vl=en) 

Merkle Tree (https://github.com/miguelmota/merkletreejs) 

Helped to understand and used to implement my peer to peer (http://www.darrenbeck.co.uk/blockchain/nodejs/nodejscrypto/)

Run the project and you will see the port and server number. Open multiple terminals to act as different nodes and run the project in each terminal. Each terminal should have unique server and host information.  
open your browser connect as many nodes as you like with the following line;

	http://localhost:3009/addNode/18088	//This is for running with one peer 
	3009 server num and 18088 port number

Example if I had node one 3006, 18091 and node 2 3009 and 18099, to connect the two type in your browser:

	http://localhost:3009/addNode/18091

Then create a block with the line below 

	http://localhost:3009/spawnBrew/data
	3009 is the host and data is any value

I created a block on host 3009 and the block will also be displayed on host 3006

If you are trying to connect 3 or more node you need to connect each node to each other similar to a star topology. 
