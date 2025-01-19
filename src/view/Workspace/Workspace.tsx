import React, { useState, useRef } from 'react';
import styles from './Workspace.module.css';
import { Slide, SlideElement } from '../../store/customtypes';
import SlideElementComponent from '../../components/SlideElement';

type WorkspaceProps = {
  slide: Slide | null;
  onUpdateElement: (elementId: string, updatedElement: Partial<SlideElement>) => void;
  onElementClick: (elementId: string) => void;
};

const Workspace: React.FC<WorkspaceProps> = ({ slide, onUpdateElement, onElementClick }) => {
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const handleElementClick = (elementId: string) => {
    setSelectedElementId(elementId);
    setEditingElementId(elementId);
    onElementClick(elementId);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setEditingElementId(null);
    }, 100);
  };

  const handleWorkspaceClick = (e: React.MouseEvent) => {
    if (workspaceRef.current && e.target === workspaceRef.current) {
      setSelectedElementId(null);
    }
  };

  if (!slide) return <div className={styles.workspace}>Выберите слайд или создайте новый</div>;

  return (
    <div
      className={styles.workspace}
      ref={workspaceRef}
      onClick={handleWorkspaceClick}
    >
      <div className={styles.slideContainer}
        style={{
          background: slide.background.type === 'color'
            ? slide.background.color
            : `url(${slide.background.imageUrl}) no-repeat center/cover`,
        }}
      >
        {slide.elements.map((element) => (
          <SlideElementComponent
            key={element.id}
            element={element}
            onUpdateElement={onUpdateElement}
            onElementClick={handleElementClick}
            isEditing={editingElementId === element.id}
            isSelected={selectedElementId === element.id}
            onBlur={handleBlur}
          />
        ))}
      </div>
    </div>
  );
};

export default Workspace;