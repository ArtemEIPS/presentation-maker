import { EditorType, SelectionType } from "./EditorType";

type Presentation = {
    title: string;
    slides: SlideCollection;
}

type Slide = {
    id: string;
    background: SlideBackground;
    elements: SlideElement[];
}

type SlideCollection = Slide[];

type SlideSelection = {
    slideId: string;
}



// BaseElementData
type BaseElementData = {
    id: string;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
} 

type TextElement = {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  id: string;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
}

type ImageElement =  {
  type: 'image';
  content: string;
  id: string;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
}

type SlideElement = TextElement | ImageElement;

type SlideBackground = 
    | {type: 'color', color: string}
    | {type: 'image', imageUrl: string}


function renamePresentationTitle_(editor: EditorType, newTitle: string): EditorType {
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            title: newTitle,
        },
    };
}

function addSlide_(editor: EditorType, newSlide: Slide): EditorType {
    const updatedSlides = [...editor.presentation.slides, newSlide];

    const updatedPresentation = {
        ...editor.presentation,
        slides: updatedSlides,
    };

    const updatedSelection: SelectionType = {
        ...editor.selection,
        selectedSlideId: newSlide.id,
        selectedElementId: null,
        selectedSlidesIdList: null,
        selectedElementsIdList: null,
    };

    return {
        ...editor,
        presentation: updatedPresentation,
        selection: updatedSelection, 
    };
}

function selectSlide_(editor: EditorType, slideId: string | null): EditorType {
    const updatedSelection: SelectionType = {
        ...editor.selection,
        selectedSlideId: slideId, 
        selectedElementId: null,
        selectedSlidesIdList: [], 
        selectedElementsIdList: [],
    };

    return {
        ...editor,
        presentation: {
            ...editor.presentation
        },
        selection: updatedSelection,
        showModal: editor.showModal
    };
}

export const updatePresentationTitle_ = {
    type: "updatePresentationTitle",
    reducer: (state: EditorType, newTitle: string) => {
        state.presentation.title = newTitle;
    },
};


function deleteSlide_(editor: EditorType): EditorType {
    const slideToDelete = editor.presentation.slides.find(slide => slide.id === editor.selection?.selectedSlideId);
    if (slideToDelete) {
        const updatedSlides = editor.presentation.slides.filter(slide => slide.id !== slideToDelete.id);
        
        const updatedSelection: SelectionType = {
            ...editor.selection,
            selectedSlideId: updatedSlides.length > 0 ? updatedSlides[0].id : null,
            selectedElementId: null, 
            selectedSlidesIdList: null,
            selectedElementsIdList: null,
        };

        const updatedPresentation = {
            ...editor.presentation,
            slides: updatedSlides,
        };

        return {
            ...editor,
            presentation: updatedPresentation,
            selection: updatedSelection,
        };
    }
    return editor; 
}


function moveSlide_(editor: EditorType, fromIndex: number, toIndex: number): EditorType {
    const updatedPresentation = moveSlide(editor.presentation, fromIndex, toIndex);

    return {
        ...editor,
        presentation: updatedPresentation,
    };
}

function moveSlide(presentation: Presentation, fromIndex: number, toIndex: number): Presentation {
    const newSlides = [...presentation.slides];
    const [movedSlide] = newSlides.splice(fromIndex, 1);

    newSlides.splice(toIndex, 0, movedSlide);

    return {
         ...presentation, 
         slides: newSlides, 
    };
}

function addElement_(editor: EditorType, slideId: string, element: SlideElement): EditorType {
    const updatedPresentation = addElement(editor.presentation, slideId, element);

    return {
        ...editor,
        presentation: updatedPresentation,
    };
}

function addElement(presentation: Presentation, slideId: string, element: SlideElement): Presentation {
    const slide = presentation.slides.find(el => el.id === slideId)

    if (!slide) {
        return presentation;
    }

    return {
        ...presentation,
        slides: presentation.slides.map(slide => {
            if(slide.id !== slideId) {
                return slide;

            }
            return _addElement(slide, element);
        })
    }
}

function _addElement(slide: Slide, element: SlideElement): Slide {
    return { 
        ...slide, 
        elements: [
            ...slide.elements,
            element,
        ], 
    };
}  

function removeElement_(editor: EditorType, slideId: string, element: SlideElement): EditorType {
    const updatedPresentation = removeElement(editor.presentation, slideId, element);

    return {
        ...editor,
        presentation: updatedPresentation,
    };
}

function removeElement(presentation: Presentation, slideId: string, element: SlideElement): Presentation {
    const slide = presentation.slides.find(el => el.id === slideId)
    
    if (!slide) {
        return presentation;
    }

    return {
        ...presentation,
        slides: presentation.slides.map(slide => {
            if(slide.id !== slideId) {
                return slide;

            }
            return _removeElement(slide, element);
        })
    }
}

function _removeElement(slide: Slide, element: SlideElement): Slide {
    return { 
        ...slide, 
        elements: slide.elements.filter(el => el.id !== element.id), 
    };
}


function moveElement_(
    editor: EditorType,
    slideId: string,
    element: SlideElement,
    newPosition: { x: number; y: number }
): EditorType {
    const updatedPresentation = moveElement(editor.presentation, slideId, element, newPosition);

    return {
        ...editor,
        presentation: updatedPresentation,
    };
}

function moveElement(presentation: Presentation, slideId: string, element: SlideElement, newPosition: { x: number, y: number }): Presentation {
    const slide = presentation.slides.find(el => el.id === slideId)
    
    if (!slide) {
        return presentation;
    }

    return {
        ...presentation,
        slides: presentation.slides.map(slide => {
            if(slide.id !== slideId) {
                return slide;

            }
            return _moveElement(slide, element, newPosition);
        })
    }
}

function _moveElement(slide: Slide, element: SlideElement, newPosition: { x: number, y: number }): Slide {
    return {
        ...slide,
        elements: slide.elements.map(el => el.id === element.id ? { ...el, position: newPosition } : el,
      )
    };
}

function resizeElement_(
    editor: EditorType,
    slideId: string,
    element: SlideElement,
    newSize: { width: number; height: number }
): EditorType {
    const updatedPresentation = resizeElement(editor.presentation, slideId, element, newSize);

    return {
        ...editor,
        presentation: updatedPresentation,
    };
}

function resizeElement(presentation: Presentation, slideId: string, element: SlideElement, newSize: { width: number, height: number }): Presentation {
    const slide = presentation.slides.find(el => el.id === slideId)
    
    if (!slide) {
        return presentation;
    }

    return {
        ...presentation,
        slides: presentation.slides.map(slide => {
            if(slide.id !== slideId) {
                return slide;

            }
            return _resizeElement(slide, element, newSize);
        })
    }
}

function _resizeElement(slide: Slide, element: SlideElement, newSize: { width: number, height: number }): Slide {
    return {
        ...slide,
        elements: slide.elements.map(el => el.id === element.id ? { ...el, size: newSize } : el,
      )
    };
}

function editText_(
    editor: EditorType,
    slideId: string,
    elementId: string,
    newText: string
): EditorType {
    const updatedPresentation = editText(editor.presentation, slideId, elementId, newText);

    return {
        ...editor,
        presentation: updatedPresentation,
    };
}

function editText(presentation: Presentation, slideId: string, elementId: string, newText: string): Presentation {
    const slide = presentation.slides.find(el => el.id === slideId);

    if (!slide) {
        return presentation;
    }

    return {
        ...presentation,
        slides: presentation.slides.map(slide => {
            if (slide.id !== slideId) {
                return slide;
            }

            return _editText(slide, elementId, newText);
        })
    };
}

function _editText(slide: Slide, elementId: string, newText: string): Slide {
    return {
        ...slide,
        elements: slide.elements.map(el => el.id === elementId && el.type === 'text' ? { ...el, content: newText } : el,
      )
    };
}
 
function changeFontFamily_(
    editor: EditorType,
    slideId: string,
    elementId: string,
    newFontFamily: string
): EditorType {
    const updatedPresentation = changeFontFamily(editor.presentation, slideId, elementId, newFontFamily);

    return {
        ...editor,
        presentation: updatedPresentation,
    };
}

function changeFontFamily(presentation: Presentation, slideId: string, elementId: string, newFontFamily: string): Presentation {
    const slide = presentation.slides.find(el => el.id === slideId);

    if (!slide) {
        return presentation;
    }

    return {
        ...presentation,
        slides: presentation.slides.map(slide => {
            if (slide.id !== slideId) {
                return slide;
            }

            return _changeFontFamily(slide, elementId, newFontFamily);
        })
    };
}

function _changeFontFamily(slide: Slide, elementId: string, newFontFamily: string): Slide {
    return {
        ...slide,
        elements: slide.elements.map(el => el.id === elementId && el.type === 'text' ? { ...el, fontFamily: newFontFamily } : el)
    };
}

function changeSlideBackground_(
    editor: EditorType,
    slideId: string,
    newBackground: SlideBackground
): EditorType {
    const updatedPresentation = changeSlideBackground(editor.presentation, slideId, newBackground);

    return {
        ...editor,
        presentation: updatedPresentation,
    };
}

function changeSlideBackground(presentation: Presentation, slideId: string, newBackground: SlideBackground): Presentation {
    const slide = presentation.slides.find(el => el.id === slideId);

    if (!slide) {
        return presentation;
    }

    return {
        ...presentation,
        slides: presentation.slides.map(slide => {
            if (slide.id !== slideId) {
                return slide;
            }

            return _changeSlideBackground(slide, newBackground);
        })
    };
}

function _changeSlideBackground(slide: Slide, newBackground: SlideBackground): Slide {
    return {
        ...slide,
        background: newBackground
    };
}  

export type {
    Presentation,
    Slide,
    SlideCollection,
    SlideSelection,
    SlideElement,
    TextElement,
    ImageElement,
    SlideBackground,
    BaseElementData,
}

export {
    renamePresentationTitle_,
    addSlide_,
    selectSlide_,
    deleteSlide_,
    moveSlide_,
    addElement_,
    removeElement_,
    moveElement_,
    resizeElement_,
    editText_,
    changeFontFamily_,
    changeSlideBackground_,
};