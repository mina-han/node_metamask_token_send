const bodyParser = require('body-parser')
const Tx = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const contractAbi = require('../public/js/contractabi.json')
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/3c52917848e945229c0d33d632b10490'));

//console.log("contractAbi:", contractAbi);


const contractAddress = '0xfc45Bea6bcDD28dB3Db45d9A4ac7eD898d9193f8'

const contractOwner = {
	addr: 'yourAccount',
	key: [
      {
         "constant": false,
         "inputs": [
            {
               "name": "_spender",
               "type": "address"
            },
            {
               "name": "_value",
               "type": "uint256"
            }
         ],
         "name": "approve",
         "outputs": [
            {
               "name": "success",
               "type": "bool"
            }
         ],
         "payable": false,
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "constant": true,
         "inputs": [],
         "name": "totalSupply",
         "outputs": [
            {
               "name": "",
               "type": "uint256"
            }
         ],
         "payable": false,
         "stateMutability": "view",
         "type": "function"
      },
      {
         "constant": false,
         "inputs": [
            {
               "name": "_from",
               "type": "address"
            },
            {
               "name": "_to",
               "type": "address"
            },
            {
               "name": "_value",
               "type": "uint256"
            }
         ],
         "name": "transferFrom",
         "outputs": [
            {
               "name": "success",
               "type": "bool"
            }
         ],
         "payable": false,
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "constant": true,
         "inputs": [
            {
               "name": "_owner",
               "type": "address"
            }
         ],
         "name": "balanceOf",
         "outputs": [
            {
               "name": "balance",
               "type": "uint256"
            }
         ],
         "payable": false,
         "stateMutability": "view",
         "type": "function"
      },
      {
         "constant": false,
         "inputs": [
            {
               "name": "_to",
               "type": "address"
            },
            {
               "name": "_value",
               "type": "uint256"
            }
         ],
         "name": "transfer",
         "outputs": [
            {
               "name": "success",
               "type": "bool"
            }
         ],
         "payable": false,
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "constant": true,
         "inputs": [
            {
               "name": "_owner",
               "type": "address"
            },
            {
               "name": "_spender",
               "type": "address"
            }
         ],
         "name": "allowance",
         "outputs": [
            {
               "name": "remaining",
               "type": "uint256"
            }
         ],
         "payable": false,
         "stateMutability": "view",
         "type": "function"
      },
      {
         "anonymous": false,
         "inputs": [
            {
               "indexed": true,
               "name": "_from",
               "type": "address"
            },
            {
               "indexed": true,
               "name": "_to",
               "type": "address"
            },
            {
               "indexed": false,
               "name": "_value",
               "type": "uint256"
            }
         ],
         "name": "Transfer",
         "type": "event"
      },
      {
         "anonymous": false,
         "inputs": [
            {
               "indexed": true,
               "name": "_owner",
               "type": "address"
            },
            {
               "indexed": true,
               "name": "_spender",
               "type": "address"
            },
            {
               "indexed": false,
               "name": "_value",
               "type": "uint256"
            }
         ],
         "name": "Approval",
         "type": "event"
      }
   ]
};

module.exports = function (app) {
   app.use(bodyParser.json());       // to support JSON-encoded bodies
   app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
     extended: true
   }));

   app.get('/', function (req, res) {
      res.render('index.html')
   });

   app.get('/about', function (req, res) {
      res.render('about.html');
   });

   app.post('/sendtoken', function (req, res) {
      let sendCoin = req.body.sendCoin;
      let toAccount = req.body.toAccount

      console.log("sendCoin:", sendCoin);
      console.log("toAccount:", toAccount);

      sendToken(toAccount, sendCoin);

      //console.log('response : ' + response);

      res.render('index.html');
   });

   app.get('/listall', function (req, res) {
      //res.render('about.html');
      console.log('listall...');
      // const getNumber = req.body.getNumber;
      contract.methods.getAllproducts().call()
         .then(productes => {
            console.log(" Value productes: " + productes)
            var response = {
               'result': 'true',
               'getLists': productes
            }

            console.log('response : ' + response);
            res.status(200).json(response);
         });  // end of .then
   });  // end of app.post

   async function sendToken(receiver, amount) {
      console.log(`Start to send ${amount} tokens to ${receiver}`);
      const contract = web3.eth.contract(contractAbi).at(contractAddress);
      const data = contract.transfer.getData(receiver, amount * 1e18);
      const gasPrice = web3.eth.gasPrice;
      const gasLimit = 90000;
      const rawTransaction = {
         'from': contractOwner.addr,
         'nonce': web3.toHex(web3.eth.getTransactionCount(contractOwner.addr)),
         'gasPrice': web3.toHex(gasPrice),
         'gasLimit': web3.toHex(gasLimit),
         'to': contractAddress,
         'value': 0,
         'data': data,
         'chainId': 1
      };

      const privKey = new Buffer.from(contractOwner.key, 'hex');
      const tx = new Tx(rawTransaction, {'chain':'ropsten'});
      tx.sign(privKey);
      const serializedTx = tx.serialize();
      web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
         if (err) {
            console.log(err);
         }
   
         console.log("hash:", hash);
      });
   }


}
