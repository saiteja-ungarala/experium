import { Preloader } from './components/Preloader';
import { Header } from './components/Header';
import { Hero } from './components/hero/Hero';
import { MasterStorytellingSection } from './components/storytelling/MasterStorytellingSection';
import { MainContent } from './components/sections/MainContent';
import './index.css';
import './responsive.css';

function App() {
  return (
    <div className="app-container">
      {/* Cinematic Load Sequence */}
      <Preloader />
      
      {/* Global Transparent Header */}
      <Header />
      
      {/* Hero Section (377 Frames) */}
      <Hero />

      {/* Cinematic Storytelling Section (240 Frames) */}
      <MasterStorytellingSection />

      {/* Rest of the Content */}
      <MainContent />
    </div>
  );
}

export default App;
