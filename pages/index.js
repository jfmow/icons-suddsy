import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Home.module.css';

const SvgLoader = () => {
  const [svgData, setSvgData] = useState([]);
  const [search, setSearch] = useState('');
  const [displayedSvgData, setDisplayedSvgData] = useState([]);
  const [loadIndex, setLoadIndex] = useState(0);
  const svgPerPage = 150;

  const loadMoreButtonRef = useRef(null);

  useEffect(() => {
    // Fetch the JSON data (assuming svgList.json is in the public folder)
    fetch('/svgList.json')
      .then((response) => response.json())
      .then((data) => {
        setSvgData(data);
        // Initial load of 200 SVGs
        setDisplayedSvgData(data.slice(0, svgPerPage));
        setLoadIndex(svgPerPage);
      });
  }, []);

  useEffect(() => {
    const loadMoreObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && loadIndex < svgData.length) {
          loadMore();
        }
      },
      { rootMargin: '0px', threshold: 0.7 }
    );

    if (loadMoreButtonRef.current) {
      loadMoreObserver.observe(loadMoreButtonRef.current);
    }

    return () => {
      if (loadMoreButtonRef.current) {
        loadMoreObserver.unobserve(loadMoreButtonRef.current);
      }
    };
  }, [loadIndex, svgData]);

  const loadMore = () => {
    const newSvgData = svgData.slice(loadIndex, loadIndex + svgPerPage);
    setDisplayedSvgData((prevData) => [...prevData, ...newSvgData]);
    setLoadIndex(loadIndex + svgPerPage);
  };

  // Filter the displayed SVGs based on the search input
  const filteredSvgData = displayedSvgData.filter((svgName) =>
    svgName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <input
        type='text'
        placeholder='Search SVGs...'
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchinput}
      />
      <div className={styles.svgcontainer}>
        {filteredSvgData.map((svgName, index) => (
          <div key={index} className={styles.svgitem}>
            <a download href={`/round/${svgName}`}>
              <img src={`/round/${svgName}`} alt={svgName} />
            </a>
          </div>
        ))}
      </div>
      <button
        ref={loadMoreButtonRef}
        onClick={loadMore}
        disabled={loadIndex >= svgData.length}
      >
        Load More
      </button>
    </div>
  );
};

export default SvgLoader;
