import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import styles from './Player.module.css';

type PlayerProps = {
  initialSlideIndex: number; 
  onExit: (index: number) => void; 
};

const Player: React.FC<PlayerProps> = ({ initialSlideIndex, onExit }) => {
  const navigate = useNavigate();
  const slides = useSelector((state: RootState) => state.present.presentation.slides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const fullScreenHandler = useFullScreenHandle();

  const handleNextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  }, [currentSlideIndex, slides.length]);

  const handlePreviousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  }, [currentSlideIndex]);

  const handleBackToEditor = () => {
    onExit(currentSlideIndex); 
    navigate('/editor');
  };

  const setScale = () => {
    let scale = 1.1;
    if (fullScreenHandler.active) {
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const scaleX = screenWidth / 1000; 
      const scaleY = screenHeight / 600; 

      scale = Math.min(scaleX, scaleY);
    }
    return scale;
  };

  useEffect(() => {
    const handleKeyboardEvents = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNextSlide();
      }
      if (event.key === 'ArrowLeft') {
        handlePreviousSlide();
      }
    };
    
    window.addEventListener('keydown', handleKeyboardEvents);
    return () => window.removeEventListener('keydown', handleKeyboardEvents);
  }, [handleNextSlide, handlePreviousSlide]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <FullScreen handle={fullScreenHandler}>
      <div className={styles.playerContainer}>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={fullScreenHandler.enter}>
            Открыть на весь экран
          </button>
          <button className={styles.button} onClick={handleBackToEditor}>
            Вернуться к редактору
          </button>
        </div>
        {slides.length > 0 && (
          <>
            <div className={styles.slideContainer}>
              <div
                className={styles.slideContent}
                style={{
                  backgroundColor:
                    currentSlide.background.type === 'color'
                      ? currentSlide.background.color
                      : 'transparent',
                  backgroundImage:
                    currentSlide.background.type === 'image'
                      ? `url(${currentSlide.background.imageData})`
                      : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transform: `scale(${setScale()})`,
                }}
              >
                {currentSlide.elements.map((element) => (
                  <div
                    key={element.id}
                    className={styles.element}
                    style={{
                      left: `${element.position.x}px`,
                      top: `${element.position.y}px`,
                      width: `${element.size.width}px`,
                      height: `${element.size.height}px`,
                      position: 'absolute',
                    }}
                  >
                    {element.type === 'text' && (
                      <span
                        className={styles.elementText}
                        style={{
                          color: element.fontColor,
                          fontSize: `${element.fontSize}px`,
                          fontFamily: element.fontFamily,
                        }}
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
                          width: `${element.size.width}px`,
                          height: `${element.size.height}px`,
                          objectFit: 'fill', 
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.slideContainerGuard} />
            </div>
            <div className={styles.buttonBox}>
              <button
                className={styles.button}
                onClick={handlePreviousSlide}
                disabled={currentSlideIndex === 0}
              >
                Предыдущий слайд
              </button>
              <div className={styles.slideNum}>{currentSlideIndex + 1}</div>
              <button
                className={styles.button}
                onClick={handleNextSlide}
                disabled={currentSlideIndex === slides.length - 1}
              >
                Следующий слайд
              </button>
            </div>
          </>
        )}
      </div>
    </FullScreen>
  );
};

export default Player;