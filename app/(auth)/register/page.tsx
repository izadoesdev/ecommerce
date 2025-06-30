'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Lock, User, Chrome } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        await authClient.signUp.email({
            name,
            email,
            password,
        }, {
            onSuccess: () => {
                toast.success("Registration Successful")
                router.push("/login")
            },
            onError: (ctx) => {
                toast.error(ctx.error.message)
            }
        });
    }

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <form onSubmit={handleRegister} className="mx-auto grid w-[400px] gap-6 p-6 rounded-lg border bg-background shadow-md">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Sign Up</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your information to create an account
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="full-name"
                                placeholder="Full Name"
                                required
                                className="pl-10"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                className="pl-10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                required
                                className="pl-10"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Create an account
                        </Button>
                        <div className="relative my-4">
                            <Separator />
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs uppercase text-muted-foreground">Or continue with</span>
                        </div>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                            <Chrome className="h-5 w-5" /> Sign up with Google
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="https://images.unsplash.com/photo-1556911220-bda9f7f7597e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
} 