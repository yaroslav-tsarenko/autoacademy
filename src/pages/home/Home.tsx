"use client";

import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/hero/Hero";
import { Fade } from "react-awesome-reveal";

const Stories = dynamic(() => import("@/components/stories/Stories"), { ssr: false, loading: () => <div /> });
const Gallery = dynamic(() => import("@/components/gallery/Gallery"), { ssr: false, loading: () => <div /> });
const AboutUs = dynamic(() => import("@/components/about-us/AboutUs"), { ssr: false, loading: () => <div /> });
const Services = dynamic(() => import("@/components/services/Services"), { ssr: false, loading: () => <div /> });
const Benefits = dynamic(() => import("@/components/benefits/Benefits"), { ssr: false, loading: () => <div /> });
const Reviews = dynamic(() => import("@/components/reviews/Reviews"), { ssr: false, loading: () => <div /> });
const Instructors = dynamic(() => import("@/components/instructors/Instructors"), { ssr: false, loading: () => <div /> });
const FAQ = dynamic(() => import("@/components/faq/FAQ"), { ssr: false, loading: () => <div /> });

const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <Stories />
            <Gallery />
            <AboutUs />
            <Services />
            <Benefits />
            <Reviews />
            <Instructors />
            <FAQ />
        </>
    );
};

export default Home;
