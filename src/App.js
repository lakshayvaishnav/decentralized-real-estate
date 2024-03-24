import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Search from './components/Search'
import Home from './components/Home'

// ABIs
import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'

// Config
import config from './config.json'

function App() {
  const [account, setAccount] = useState('')

  const loadBloackchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    window.ethereum.on('accountsChanged', async () => {
      const accounts = window.ethereum.request({ method: 'requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }
  useEffect(() => {
    loadBloackchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search/>
      <div className='cards__section'>
        <h3>Welcome to Millow ! I EDITIED</h3>
      </div>
    </div>
  )
}

export default App
