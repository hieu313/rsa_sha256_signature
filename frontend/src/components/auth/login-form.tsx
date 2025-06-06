import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ROUTES } from "@/constants/routes"
import Link from "next/link"

export default function LoginForm() {
  return (
    <Card className="min-w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="space-y-2 flex flex-col items-center">
          <p>Please enter your details to login.</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Your email" required name="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required name="password" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full hover:bg-blue-500 transition-colors">Login</Button>
        <Separator />
        <p className="text-center">Don&apos;t have an account? <Link href={ROUTES.REGISTER} className="text-blue-500">Register</Link> here.</p>
      </CardFooter>
    </Card>
  )
}