
import React, { useState } from 'react';
import Hero from '@/components/home/Hero';
import Launchpad from '@/components/home/Launchpad';
import HowItWorks from '@/components/home/HowItWorks';
import ImpactMetrics from '@/components/home/ImpactMetrics';
import FAQ from '@/components/home/FAQ';
import BottomCTA from '@/components/home/BottomCTA';
import HowItWorksModal from '@/components/home/HowItWorksModal';
import SixDegrees from '@/components/home/SixDegrees';
import SchoolTicker from '@/components/home/SchoolTicker';
import TestimonialSlider from '@/components/home/TestimonialSlider';
import MicroCase from '@/components/home/MicroCase';

export default function Home() {
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  
  const handleOpenModal = () => {
    setShowHowItWorksModal(true);
  };

  return (
    <div className="bg-white">
      <Hero onOpenHowItWorks={handleOpenModal} />
      <Launchpad />
      <HowItWorks onLearnMore={handleOpenModal} />
      <SchoolTicker />
      <SixDegrees />
      <MicroCase />
      <TestimonialSlider />
      <ImpactMetrics />
      <FAQ />
      <BottomCTA />

      {showHowItWorksModal && (
        <HowItWorksModal 
          open={showHowItWorksModal} 
          onClose={() => setShowHowItWorksModal(false)} 
        />
      )}
    </div>
  );
}
