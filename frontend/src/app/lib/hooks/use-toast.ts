// app/hooks/use-toast.ts
import * as React from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastProps = {
    id: string
    title?: string
    description?: string
    variant?: "default" | "destructive" | "success"
}

type State = {
    toasts: ToastProps[]
}

type Action =
    | {
    type: "ADD_TOAST"
    toast: ToastProps
}
    | {
    type: "REMOVE_TOAST"
    toastId: string
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId)
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId,
        })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }

        case "REMOVE_TOAST":
            const { toastId } = action

            if (toastId) {
                const newToasts = state.toasts.filter((toast) => toast.id !== toastId)
                return {
                    ...state,
                    toasts: newToasts,
                }
            }
            return state
    }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

type Toast = Omit<ToastProps, "id">

function toast({ ...props }: Toast) {
    const id = Math.random().toString(36).slice(2, 9)

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
        },
    })

    addToRemoveQueue(id)
}

function useToast() {
    const [state, setState] = React.useState<State>(memoryState)

    React.useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [state])

    return {
        ...state,
        toast,
        dismiss: (toastId: string) => dispatch({ type: "REMOVE_TOAST", toastId }),
    }
}

export { useToast, toast }
