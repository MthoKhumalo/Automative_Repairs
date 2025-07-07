import React, { useState } from 'react';
import '../CSS/Content.css';
import image1 from '../images/Image1.jpg';
import image2 from '../images/Image2.jpg';
import image3 from '../images/Image3.jpg';
import image4 from '../images/Image4.png';
import image5 from '../images/Image5.jpg';
import image6 from '../images/Image6.jpg';
import image7 from '../images/Image7.jpg';
import image8 from '../images/Image8.jpg';
import image9 from '../images/Image9.jpeg';
import image10 from '../images/Image10.png';
import image11 from '../images/Image11.jpg';
import image12 from '../images/Image12.jpg';

const Content = () => {

    const [popupContent, setPopupContent] = useState(null);
  
    const images = [
      { src: image1, header: 'Header 1', context: 'Context for image 1' },
      { src: image2, header: 'Header 2', context: 'Context for image 2' },
      { src: image3, header: 'Header 3', context: 'Context for image 3' },
      { src: image4, header: 'Header 4', context: 'Context for image 4' },
      { src: image5, header: 'Header 5', context: 'Context for image 5' },
      { src: image6, header: 'Header 6', context: 'Context for image 6' },
      { src: image7, header: 'Header 7', context: 'Context for image 7' },
      { src: image8, header: 'Header 8', context: 'Context for image 8' },
      { src: image9, header: 'Header 9', context: 'Context for image 9' },
      { src: image10, header: 'Header 10', context: 'Context for image 10' },
      { src: image11, header: 'Header 11', context: 'Context for image 11' },
      { src: image12, header: 'Header 12', context: 'Context for image 12' }
    ];
  
    const handleImageClick = (image) => {
      setPopupContent(image);
    };
  
    const closePopup = () => {
      setPopupContent(null);
    };


  
    return (
      <div className="content">
        {/*<div className="welcome-section">

          <h1>Welcome to FIX IT</h1>

        </div>*/}

        <div className="context-section">
          {Array(4).fill().map((_, rowIndex) => (
            <div className="image-block" key={rowIndex}>
              {images.slice(rowIndex * 3, (rowIndex + 1) * 3).map((image, index) => (

                <img

                  key={index}
                  src={image.src}
                  alt={`Image ${index + 1}`}
                  onClick={() => handleImageClick(image)}

                />

              ))}
            </div>
          ))}
        </div>
  
        {popupContent && (
          <div className="popup">
            <div className="popup-content">

              <span className="close" 
                    onClick={closePopup}>&times;
              </span>
              <h2>{popupContent.header}</h2>
              <p>{popupContent.context}</p>
              
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Content;