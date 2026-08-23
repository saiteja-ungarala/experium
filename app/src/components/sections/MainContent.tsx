import React from 'react';
import { EscapeCardsSection } from './EscapeCardsSection';
import { ExperiumCollectionSection } from './ExperiumCollectionSection';
import { FinalCardSequenceSection } from './FinalCardSequenceSection';
import { FooterSection } from './FooterSection';

export const MainContent: React.FC = () => {
  return (
    <main className="section-light" style={{ position: 'relative', zIndex: 20 }}>
      <EscapeCardsSection />
      <ExperiumCollectionSection />
      <FinalCardSequenceSection />
      <FooterSection />
    </main>
  );
};
