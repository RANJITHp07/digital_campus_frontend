import Image from 'next/image'
import Navbar from './component/home/navbar'
import Header from './component/home/header'
import Services from './component/home/services'
import Footer from './component/common/footer'

export default function Home() {
  return (
    <div>
      <Navbar/>
      <hr className='bg-black'/>
      <Header/>
      <Services/>
      <Footer/>
    </div>
  )
}
