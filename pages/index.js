import { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';

export default function Test() {
  const [gridData, setGridData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const x = 50; // Replace with your desired coordinates
  const y = 50;

  useEffect(() => {
    async function fetchGridData() {
      try {
        const grid = await fetch('/svgGridData.json');
        const gridCoordsData = await grid.json();
        setGridData(gridCoordsData);
      } catch (error) {
        console.error('Error fetching grid data:', error);
      }
    }

    fetchGridData();
  }, []);

  function selectItemByCoords(x, y) {
    for (const item of gridData) {
      if (
        x >= item.x &&
        x <= item.x + item.width && // Assuming each item has a width property
        y >= item.y &&
        y <= item.y + item.height // Assuming each item has a height property
      ) {
        return item.fileName;
      }
    }
    return null;
  }

  const selectedSvg = selectItemByCoords(x, y);

  async function Download(photo, itemname) {
    const img = await fetch(photo);
    const blob = await img.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = itemname;
    link.click();
    URL.revokeObjectURL(url);
  }

  const filteredGridData = gridData.filter((item) =>
    item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <input
        type='text'
        placeholder='Search SVGs...'
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchinput}
      />
      <div className={styles.svgcontainer}>
        {filteredGridData.map((item, index) => (
          <div
            key={index}
            style={{
              width: `64px`, // Adjust as needed
              height: `64px`, // Adjust as needed
              border: selectedSvg === item.fileName ? '2px solid red' : 'none', // Highlight selected item
            }}
            onClick={() => Download(`/round/${item.fileName}`, item.fileName)}
            className={styles.svgitem}
          >
            <div
              className="emoji-icon" // Replace with your CSS class for the icon
              title={item.fileName} // Replace with your title
              style={{
                backgroundImage: `url(/svgGrid.png)`, // Change the source to your actual image URL
                backgroundPosition: `-${item.x}px -${item.y}px`, // Crop the image
                width: `48px`, // Set the icon width
                height: `48px`, // Set the icon height
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
