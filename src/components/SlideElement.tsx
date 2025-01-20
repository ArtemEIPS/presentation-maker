import React, { CSSProperties, useCallback, useEffect, useRef } from 'react';
import { SlideElement } from '../store/customtypes';
import useDragAndResize from '../components/useDragAndResize';
import styles from './SlideElement.module.css';

type SlideElementProps = {
  element: SlideElement;
  onUpdateElement: (elementId: string, updatedElement: Partial<SlideElement>) => void;
  onElementClick: (elementId: string) => void;
  isEditing: boolean;
  isSelected: boolean;
  onBlur: () => void;
};

const SlideElementComponent: React.FC<SlideElementProps> = ({
  element,
  onUpdateElement,
  onElementClick,
  isEditing,
  isSelected,
  onBlur,
}) => {
  const onUpdateElementCallback = useCallback(
    (newElement: Partial<SlideElement>) => {
      onUpdateElement(element.id, newElement);
    },
    [onUpdateElement, element.id]
  );

  const { position, size, handleMouseDown } = useDragAndResize({
    initialPosition: element.position,
    initialSize: element.size,
    onUpdateElementCallback,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const elementInlineStyles: CSSProperties = {
    top: `${position.y}px`,
    left: `${position.x}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
  };

  const textInlineStyles: CSSProperties = {
    fontFamily: element.type === 'text' ? element.fontFamily : 'Arial',
    fontSize: `${element.type === 'text' ? element.fontSize : 16}px`,
    color: element.type === 'text' ? element.fontColor : '#000000',
  };

  if (isSelected) {
    elementInlineStyles.border = `1px solid #cccccc`;
  }

  return (
    <div
      className={styles.element}
      style={elementInlineStyles}
      onMouseDown={(e) => {
        e.stopPropagation();
        handleMouseDown(e, 'drag');
        onElementClick(element.id);
      }}
    >
      {element.type === 'text' ? (
        isEditing ? (
          <textarea
            style={textInlineStyles}
            className={styles.elementTextEditor}
            value={element.content}
            onChange={(e) => onUpdateElement(element.id, { content: e.target.value })}
            onBlur={onBlur}
            ref={inputRef}
          />
        ) : (
          <p style={textInlineStyles} className={styles.elementText}>
            {element.content}
          </p>
        )
      ) : (
        <img
          src={element.content}
          alt="Element"
          className={styles.elementImage}
        />
      )}

      {isSelected &&
        ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].map(
          (direction) => (
            <div
              key={direction}
              className={`${styles.resizeHandle} ${styles[`resizeHandle-${direction}`]}`}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, 'resize', direction);
              }}
            />
          )
        )}
    </div>
  );
};

export default SlideElementComponent;