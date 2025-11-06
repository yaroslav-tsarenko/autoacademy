"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { newRequest } from "@/utils/newRequest";

export interface Slider {
    images: string[];
}

export interface MainSection {
    title: string;
    description: string;
    publications: number;
    followers: number;
    students: string;
}

export interface Instructor {
    _id: string;
    fullName: string;
    photo: string;
    description: string;
    characteristics: string[];
}

type Story = {
    url: string;
    type: "image" | "video";
    createdAt: string;
    _id?: string;
};

export type Tariff = {
    _id: string;
    title: string;
    price: string;
    features?: string[];
    buttonText?: string;
    popular?: boolean;
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
    faqs: Faq[];
    sliderImages: string[];
    reviews: Review[];
    mainSection: MainSection | null;
    instructors: Instructor[];
    refreshInstructors: () => Promise<void>;
    refreshMainSection: () => Promise<void>;
    upsertMainSection: (data: MainSection) => Promise<void>;
    refreshReviews: () => Promise<void>;
    refreshSlider: () => Promise<void>;
    refreshPosts: () => Promise<void>;
    refreshStories: () => Promise<void>;
    refreshActuals: () => Promise<void>;
    refreshFaqs: () => Promise<void>;
    tariffs: Tariff[];
    refreshTariffs: () => Promise<void>;
    createTariff: (payload: Partial<Tariff>) => Promise<void>;
    updateTariff: (id: string, payload: Partial<Tariff>) => Promise<void>;
    deleteTariff: (id: string) => Promise<void>;
    contentLoaded: boolean;
}

export interface Post {
    _id: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    text: string;
    createdAt: string;
}

export interface Faq {
    _id: string;
    question: string;
    answer: string;
    createdAt: string;
}

const ContentContext = createContext<ContentContextType>({
    stories: [],
    actuals: [],
    posts: [],
    faqs: [],
    sliderImages: [],
    reviews: [],
    mainSection: null,
    instructors: [],
    tariffs: [],
    contentLoaded: false,
    refreshInstructors: async () => {},
    refreshMainSection: async () => {},
    upsertMainSection: async () => {},
    refreshReviews: async () => {},
    refreshSlider: async () => {},
    refreshPosts: async () => {},
    refreshStories: async () => {},
    refreshActuals: async () => {},
    refreshFaqs: async () => {},
    refreshTariffs: async () => {},
    createTariff: async () => {},
    updateTariff: async () => {},
    deleteTariff: async () => {},
});

export const useContent = () => useContext(ContentContext);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stories, setStories] = useState<Story[]>([]);
    const [actuals, setActuals] = useState<Actual[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [sliderImages, setSliderImages] = useState<string[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [mainSection, setMainSection] = useState<MainSection | null>(null);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [faqs, setFaqs] = useState<Faq[]>([])
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [contentLoaded, setContentLoaded] = useState(false);

    const refreshInstructors = async () => {
        try {
            const res = await newRequest.get("/content/instructors/get-all");
            setInstructors(res.data);
        } catch {
            setInstructors([]);
        }
    };
    const refreshMainSection = async () => {
        try {
            const res = await newRequest.get("/content/main-section/get");
            setMainSection(res.data || null);
        } catch {
            setMainSection(null);
        }
    };

    const upsertMainSection = async (data: MainSection) => {
        await newRequest.post("/content/main-section/upsert", data);
        await refreshMainSection();
    };
    const refreshReviews = async () => {
        try {
            const res = await newRequest.get("/content/reviews/get-all");
            setReviews(res.data);
        } catch {
            setReviews([]);
        }
    };

    const refreshFaqs = async () => {
        try {
            const res = await newRequest.get("/content/faqs/get-all");
            setFaqs(res.data || []);
        } catch {
            setFaqs([]);
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

    const refreshTariffs = async () => {
        try {
            const res = await newRequest.get("/content/tariffs");
            setTariffs(res.data || []);
        } catch (err) {
            console.error("Failed to fetch tariffs", err);
        }
    };

    const createTariff = async (payload: Partial<Tariff>) => {
        await newRequest.post("/content/tariffs/create", payload);
    };

    const updateTariff = async (id: string, payload: Partial<Tariff>) => {
        await newRequest.put(`/content/tariffs/${id}`, payload);
    };

    const deleteTariff = async (id: string) => {
        await newRequest.delete(`/content/tariffs/${id}`);
    };


    const refreshAllContent = async () => {
        setContentLoaded(false);
        try {
            await Promise.all([
                refreshStories(),
                refreshActuals(),
                refreshPosts(),
                refreshSlider(),
                refreshMainSection(),
                refreshReviews(),
                refreshInstructors(),
                refreshFaqs(),
                refreshTariffs(),
            ]);
        } catch (err) {
            console.error("Error during refreshAllContent", err);
        } finally {
            setContentLoaded(true);
        }
    };

    useEffect(() => {
        refreshAllContent();
    }, []);

    return (
        <ContentContext.Provider value={{
            stories,
            actuals,
            refreshStories,
            refreshActuals,
            posts,
            faqs,
            mainSection,
            refreshMainSection,
            upsertMainSection,
            refreshPosts,
            sliderImages,
            refreshSlider,
            reviews,
            instructors,
            contentLoaded,
            refreshFaqs,
            refreshInstructors,
            tariffs,
            refreshTariffs,
            createTariff,
            updateTariff,
            deleteTariff,
            refreshReviews }}>
            {children}
        </ContentContext.Provider>
    );
};
