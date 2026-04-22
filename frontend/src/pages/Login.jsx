import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/userSlice'
import { useDispatch } from "react-redux";

const Login = () => {
   const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch() // we use dispatch to send any data to store  
                                    //useSelector to fetch data from store
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);

        try {
            setLoading(true);

            const res = await axios.post(
                "/api/v1/user/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (res.data.success) {
                localStorage.setItem("accessToken", res.data.accessToken)
                toast.success(res.data.message);
                navigate('/'); // ✅ redirect works now
                dispatch(setUser(res.data.user))
            }

        } catch (error) {
            console.log(error);
            console.log("RESPONSE DATA:", error.response?.data);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

  return (
            <div className='flex justify-center items-center min-h-screen bg-pink-100 p-4'>
            <Card className="w-full max-w-md">

                <CardHeader>
                    <CardTitle className="text-2xl">Create your account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>

                {/* ✅ FORM START */}
                <form onSubmit={submitHandler}>

                    <CardContent>
                        <div className="grid gap-4">

                            {/* First and Last Name */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* <div className='grid gap-2'>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="John"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='grid gap-2'>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div> */}
                            </div>

                            {/* Email */}
                            <div className='grid gap-2'>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>

                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        placeholder="Enter a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type={showPassword ? 'text' : 'password'}
                                        className="pr-10"
                                        required
                                    />

                                    {showPassword ? (
                                        <EyeOff
                                            onClick={() => setShowPassword(false)}
                                            className='w-5 h-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
                                        />
                                    ) : (
                                        <Eye
                                            onClick={() => setShowPassword(true)}
                                            className='w-5 h-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
                                        />
                                    )}
                                </div>
                            </div>

                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">

                        <Button
                            type="submit" // ✅ IMPORTANT
                            disabled={loading}
                            className="w-full bg-black text-white hover:bg-gray-900"
                        >
                            {loading ? "Creating..." : "Login"}
                        </Button>

                        <p className='text-gray-700 text-sm'>
                            Dont have an account?{" "}
                            <Link
                                to="/Signup"
                                className='hover:underline cursor-pointer text-pink-800'
                            >
                                Signup
                            </Link>
                        </p>

                    </CardFooter>

                </form>
                {/* ✅ FORM END */}

            </Card>
        </div>
  )
}

export default Login