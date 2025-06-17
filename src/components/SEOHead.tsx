
import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Filiyaa - Heartfelt Gifts for Every Occasion",
  description = "Discover unique, personalized gifts at Filiyaa. From custom jewelry to handcrafted home decor, find the perfect gift to express your love and create lasting memories.",
  image = "/placeholder.svg",
  url = window.location.href,
  type = "website"
}) => {
  const fullTitle = title.includes('Filiyaa') ? title : `${title} | Filiyaa`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="gifts, personalized gifts, custom jewelry, home decor, handcrafted, unique gifts, filiyaa" />
      <meta name="author" content="Filiyaa" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Filiyaa" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOHead;
