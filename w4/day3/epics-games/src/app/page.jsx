'use client'
import { Catalog } from "@/components/catalog";
import Footer from "@/components/footer";
import { FreeGames } from "@/components/free-games";
import { GameSlider } from "@/components/game-slider";
import { Header } from "@/components/header";
import HeroSection from "@/components/hero-section";
import SearchBar from "@/components/search-bar";
import { ThreeGamesCard } from "@/components/three-games";
import { TopGames } from "@/components/top-sellers";

// app/page.tsx
export default function HomePage() {
  return (
    <>
      <main className="w-full bg-black">
          <Header />
        <div className="max-w-[1200px] mx-auto ">
          <SearchBar />
          <HeroSection />
          <GameSlider />
          <ThreeGamesCard />
          <FreeGames />
          <TopGames />
          <ThreeGamesCard />
          <GameSlider />
          <Catalog />
        </div>
        <Footer />
      </main>
    </>
  );
}
