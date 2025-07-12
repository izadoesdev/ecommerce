'use client'

import { useEffect, useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { PlusCircle } from "lucide-react"
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
            {pending ? t("admin.products.categoryDialog.submitting") : t("admin.products.categoryDialog.submit")}
        </Button>
    )
}

export function CategoryDialog() {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const [state, formAction] = useActionState(addCategory, initialState)

    useEffect(() => {
        if (state.success) {
            toast.success(t("admin.messages.categoryAdded"))
            setOpen(false)
        } else if (state.message) {
            toast.error(state.message)
        }
    }, [state, t])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start font-normal pl-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("admin.products.categoryDialog.trigger")}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>{t("admin.products.categoryDialog.title")}</DialogTitle>
                        <DialogDescription>
                            {t("admin.products.categoryDialog.description")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="name">
                                {t("admin.products.categoryDialog.labels.name")}
                            </Label>
                            <Input id="name" name="name" defaultValue={state.data?.name as string | undefined} />
                            {state?.errors?.name && (
                                <p className="text-sm text-red-500">{state.errors.name[0]}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="description">
                                {t("admin.products.categoryDialog.labels.description")}
                            </Label>
                            <Textarea id="description" name="description" defaultValue={state.data?.description as string | undefined} />
                            {state?.errors?.description && (
                                <p className="text-sm text-red-500">{state.errors.description[0]}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="image">
                                {t("admin.products.categoryDialog.labels.imageUrl")}
                            </Label>
                            <Input id="image" name="image" type="url" defaultValue={state.data?.image as string | undefined} />
                            {state?.errors?.image && (
                                <p className="text-sm text-red-500">{state.errors.image[0]}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 