import { Slide, SlideElement, SlideBackground } from "./customtypes";
import { EditorType } from "./EditorType";

export const renamePresentationTitle = (
    editor: EditorType,
    newTitle: string
): EditorType => ({
    ...editor,
    presentation: {
        ...editor.presentation,
        title: newTitle,
    },
});

export const addSlide = (editor: EditorType, newSlide: Slide): EditorType => ({
    ...editor,
    presentation: {
        ...editor.presentation,
        slides: [...editor.presentation.slides, newSlide],
    },
});

export const deleteSlide = (editor: EditorType, slideId: string): EditorType => ({
    ...editor,
    presentation: {
        ...editor.presentation,
        slides: editor.presentation.slides.filter(slide => slide.id !== slideId),
    },
});

export const addElement = (
    editor: EditorType,
    slideId: string,
    newElement: SlideElement
): EditorType => ({
    ...editor,
    presentation: {
        ...editor.presentation,
        slides: editor.presentation.slides.map(slide =>
            slide.id === slideId
                ? { ...slide, elements: [...slide.elements, newElement] }
                : slide
        ),
    },
});

export const removeElement = (
    editor: EditorType,
    slideId: string,
    elementId: string
): EditorType => ({
    ...editor,
    presentation: {
        ...editor.presentation,
        slides: editor.presentation.slides.map(slide =>
            slide.id === slideId
                ? {
                      ...slide,
                      elements: slide.elements.filter(
                          element => element.id !== elementId
                      ),
                  }
                : slide
        ),
    },
});

export const changeSlideBackground = (
    editor: EditorType,
    slideId: string,
    background: SlideBackground
): EditorType => ({
    ...editor,
    presentation: {
        ...editor.presentation,
        slides: editor.presentation.slides.map(slide =>
            slide.id === slideId
                ? { ...slide, background }
                : slide
        ),
    },
});

export const getEditor = (): EditorType => ({
    presentation: {
        title: "Новая презентация",
        slides: [],
    },
    selection: {
        selectedSlideId: null,
        selectedElementId: null,
        selectedElementsIdList: null,
        selectedSlidesIdList: null,
    },
    showModal: {
        showModalWindowAddElement: false,
        showModalWindowSetBackground: false,
    }
});
export const addEditorChangeHandler = (callback: (editor: EditorType) => void) => {};