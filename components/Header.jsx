import { ConnectButton } from "web3uikit";

const Header = () => {
    return (
        <div>
            Decentralized Lottery
            <ConnectButton moralisAuth={false}/>
        </div>
    )
}

export default Header