import { useState, useCallback } from 'react';

export const useHistory = <T>(initialState: T) => {
    const [history, setHistory] = useState<T[]>([initialState]);
    const [index, setIndex] = useState(0);

    const setState = useCallback((value: T | ((prevState: T) => T), overwrite = false) => {
        const newState = typeof value === 'function' ? (value as (prevState: T) => T)(history[index]) : value;
        
        if (overwrite) {
            const newHistory = [...history];
            newHistory[index] = newState;
            setHistory(newHistory);
        } else {
            const newHistory = history.slice(0, index + 1);
            setHistory([...newHistory, newState]);
            setIndex(newHistory.length);
        }
    }, [history, index]);

    const undo = useCallback(() => {
        if (index > 0) {
            setIndex(prevIndex => prevIndex - 1);
        }
    }, [index]);

    const redo = useCallback(() => {
        if (index < history.length - 1) {
            setIndex(prevIndex => prevIndex + 1);
        }
    }, [index, history.length]);

    return {
        state: history[index],
        setState,
        undo,
        redo,
        canUndo: index > 0,
        canRedo: index < history.length - 1,
    };
};