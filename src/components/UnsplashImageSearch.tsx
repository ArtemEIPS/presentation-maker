import React, { useState } from 'react';

type UnsplashImageSearchProps = {
  onSelectImage: (imageUrl: string) => void;
};

const UnsplashImageSearch: React.FC<UnsplashImageSearchProps> = ({ onSelectImage }) => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const searchImages = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
      console.log('Access Key:', accessKey); 
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&per_page=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); 

      const imageUrls = data.results.map((result: any) => result.urls.regular);
      setImages(imageUrls);
      console.log('Images:', imageUrls); 
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for images..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchImages} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
        {images.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Unsplash ${index}`}
            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
            onClick={() => onSelectImage(imageUrl)}
          />
        ))}
      </div>
    </div>
  );
};

export default UnsplashImageSearch;