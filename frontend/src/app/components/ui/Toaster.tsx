// app/components/ui/toaster.tsx
"use client"

import { useToast } from "@/lib/hooks/use-toast"
import { Toast, ToastProvider, ToastViewport, ToastClose, ToastTitle, ToastDescription } from "./toast"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, variant, ...props }) {
                return (
                    <Toast key={id} variant={variant} {...props}>
                        <div className="grid gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && <ToastDescription>{description}</ToastDescription>}
                        </div>
                        <ToastClose />
                    </Toast>
                )
            })}
            <ToastViewport />
        </ToastProvider>
    )
}
