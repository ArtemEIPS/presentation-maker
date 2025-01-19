import { Presentation } from "./customtypes";

type SelectionType = {
    selectedSlideId: string | null,
    selectedElementId?: string | null | undefined,
    selectedSlidesIdList: string[] | null,
    selectedElementsIdList: string[] | null,
}

type ShowModalType = {
    showModalWindowSetBackground: boolean,
    showModalWindowAddElement: boolean,
}

type EditorType = {
    presentation: Presentation,
    selection: SelectionType | null,
    showModal: ShowModalType,
}

export type {
    EditorType,
    SelectionType,
    ShowModalType
}