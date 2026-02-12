import  { useState, useEffect } from "react";
import Hero from "../components/core/Homepage/Hero";
import Features from "../components/core/Homepage/Features";
import CodeBlocks from "../components/core/Homepage/CodeBook";
import HighlightText from "../components/common/HighlightText";
import StatsComponent from "../components/core/Homepage/StatsComponent";
import CodingJourneyCTA from "../components/core/Homepage/CodingJourneyCTA";
import TestimonialSlider from "../components/core/Homepage/TestimonialSlider";
import JoinCommunity from "../components/core/AboutPage/JoinCommunity";


import { useGetAllReviewsQuery } from "../services/authApi";

const HomePage = () => {
  const [token, setToken] = useState<string | null>(null);

  const { data: reviewsData, isLoading } = useGetAllReviewsQuery(undefined);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <>
      <Hero />
      <Features />

      <div>
        <CodeBlocks
          position={"lg:flex-row"}
          heading={
            <div className="text-3xl lg:text-4xl font-semibold">
              Discover your
              <HighlightText text={"Coding Superpower "} />
              with interactive courses
            </div>
          }
          subheading={
            "Our programs are built by experienced developers and mentors who focus on real-world skills, not just theory."
          }
          ctabtn1={{
            btnText: "Explore Courses",
            link: "#",
            active: true,
          }}
          ctabtn2={{
            btnText: "Know more",
            link: "#",
            active: false,
          }}
          codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>`}
          codeColor={"#a78bfa"}
          backgroundGradient={"code-block1-grad"}
        />

        <CodeBlocks
          position={"lg:flex-row-reverse"}
          heading={
            <div className="w-full text-3xl lg:text-4xl font-semibold lg:w-[50%]">
              <HighlightText text={"Start Code from"} /> day one
            </div>
          }
          subheading={
            "Jump straight into hands-on lessons and start writing real world code within minutes."
          }
          ctabtn1={{
            btnText: "Explore Resources",
            link: "#",
            active: true,
          }}
          ctabtn2={{
            btnText: "View Details",
            link: "#",
            active: false,
          }}
          codeColor={"#38bdf8"}
          codeblock={`import React from "react";`}
          backgroundGradient={"code-block2-grad"}
        />
      </div>

      <StatsComponent />

      

      {!token ? (
        <CodingJourneyCTA />
      ) : (
        <JoinCommunity
          text={"Thank You for being part of us!"}
          color={"bg-[#000814]"}
        />
      )}

      <TestimonialSlider
        data={reviewsData?.data || []}
        heading={isLoading}
        
      />
    </>
  );
};

export default HomePage;
