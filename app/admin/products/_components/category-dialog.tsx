'use client'

import { useEffect, useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { PlusCircle, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "@/lib/i18n/client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addCategory } from "./actions"

type FormState = {
    message: string,
    errors?: {
        name?: string[],
        description?: string[],
        image?: string[],
    },
    success: boolean,
    data?: {
        [key: string]: any
    }
}

const initialState: FormState = {
    message: "",
    errors: {},
    success: false,
    data: {}
}

function SubmitButton() {
    const { t } = useTranslation()
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? (
                <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t("admin.products.categoryDialog.submitting")}
                </>
            ) : (
                t("admin.products.categoryDialog.submit")
            )}
        </Button>
    )
}

function FormField({
    label,
    error,
    children,
    required = false
}: {
    label: string
    error?: string
    children: React.ReactNode
    required?: boolean
}) {
    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </Label>
            {children}
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}
        </div>
    )
}

export function CategoryDialog() {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const [state, formAction] = useActionState(addCategory, initialState)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        if (state.success) {
            toast.success(t("admin.messages.categoryAdded"))
            setShowSuccess(true)
            setOpen(false)
        } else if (state.message) {
            toast.error(state.message)
        }
    }, [state, t])

    const hasErrors = state.errors && Object.keys(state.errors).length > 0

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start font-normal pl-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("admin.products.categoryDialog.trigger")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>{t("admin.products.categoryDialog.title")}</DialogTitle>
                        <DialogDescription>
                            {t("admin.products.categoryDialog.description")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {showSuccess && (
                            <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    {t("admin.messages.categoryAdded")}
                                </AlertDescription>
                            </Alert>
                        )}

                        {hasErrors && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Please fix the errors below before submitting.
                                </AlertDescription>
                            </Alert>
                        )}

                        <FormField
                            label={t("admin.products.categoryDialog.labels.name")}
                            error={state?.errors?.name?.[0]}
                            required
                        >
                            <Input
                                id="name"
                                name="name"
                                defaultValue={state.data?.name as string | undefined}
                                className={state?.errors?.name ? "border-red-500" : ""}
                            />
                        </FormField>

                        <FormField
                            label={t("admin.products.categoryDialog.labels.description")}
                            error={state?.errors?.description?.[0]}
                        >
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={state.data?.description as string | undefined}
                                className={state?.errors?.description ? "border-red-500" : ""}
                                rows={3}
                            />
                        </FormField>

                        <FormField
                            label={t("admin.products.categoryDialog.labels.imageUrl")}
                            error={state?.errors?.image?.[0]}
                            required
                        >
                            <Input
                                id="image"
                                name="image"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                defaultValue={state.data?.image as string | undefined}
                                className={state?.errors?.image ? "border-red-500" : ""}
                            />
                        </FormField>
                    </div>

                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 