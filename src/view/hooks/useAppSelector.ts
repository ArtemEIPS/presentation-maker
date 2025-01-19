import { TypedUseSelectorHook, useSelector } from "react-redux"
import { type RootState } from "../../store/store"


// Используйте во всем приложении вместо `useSelector`
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

const useSlideSelectionSelector = () => useAppSelector(state => state.present.selection?.selectedSlideId)
const useSlidesSelector = () => useAppSelector(state => state.present.presentation.slides)
const useElementSelectionSelector = () => useAppSelector(state => state.present.selection?.selectedElementId)

export {
    useAppSelector,
    useSlideSelectionSelector,
    useSlidesSelector,
    useElementSelectionSelector
}