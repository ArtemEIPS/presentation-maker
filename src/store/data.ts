import {Presentation } from "./customtypes"
import { EditorType } from "./EditorType";

export const minState: Presentation = {
    title: 'Название презентации',
    slides: [
        { 
            id: 'slide-1', 
            background: { type: 'color', color: '#fff' }, 
            elements: [] 
        }
    ]
};

const presentation: Presentation = minState;

const editor: EditorType = {
    presentation,
    selection: {
        selectedSlideId: presentation.slides[0].id, 
        selectedElementId: null,
        selectedSlidesIdList: [],
        selectedElementsIdList: [],
    },
    showModal: {
        showModalWindowSetBackground: false,
        showModalWindowAddElement: false,
    },
};

export { editor };