"use client";

import React from "react";
import {Fade} from "react-awesome-reveal";
import Hero from "@/components/hero/Hero";
import Stories from "@/components/stories/Stories";
import Gallery from "@/components/gallery/Gallery";
import FAQ from "@/components/faq/FAQ";
import Instructors from "@/components/instructors/Instructors";
import Reviews from "@/components/reviews/Reviews";
import Benefits from "@/components/benefits/Benefits";
import Services from "@/components/services/Services";
import AboutUs from "@/components/about-us/AboutUs";

const Home = () => {
    return (
        <>
            <Hero/>
            <Stories/>
            <Gallery/>
            <AboutUs/>
            <Services/>
            <Benefits/>
            <Reviews/>
            <Instructors/>
            <FAQ/>
        </>
    );
};

export default Home;
