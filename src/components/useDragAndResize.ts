import { useState, useCallback, useEffect } from "react";
import { SlideElement } from "../store/customtypes";

type Position = { x: number; y: number };
type Size = { width: number; height: number };

type UseDragAndResizeProps = {
  initialPosition: Position;
  initialSize: Size;
  onUpdateElementCallback: (updatedElement: Partial<SlideElement>) => void;
};

const useDragAndResize = ({
  initialPosition,
  initialSize,
  onUpdateElementCallback,
}: UseDragAndResizeProps) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [size, setSize] = useState<Size>(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  console.log('position', position)
  console.log('initialPosition', position)

  useEffect(() => {
    setPosition(initialPosition)
    setSize(initialSize) 
  }, [initialPosition, initialSize])

  const handleMouseDown = useCallback((e: React.MouseEvent, type: "drag" | "resize", direction?: string) => {
    e.preventDefault();
    if (type === "drag") {
      setIsDragging(true);
    } else if (type === "resize" && direction) {
      setIsResizing(true);
      setResizeDirection(direction);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: position.x + e.movementX,
          y: position.y + e.movementY,
        };
        setPosition(newPosition);
      } else if (isResizing && resizeDirection) {
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        switch (resizeDirection) {
          case "top":
            newHeight -= e.movementY;
            newY += e.movementY;
            break;
          case "bottom":
            newHeight += e.movementY;
            break;
          case "left":
            newWidth -= e.movementX;
            newX += e.movementX;
            break;
          case "right":
            newWidth += e.movementX;
            break;
          case "top-left":
            newWidth -= e.movementX;
            newHeight -= e.movementY;
            newX += e.movementX;
            newY += e.movementY;
            break;
          case "top-right":
            newWidth += e.movementX;
            newHeight -= e.movementY;
            newY += e.movementY;
            break;
          case "bottom-left":
            newWidth -= e.movementX;
            newHeight += e.movementY;
            newX += e.movementX;
            break;
          case "bottom-right":
            newWidth += e.movementX;
            newHeight += e.movementY;
            break;
          default:
            break;
        }

        const newSize = {
          width: Math.max(newWidth, 10),
          height: Math.max(newHeight, 10), 
        };

        const newPosition = {
          x: newX,
          y: newY,
        };

        setSize(newSize);
        setPosition(newPosition);
      }
    },
    [isDragging, isResizing, resizeDirection, position, size]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
    
    onUpdateElementCallback?.({size, position});
    console.log(size , position)  
    console.log('onPositionChange', onUpdateElementCallback)
    
  }, [onUpdateElementCallback, position, size]);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return {
    position,
    size,
    handleMouseDown,
  };
};

export default useDragAndResize;