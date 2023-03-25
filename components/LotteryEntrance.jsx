import { useWeb3Contract } from "react-moralis";
import {abi , contractAddresses} from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect , useState } from "react";
import {ethers} from "ethers"
import { useNotification } from "web3uikit";

const LotteryEntrance = () => {
    const {chainId : chainIdHex , isWeb3Enabled} = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [entranceFee , setEntranceFee] = useState("0");
    const [numberOfPlayers , setNumberOfPlayers] = useState("0");
    const [recentWinner , setRecentWinner] = useState(undefined)
    const [lastTimeStamp ,setLastTimeStamp] = useState(undefined)

    const dispatch = useNotification();

    const {runContractFunction: enterRaffle} =
        useWeb3Contract({
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "enterRaffle",
            params:{} ,
            msgValue: entranceFee
        })

    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params:{} ,
    })

    const {runContractFunction:getNumberOfPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params:{} ,
    })

    const {runContractFunction:getRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params:{} ,
    })

    const {runContractFunction:getLastTimeStamp} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getLastTimeStamp",
        params:{} ,
    })

    const updateUI = async () => {
        const entranceFeeFromContract = (await getEntranceFee()).toString();
        setEntranceFee(entranceFeeFromContract);
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString();
        setNumberOfPlayers(numberOfPlayersFromCall);
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setRecentWinner(recentWinnerFromCall);
        const lastTimeStampFromCall = (await getLastTimeStamp()).toString();
        setLastTimeStamp(lastTimeStampFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
           updateUI();
        }
    },[isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(2)
        console.log("Entered successfuly");
        handleNewNotification(tx)
        await updateUI();
    }

    const handleNewNotification = (tx) => {
        dispatch({
            type:"info",
            message:"Transaction Complete!",
            title:"Tansaction Notification",
            position:"topR",
            icon:"bell"
        })
    }

    return (
        <div>
            {raffleAddress ? (
                <div>
                Lottery Entrance is for {ethers.formatUnits(entranceFee,"ether")} ETH <br/>
                <button
                onClick={async () => {
                    await enterRaffle({
                        onSuccess: async () => await handleSuccess,
                        onError: (error) => console.error(error),
                    })
                }}
                >Enter</button>
                    <div>Current number of players is : {numberOfPlayers}</div>
                    <div>Recent Winners Address : {recentWinner}</div>
                    <div>Last time Stamp : {lastTimeStamp}</div>
                </div>
            ) : (
                <div>No raffle address detected !</div>
            )}
        </div>
    )
}

export default LotteryEntrance;