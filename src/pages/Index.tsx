
import React from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { CarHighlights } from "@/components/cars/CarHighlights";
import { AboutSection } from "@/components/about/AboutSection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen font-inter">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <Header />
      <Navigation />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="mb-6 md:mb-10">
            <CarHighlights />
          </div>
          <AboutSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
