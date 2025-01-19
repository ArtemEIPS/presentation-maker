import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { Slide, SlideElement, SlideBackground } from './customtypes';
import { EditorType } from './EditorType';

type Action =
  | { type: 'RENAME_PRESENTATION_TITLE'; payload: string }
  | { type: 'ADD_SLIDE'; payload: Slide }
  | { type: 'DELETE_SLIDE'; payload: string }
  | { type: 'ADD_ELEMENT'; payload: { slideId: string; element: SlideElement } }
  | { type: 'REMOVE_ELEMENT'; payload: { slideId: string; elementId: string } }
  | { type: 'CHANGE_BACKGROUND'; payload: { slideId: string; background: SlideBackground } }
  | { type: 'MOVE_SLIDE'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'LOAD_EDITOR'; payload: EditorType }
  | { type: 'UPDATE_SLIDES'; payload: Slide[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CHANGE_FONT_FAMILY'; payload: { elementId: string; fontFamily: string } }
  | { type: 'CHANGE_FONT_SIZE'; payload: { elementId: string; fontSize: number } }
  | { type: 'CHANGE_FONT_COLOR'; payload: { elementId: string; fontColor: string } };

interface EditorState {
  past: EditorType[];
  present: EditorType;
  future: EditorType[];
}

const initialState: EditorState = {
  past: [],
  present: {
    presentation: {
      title: 'Новая презентация',
      slides: [],
    },
    selection: {
      selectedSlideId: null,
      selectedElementId: null,
      selectedSlidesIdList: [],
      selectedElementsIdList: [],
    },
    showModal: {
      showModalWindowSetBackground: false,
      showModalWindowAddElement: false,
    },
  },
  future: [],
};

function editorReducer(state = initialState, action: Action): EditorState {
  switch (action.type) {
    case 'RENAME_PRESENTATION_TITLE':
    case 'ADD_SLIDE':
    case 'DELETE_SLIDE':
    case 'ADD_ELEMENT':
    case 'REMOVE_ELEMENT':
    case 'CHANGE_BACKGROUND':
    case 'MOVE_SLIDE':
    case 'UPDATE_SLIDES':
    case 'CHANGE_FONT_FAMILY':
    case 'CHANGE_FONT_SIZE':
    case 'CHANGE_FONT_COLOR':
      return {
        past: [...state.past, state.present],
        present: editorReducerPresent(state.present, action),
        future: [],
      };
    case 'LOAD_EDITOR':
      return {
        past: [],
        present: action.payload,
        future: [],
      };
    case 'UNDO':
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
      };
    case 'REDO':
      if (state.future.length === 0) return state;
      return {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
      };
    default:
      return state;
  }
}

function editorReducerPresent(state: EditorType, action: Action): EditorType {
  switch (action.type) {
    case 'RENAME_PRESENTATION_TITLE':
      return {
        ...state,
        presentation: {
          ...state.presentation,
          title: action.payload,
        },
      };
    case 'ADD_SLIDE':
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: [...state.presentation.slides, action.payload],
        },
      };
    case 'DELETE_SLIDE':
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.filter((slide: Slide) => slide.id !== action.payload),
        },
      };
    case 'ADD_ELEMENT':
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map((slide: Slide) =>
            slide.id === action.payload.slideId
              ? { ...slide, elements: [...slide.elements, action.payload.element] }
              : slide
          ),
        },
      };
    case 'REMOVE_ELEMENT':
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map((slide: Slide) =>
            slide.id === action.payload.slideId
              ? { ...slide, elements: slide.elements.filter((element: SlideElement) => element.id !== action.payload.elementId) }
              : slide
          ),
        },
      };
    case 'CHANGE_BACKGROUND':
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map((slide) =>
            slide.id === action.payload.slideId
              ? { ...slide, background: action.payload.background }
              : slide
          ),
        },
      };
    case 'MOVE_SLIDE':
      const slides = [...state.presentation.slides];
      const [movedSlide] = slides.splice(action.payload.fromIndex, 1);
      slides.splice(action.payload.toIndex, 0, movedSlide);
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides,
        },
      };
    case 'UPDATE_SLIDES':
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: action.payload,
        },
      };
    case 'CHANGE_FONT_FAMILY': {
      const { elementId, fontFamily } = action.payload;
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map((slide) => ({
            ...slide,
            elements: slide.elements.map((element) =>
              element.id === elementId && element.type === 'text'
                ? { ...element, fontFamily }
                : element
            ),
          })),
        },
      };
    }
    case 'CHANGE_FONT_SIZE': {
      const { elementId, fontSize } = action.payload;
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map((slide) => ({
            ...slide,
            elements: slide.elements.map((element) =>
              element.id === elementId && element.type === 'text'
                ? { ...element, fontSize }
                : element
            ),
          })),
        },
      };
    }
    case 'CHANGE_FONT_COLOR': {
      const { elementId, fontColor } = action.payload;
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map((slide) => ({
            ...slide,
            elements: slide.elements.map((element) =>
              element.id === elementId && element.type === 'text'
                ? { ...element, fontColor }
                : element
            ),
          })),
        },
      };
    }
    default:
      return state;
  }
}

const store = createStore(editorReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof editorReducer>;

export default store;