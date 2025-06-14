import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import BgSlider from '../components/BgSlider'
import Testimonials from '../components/Testimonials.jsx'
import Upload from '../components/Upload.jsx'
const Home = () => {
  return (
    <div>
      <Header />
      <Steps />
        <BgSlider />
        <Testimonials />
        <Upload /> 
    </div>
  )
}

export default Home
