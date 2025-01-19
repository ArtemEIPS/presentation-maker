import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Slide } from './../../store/customtypes';
import styles from './SlideList.module.css';
import SlidePreview from './../../components/SlidePreview';

const SlideItem: React.FC<{
  slide: Slide;
  index: number;
  moveSlide: (fromIndex: number, toIndex: number) => void;
  selected: boolean;
  onClick: () => void;
}> = ({ slide, index, moveSlide, selected, onClick }) => {
  const [, ref] = useDrag({
    type: 'SLIDE',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'SLIDE',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveSlide(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drop(ref(node))}
      className={`${styles.slideItem} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <div className={styles.slidePreviewContainer}>
        <SlidePreview key={slide.id} slide={slide} width={100} height={60}/>
        <div className={styles.slideNumber}>{index + 1}</div>
      </div>
    </div>
  );
};

interface SlideListProps {
  slides: Slide[];
  selectedSlideId: string | null;
  onSlideClick: (slideId: string) => void;
  onMoveSlide: (fromIndex: number, toIndex: number) => void;
}

const SlideList: React.FC<SlideListProps> = ({
  slides,
  selectedSlideId,
  onSlideClick,
  onMoveSlide,
}) => {
  return (
    <div className={styles.slideListContainer}>
      {slides.map((slide, index) => (
        <SlideItem
          key={slide.id}
          slide={slide}
          index={index}
          moveSlide={onMoveSlide}
          selected={slide.id === selectedSlideId}
          onClick={() => onSlideClick(slide.id)}
        />
      ))}
    </div>
  );
};

export default SlideList;