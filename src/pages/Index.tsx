import React from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { FeaturedCars } from "@/components/cars/FeaturedCars";
import { CarHighlights } from "@/components/cars/CarHighlights";
import { AboutSection } from "@/components/about/AboutSection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <Header />
      <Navigation />
      <main className="max-w-none mx-auto p-5 max-md:max-w-[991px] max-sm:max-w-screen-sm">
        <FeaturedCars />
        <CarHighlights />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
