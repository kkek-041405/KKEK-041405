import TopNavBar from './components/TopNavBar';
import HeroSection from './components/HeroSection';
import FeaturedProjectsSection from './components/FeaturedProjectsSection';
import SkillsSection from './components/SkillsSection';
import LeadershipSection from './components/LeadershipSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar />
      <main className="flex-grow pt-24 pb-xl flex flex-col gap-[64px]">
        <HeroSection />
        <FeaturedProjectsSection />
        <SkillsSection />
        <LeadershipSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
