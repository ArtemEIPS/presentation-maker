import { SlideBackground, SlideElement } from './customtypes';

export const renamePresentationTitle = (newTitle: string) => ({
  type: 'RENAME_PRESENTATION_TITLE',
  payload: newTitle,
});

export const addSlide = () => ({
  type: 'ADD_SLIDE',
});

export const deleteSlide = (slideId: string) => ({
  type: 'DELETE_SLIDE',
  payload: slideId,
});

export const addElement = (type: 'text' | 'image', content?: string) => ({
  type: 'ADD_ELEMENT',
  payload: { type, content },
});

export const removeElement = (elementId: string) => ({
  type: 'REMOVE_ELEMENT',
  payload: elementId,
});

export const changeBackground = (newBackground: SlideBackground) => ({
  type: 'CHANGE_BACKGROUND',
  payload: newBackground,
});

export const moveSlide = (fromIndex: number, toIndex: number) => ({
  type: 'MOVE_SLIDE',
  payload: { fromIndex, toIndex },
});

export const updateElement = (elementId: string, updatedElement: Partial<SlideElement>) => ({
  type: 'UPDATE_ELEMENT',
  payload: { elementId, updatedElement },
});

export const selectSlide = (slideId: string) => ({
  type: 'SELECT_SLIDE',
  payload: slideId,
});

export const selectElement = (elementId: string) => ({
  type: 'SELECT_ELEMENT',
  payload: elementId,
});

export const changeFontFamily = (elementId: string, fontFamily: string) => ({
  type: 'CHANGE_FONT_FAMILY',
  payload: { elementId, fontFamily },
});

export const changeFontSize = (elementId: string, fontSize: number) => ({
  type: 'CHANGE_FONT_SIZE',
  payload: { elementId, fontSize },
});

export const changeFontColor = (elementId: string, fontColor: string) => ({
  type: 'CHANGE_FONT_COLOR',
  payload: { elementId, fontColor },
});

export const exportPresentation = () => ({
  type: 'EXPORT_PRESENTATION',
});

export const importPresentation = (file: File) => ({
  type: 'IMPORT_PRESENTATION',
  payload: file,
});

export const undo = () => ({
  type: 'UNDO',
});

export const redo = () => ({
  type: 'REDO',
});

export const exportToPdf = () => ({
  type: 'EXPORT_TO_PDF',
});