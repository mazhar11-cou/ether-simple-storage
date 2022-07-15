const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    //compile them in our code
    // compile them separately
    // http://0.0.0.0:8545
    //http://127.0.0.1:7545
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KAY, provider)
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait .....")
    const contract = await contractFactory.deploy() // Stop here! wait for contract to deploy
    await contract.deployTransaction.wait(1)

    console.log(`Contract Address: ${contract.address}`)

    //Get number

    const currentFavoriteNumber = await contract.retrieve()
    console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`)
    const transectionResponse = await contract.store("7")
    const transectionReceipt = await transectionResponse.wait(1)
    const updateFavoriteNumber = await contract.retrieve()
    console.log(`Updated favorite number is: ${updateFavoriteNumber}`)

    // console.log("Here is the deployment transection (transection response) ");
    // console.log(contract.deployTransaction)
    // console.log("Here is the transection receipt: ");
    // console.log(transectionReceipt);
    //console.log(contract);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
