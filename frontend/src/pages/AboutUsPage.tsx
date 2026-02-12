import React from 'react'
import Hero from '../components/core/AboutPage/Hero'
import AboutSection from '../components/core/AboutPage/AboutSection'
import SuccessStories from '../components/core/AboutPage/SuccessStories'
import JoinCommunity from '../components/core/AboutPage/JoinCommunity'
const AboutUsPage = () => {
  return (
    <>
      <Hero/>
      <AboutSection/>
      <SuccessStories/>
      <JoinCommunity text={"Join us at other platforms"}/>
    </>
  )
}

export default AboutUsPage
