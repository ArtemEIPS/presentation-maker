import React from 'react';
import { EditorType } from './EditorType'; 

interface EditorContextProps {
    editor: EditorType;
    dispatch: (modifyFn: (editor: EditorType, payload?: any) => EditorType, payload?: any) => void;
}

const EditorContext = React.createContext<EditorContextProps>({
    editor: {} as EditorType, 
    dispatch: () => {}, 
});

export const EditorProvider = EditorContext.Provider;
export const EditorConsumer = EditorContext.Consumer;
export default EditorContext;