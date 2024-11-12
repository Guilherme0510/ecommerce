import React from 'react'
import Banner from '../Components/Banner'
import Destaques from '../Components/Destaques'
import Newsletter from '../Components/Newsletter'
import Avaliacao from '../Components/Avaliacao'

const Home = () => {
  return (
    <div className='px-8 mx-auto flex flex-col gap-12'>
      <Banner />
      <Destaques />
      <Avaliacao />
      <Newsletter />
    </div>
  )
}

export default Home
