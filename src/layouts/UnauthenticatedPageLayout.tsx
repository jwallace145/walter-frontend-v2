import React, { ReactElement, ReactNode, useState } from 'react';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';

interface UnauthenticatedPageLayoutProps {
  content: ReactNode;
}

const UnauthenticatedPageLayout: React.FC<UnauthenticatedPageLayoutProps> = ({
  content,
}): ReactElement => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      {content}
      <Footer />
    </div>
  );
};

export default UnauthenticatedPageLayout;
