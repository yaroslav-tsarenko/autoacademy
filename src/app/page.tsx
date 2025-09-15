import Home from "@/pages/home/Home";
import React from 'react';
import Preloader from "@/components/preloader/Preloader";

const Page = () => {
    return (
        <>
            <Preloader/>
            <Home/>
        </>
    );
};

export default Page;