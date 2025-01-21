import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import styles from './App.module.css';
import TopPanel from './view/TopPanel/TopPanel';
import SlideList from './view/SlideList/SlideList';
import Workspace from './view/Workspace/Workspace';
import Player from './view/Player/Player';
import { Slide, SlideBackground, SlideElement, TextElement, ImageElement } from './store/customtypes';
import { RootState } from './store/store';
import Ajv from 'ajv';
import editorSchema from './store/schema';
import { PDFDocument, rgb } from 'pdf-lib';
import fontKit from '@pdf-lib/fontkit';
import customFont from './fonts/arial-unicode-ms.ttf';
import { EditorType } from './store/EditorType';

const ajv = new Ajv();
const validate = ajv.compile(editorSchema);
const SLIDE_WIDTH = 1000;
const SLIDE_HEIGHT = 600;

const App: React.FC = () => {
  const dispatch = useDispatch();
  const editor = useSelector((state: RootState) => state.present);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleElementClick = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId);
  }, []);

  useEffect(() => {
    const savedEditor = localStorage.getItem('presentationEditor');
    if (savedEditor) {
      try {
        const parsedEditor = JSON.parse(savedEditor) as EditorType;
        if (validate(parsedEditor)) {
          dispatch({ type: 'LOAD_EDITOR', payload: parsedEditor });

          if (parsedEditor.presentation && parsedEditor.presentation.slides.length > 0) {
            const firstSlideId = parsedEditor.presentation.slides[0].id;
            setSelectedSlideId(firstSlideId);
            setCurrentSlideIndex(0);
          }
        } else {
          console.error('Invalid editor data in local storage');
        }
      } catch (error) {
        console.error('Error parsing editor data from local storage', error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (editor.presentation.slides.length > 0 && !selectedSlideId) {
      const firstSlideId = editor.presentation.slides[0].id;
      setSelectedSlideId(firstSlideId);
      setCurrentSlideIndex(0);
    }
  }, [editor.presentation.slides, selectedSlideId]);

  useEffect(() => {
    localStorage.setItem('presentationEditor', JSON.stringify(editor));
  }, [editor]);

  const handleRenamePresentationTitle = useCallback((newTitle: string) => {
    dispatch({ type: 'RENAME_PRESENTATION_TITLE', payload: newTitle });
  }, [dispatch]);

  const handleAddSlide = useCallback(() => {
    const newSlide: Slide = {
      id: uuidv4(),
      elements: [],
      background: { type: 'color', color: '#FFFFFF' },
    };
    dispatch({ type: 'ADD_SLIDE', payload: newSlide });
  }, [dispatch]);

  const handleDeleteSlide = useCallback(() => {
    if (selectedSlideId) {
      dispatch({ type: 'DELETE_SLIDE', payload: selectedSlideId });
      setSelectedSlideId(null);
    }
  }, [dispatch, selectedSlideId]);

  const handleAddElement = useCallback((type: 'text' | 'image', content?: string) => {
    if (!selectedSlideId) return;

    if (type === 'text') {
      const newElement: TextElement = {
        id: uuidv4(),
        type: 'text',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 50 },
        content: 'Введите текст',
        fontFamily: 'Arial',
        fontSize: 16,
        fontColor: '#000000',
      };
      dispatch({ type: 'ADD_ELEMENT', payload: { slideId: selectedSlideId, element: newElement } });
    } else if (type === 'image' && content) {
      const img = new Image();
      img.src = content;
      img.onload = () => {
        const maxWidth = 500;
        const maxHeight = 500;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        const newElement: ImageElement = {
          id: uuidv4(),
          type: 'image',
          position: { x: 50, y: 50 },
          size: { width, height },
          content: content,
        };
        dispatch({ type: 'ADD_ELEMENT', payload: { slideId: selectedSlideId, element: newElement } });
      };
    }
  }, [dispatch, selectedSlideId]);

  const handleRemoveElement = useCallback(() => {
    if (selectedSlideId && selectedElementId) {
      dispatch({ type: 'REMOVE_ELEMENT', payload: { slideId: selectedSlideId, elementId: selectedElementId } });
      setSelectedElementId(null);
    }
  }, [dispatch, selectedSlideId, selectedElementId]);

  const handleChangeBackground = useCallback((newBackground: SlideBackground) => {
    if (selectedSlideId) {
      dispatch({ type: 'CHANGE_BACKGROUND', payload: { slideId: selectedSlideId, background: newBackground } });
    }
  }, [dispatch, selectedSlideId]);

  const handleMoveSlide = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: 'MOVE_SLIDE', payload: { fromIndex, toIndex } });
  }, [dispatch]);

  const handleExport = useCallback(() => {
    const defaultFileName = 'Новая презентация';
    const fileName = window.prompt('Введите имя файла', defaultFileName);

    if (fileName) {
      const dataStr = JSON.stringify(editor);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [editor]);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const importedEditor = JSON.parse(content);
      if (validate(importedEditor)) {
        dispatch({ type: 'LOAD_EDITOR', payload: importedEditor });
      } else {
        console.error('Invalid editor data in imported file');
        alert('Invalid editor data in imported file');
      }
    };
    reader.readAsText(file);
  }, [dispatch]);

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, [dispatch]);

  const handleRedo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, [dispatch]);

  const handleExportToPdf = useCallback(async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontKit);
  
    const fontBytes = await fetch(customFont).then((res) => res.arrayBuffer());
    const customFontEmbedded = await pdfDoc.embedFont(fontBytes);
  
    for (const slide of editor.presentation.slides) {
      const page = pdfDoc.addPage();
      page.setSize(SLIDE_WIDTH, SLIDE_HEIGHT);
  
      const { height } = page.getSize();
  
      if (slide.background.type === 'color') {
        page.drawRectangle({
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          color: rgb(
            parseInt(slide.background.color.slice(1, 3), 16) / 255,
            parseInt(slide.background.color.slice(3, 5), 16) / 255,
            parseInt(slide.background.color.slice(5, 7), 16) / 255
          ),
          opacity: 1,
        });
      } else if (slide.background.type === 'image' && slide.background.imageData) {
        try {
          const base64Data = slide.background.imageData.split(',')[1];
          const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
  
          const mimeType = slide.background.imageData.split(';')[0].split(':')[1];
          let image;
          if (mimeType === 'image/png') {
            image = await pdfDoc.embedPng(imageBytes);
          } else if (mimeType === 'image/jpeg') {
            image = await pdfDoc.embedJpg(imageBytes);
          } else {
            continue;
          }
  
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
          });
        } catch (error) {
          console.error('Ошибка при вставке фонового изображения:', error);
          page.drawRectangle({
            x: 0,
            y: 0,
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            color: rgb(1, 1, 1),
            opacity: 1,
          });
        }
      }
  
      for (const element of slide.elements) {
        if (element.type === 'text') {
          const textElement = element as TextElement;
          page.drawText(textElement.content, {
            x: textElement.position.x,
            y: height - textElement.position.y - textElement.size.height,
            size: textElement.fontSize,
            font: customFontEmbedded,
            color: rgb(
              parseInt(textElement.fontColor.slice(1, 3), 16) / 255,
              parseInt(textElement.fontColor.slice(3, 5), 16) / 255,
              parseInt(textElement.fontColor.slice(5, 7), 16) / 255
            ),
          });
        } else if (element.type === 'image' && element.content) {
          try {
            const base64Data = element.content.split(',')[1];
            const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
  
            const mimeType = element.content.split(';')[0].split(':')[1];
            let image;
            if (mimeType === 'image/png') {
              image = await pdfDoc.embedPng(imageBytes);
            } else if (mimeType === 'image/jpeg') {
              image = await pdfDoc.embedJpg(imageBytes);
            } else {
              console.error('Unsupported image format:', mimeType);
              continue;
            }
  
            page.drawImage(image, {
              x: element.position.x,
              y: height - element.position.y - element.size.height,
              width: element.size.width,
              height: element.size.height,
            });
          } catch (error) {
            console.error('Ошибка при вставке изображения:', error);
          }
        }
      }
    }
  
    const pdfBytes = await pdfDoc.save();

    const presentationTitle = editor.presentation.title || 'presentation';
    const fileName = `${presentationTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`;

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [editor.presentation.slides, editor.presentation.title]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        handleUndo();
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo]);

  return (
    <Router>
      <Routes>
        <Route
          path="/editor"
          element={
            <>
              <TopPanel
                presentationTitle={editor.presentation.title}
                onRenameTitle={handleRenamePresentationTitle}
                onAddSlide={handleAddSlide}
                onDeleteSlide={handleDeleteSlide}
                onAddElement={handleAddElement}
                onRemoveElement={handleRemoveElement}
                onChangeBackground={handleChangeBackground}
                onExport={handleExport}
                onImport={handleImport}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onExportToPdf={handleExportToPdf}
                onChangeFontFamily={(fontFamily) => {
                  if (selectedElementId) {
                    dispatch({ type: 'CHANGE_FONT_FAMILY', payload: { elementId: selectedElementId, fontFamily } });
                  }
                }}
                onChangeFontSize={(fontSize) => {
                  if (selectedElementId) {
                    dispatch({ type: 'CHANGE_FONT_SIZE', payload: { elementId: selectedElementId, fontSize } });
                  }
                }}
                onChangeFontColor={(fontColor) => {
                  if (selectedElementId) {
                    dispatch({ type: 'CHANGE_FONT_COLOR', payload: { elementId: selectedElementId, fontColor } });
                  }
                }}
                selectedElementId={selectedElementId}
              />
              <div className={styles.mainContainer}>
                <SlideList
                  slides={editor.presentation.slides}
                  selectedSlideId={selectedSlideId}
                  onSlideClick={(slideId) => {
                    setSelectedSlideId(slideId);
                    const index = editor.presentation.slides.findIndex((slide) => slide.id === slideId);
                    setCurrentSlideIndex(index);
                  }}
                  onMoveSlide={handleMoveSlide}
                />
                <Workspace
                  slide={
                    editor.presentation.slides.find(
                      (slide: Slide) => slide.id === selectedSlideId
                    ) || null
                  }
                  onUpdateElement={(elementId, updatedElement) => {
                    const updatedSlides = editor.presentation.slides.map((slide: Slide) => {
                      if (slide.id !== selectedSlideId) return slide;
                      return {
                        ...slide,
                        elements: slide.elements.map((element: SlideElement) =>
                          element.id === elementId
                            ? { ...element, ...(updatedElement as TextElement | ImageElement) }
                            : element
                        ),
                      };
                    });
                    dispatch({ type: 'UPDATE_SLIDES', payload: updatedSlides });
                  }}
                  onElementClick={handleElementClick}
                />
              </div>
            </>
          }
        />
        <Route
          path="/player"
          element={
            <Player
              initialSlideIndex={currentSlideIndex}
              onExit={(index) => {
                setCurrentSlideIndex(index);
                const slideId = editor.presentation.slides[index]?.id || null;
                setSelectedSlideId(slideId);
              }}
            />
          }
        />
        <Route path="*" element={<Navigate to="/editor" replace />} />
      </Routes>
    </Router>
  );
};

export default App;