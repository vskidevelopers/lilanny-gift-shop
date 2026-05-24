"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"


const schema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
})
type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const togglePasswordVisibility = () => {
        console.log("Toggling password visibility from >>>", showPassword, "to", !showPassword)
        setShowPassword(prev => !prev)
    }

    const onSubmit = async (data: FormData) => {
        const { error } = await supabase.auth.signInWithPassword(data)
        if (error) {
            toast.error("Invalid credentials. Please try again.")
        } else {
            toast.success("Welcome back to Li & Lanny Trends")
            router.push("/admin")
            router.refresh() // Forces SSR to revalidate session
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Li & Lanny Trends</CardTitle>
                <CardDescription>Admin Portal Sign In</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="admin@lilanny.com" {...register("email")} />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input id="password" type={showPassword ? 'text' : "password"} placeholder="••••••••" {...register("password")} />
                            <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>
                </CardContent>
                <br />
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}