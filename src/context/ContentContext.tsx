"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { newRequest } from "@/utils/newRequest";

export interface Slider {
    images: string[];
}

type Story = {
    url: string;
    type: "image" | "video";
    createdAt: string;
    _id?: string;
};

export interface Review {
    _id: string;
    fullName: string;
    avatar: string;
    photo: string;
    rating: number;
    reviews: string;
    ago: string;
    role: string;
    text: string;
    createdAt: string;
}

export interface Actual {
    _id: string;
    url: string;
    title: string;
    thumbnail: string;
    content: string[];
    createdAt: string;
}

interface ContentContextType {
    stories: Story[];
    actuals: Actual[];
    posts: Post[];
    sliderImages: string[];
    reviews: Review[];
    refreshReviews: () => Promise<void>;
    refreshSlider: () => Promise<void>;
    refreshPosts: () => Promise<void>;
    refreshStories: () => Promise<void>;
    refreshActuals: () => Promise<void>;
}

export interface Post {
    _id: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    text: string;
    createdAt: string;
}

const ContentContext = createContext<ContentContextType>({
    stories: [],
    actuals: [],
    posts: [],
    sliderImages: [],
    reviews: [],
    refreshReviews: async () => {},
    refreshSlider: async () => {},
    refreshPosts: async () => {},
    refreshStories: async () => {},
    refreshActuals: async () => {},

});

export const useContent = () => useContext(ContentContext);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stories, setStories] = useState<Story[]>([]);
    const [actuals, setActuals] = useState<Actual[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [sliderImages, setSliderImages] = useState<string[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    const refreshReviews = async () => {
        try {
            const res = await newRequest.get("/content/reviews/get-all");
            setReviews(res.data);
        } catch {
            setReviews([]);
        }
    };

    const refreshSlider = async () => {
        try {
            const res = await newRequest.get("/content/slider/get-all");
            setSliderImages(res.data);
        } catch {
            setSliderImages([]);
        }
    };

    const refreshPosts = async () => {
        try {
            const res = await newRequest.get("/content/posts/get-all");
            setPosts(res.data);
        } catch {
            setPosts([]);
        }
    };

    const refreshStories = async () => {
        try {
            const res = await newRequest.get("/content/stories/get-all");
            setStories(res.data);
        } catch {
            setStories([]);
        }
    };

    const refreshActuals = async () => {
        try {
            const res = await newRequest.get("/content/actuals/get-all");
            setActuals(res.data);
        } catch {
            setActuals([]);
        }
    };

    useEffect(() => {
        refreshStories();
        refreshActuals();
        refreshPosts();
        refreshSlider();
        refreshReviews();
    }, []);

    return (
        <ContentContext.Provider value={{
            stories,
            actuals,
            refreshStories,
            refreshActuals,
            posts,
            refreshPosts,
            sliderImages,
            refreshSlider,
            reviews,
            refreshReviews }}>
            {children}
        </ContentContext.Provider>
    );
};