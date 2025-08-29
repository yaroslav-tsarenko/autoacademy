import React from 'react';
import Hero from "@/components/hero/Hero";
import Stories from "@/components/stories/Stories";
import { media } from "@/resources/media";
import Gallery from "@/components/gallery/Gallery";

const items = [
    { id: 1, title: "Курси",       thumbnail: media.thumbnail_main.src },
    { id: 2, title: "Авто",        thumbnail: media.thumbnail_main.src },
    { id: 3, title: "Інструктори", thumbnail: media.thumbnail_main.src },
    { id: 4, title: "Учні",        thumbnail: media.thumbnail_main.src },
];

const Home = () => {
    return (
        <>
            <Hero />
            <Stories title="Історії" items={items} itemVariant="small" />
            <Gallery/>
        </>
    );
};

export default Home;