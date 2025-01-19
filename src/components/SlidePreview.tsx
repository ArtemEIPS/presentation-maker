import React from 'react';
import styles from './SlidePreview.module.css';
import { Slide } from '../store/customtypes';

type SlidePreviewProps = {
  slide: Slide;
  width?: number;
  height?: number; 
};

const SlidePreview: React.FC<SlidePreviewProps> = ({ slide, width = 100, height = 60 }) => {
  if (!slide) {
    return <div className={styles.slidePreviewContainer}>No Preview</div>;
  }

  return (
    <div
      className={styles.slidePreviewContainer}
      style={{
        width: `${width}px`, 
        height: `${height}px`,
        backgroundColor:
          slide.background.type === 'color' ? slide.background.color : 'transparent',
        backgroundImage:
          slide.background.type === 'image' ? `url(${slide.background.imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {slide.elements.map((element) => (
        <div
          key={element.id}
          className={styles.element}
          style={{
            left: `${element.position.x * 0.1}px`,
            top: `${element.position.y * 0.1}px`,
            width: `${element.size.width * 0.1}px`,
            height: `${element.size.height * 0.1}px`,
          }}
        >
          {element.type === 'text' && (
            <span
              className={styles.elementText}
              style={{ color: element.fontColor, fontSize: '1px' }} 
            >
              {element.content}
            </span>
          )}
          {element.type === 'image' && (
            <img
              src={element.content}
              alt="Element"
              className={styles.elementImage}
              style={{
                width: `${element.size.width * 0.1}px`,
                height: `${element.size.height * 0.1}px`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SlidePreview;