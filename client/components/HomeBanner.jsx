'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function HomeBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    const { data } = await supabase
      .from('homepage_banner')
      .select('*')
      .single();

    if (data) {
      setBanner(data);
    }
  };

  if (!banner) return null;

  return (
    <div className="homeBanner">
      <img
        src={banner.image_url}
        alt="banner"
        className="bannerImage"
      />

      <div className="bannerOverlay">

        <h1>
          {banner.title}
        </h1>

        <a href={banner.button_link}>
          <button>
            {banner.button_text}
          </button>
        </a>

      </div>
    </div>
  );
}