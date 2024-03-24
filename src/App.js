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
      <Search />
      <div className='cards__section'>
        <h3>Homes For You !</h3>
        <hr />

        <div className='cards'>
          <div className='card'>
            <div className='card__image'>
              <img alt='house' />
            </div>
            <div className='card__info'>
              <h4>ETH</h4>
              <p>
                <strong></strong>bds|
                <strong></strong> ba |<strong></strong> sqft
              </p>
              <p>home address</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
