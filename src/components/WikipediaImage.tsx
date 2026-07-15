"use client";
import { useEffect, useState } from "react";

export default function WikipediaImage({ title, fallbackTitle }: { title: string, fallbackTitle: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        // Try exact title first
        let res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&pithumbsize=800&format=json&origin=*`);
        let data = await res.json();
        let pages = data.query?.pages;
        let pageId = Object.keys(pages || {})[0];
        
        if (pageId && pageId !== "-1" && pages[pageId].thumbnail?.source) {
          setImageUrl(pages[pageId].thumbnail.source);
          return;
        }

        // If no image, try falling back to destination
        res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(fallbackTitle)}&pithumbsize=800&format=json&origin=*`);
        data = await res.json();
        pages = data.query?.pages;
        pageId = Object.keys(pages || {})[0];
        
        if (pageId && pageId !== "-1" && pages[pageId].thumbnail?.source) {
          setImageUrl(pages[pageId].thumbnail.source);
        } else {
          // Ultimate visual fallback if Wikipedia has absolutely no images for this place
          setImageUrl(`https://picsum.photos/seed/${fallbackTitle.replace(/\s+/g, '')}/800/400`);
        }
      } catch (e) {
        setImageUrl(`https://picsum.photos/seed/${fallbackTitle.replace(/\s+/g, '')}/800/400`);
      }
    }
    
    fetchImage();
  }, [title, fallbackTitle]);

  if (!imageUrl) return <div className="absolute inset-0 bg-slate-900 animate-pulse opacity-10 pointer-events-none"></div>;

  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <img src={imageUrl} alt="" className="w-full h-full object-cover mix-blend-overlay" />
    </div>
  );
}
