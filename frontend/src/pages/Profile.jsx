import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import userLogo from "../assets/userLogo.png"
import { toast } from 'sonner'
import axios from 'axios'

// ⚠️ IMPORTANT: import your redux action
import { setUser } from "@/redux/userSlice"

const Profile = () => {

    const { user } = useSelector(store => store.user)
    const { userId } = useParams()
    const dispatch = useDispatch()

    const [updateUser, setUpdateUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        address: "",
        city: "",
        zipCode: "",
        profilePic: "",
        role: ""
    })

    const [file, setFile] = useState(null)

    // 🔥 Sync Redux user → local state
    useEffect(() => {
        if (user) {
            setUpdateUser(user)
        }
    }, [user])

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)

        setUpdateUser({
            ...updateUser,
            profilePic: URL.createObjectURL(selectedFile) // preview only
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const accessToken = localStorage.getItem("accessToken")

        try {
            const formData = new FormData()

            formData.append("firstName", updateUser.firstName)
            formData.append("lastName", updateUser.lastName)
            formData.append("email", updateUser.email)
            formData.append("phoneNo", updateUser.phoneNo)
            formData.append("address", updateUser.address)
            formData.append("city", updateUser.city)
            formData.append("zipCode", updateUser.zipCode)
            formData.append("role", updateUser.role)

            if (file) {
                formData.append("file", file)
            }

            const res = await axios.put(
                `/api/v1/user/update/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )

            if (res.data.success) {
                toast.success(res.data.message)

                // 🔥 UPDATE REDUX (THIS FIXES YOUR ISSUE)
                dispatch(setUser(res.data.user))
            }

        } catch (error) {
            console.log("FULL ERROR:", error); // optional
            console.log("BACKEND ERROR:", error.response?.data); // ✅ IMPORTANT

            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    }

    return (
        <div className='pt-20 min-h-screen bg-gray-100'>
            <Tabs defaultValue="Profile" className="max-w-7xl mx-auto items-center">

                <TabsList>
                    <TabsTrigger value="Profile">Profile</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* PROFILE TAB */}
                <TabsContent value="Profile">
                    <div className='flex flex-col justify-center items-center bg-gray-100'>

                        <h1 className='font-bold mb-7 text-2xl text-gray-800'>
                            Update Profile
                        </h1>

                        <div className='w-full flex gap-10 justify-between items-start px-7 max-w-2xl'>

                            {/* IMAGE */}
                            <div className="flex flex-col items-center">
                                <img
                                    src={updateUser.profilePic || userLogo}
                                    alt="profile"
                                    className="w-32 h-32 rounded-full object-cover"
                                />

                                <label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg">
                                    Upload Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>

                            {/* FORM */}
                            <form
                                onSubmit={handleSubmit}
                                className='space-y-4 shadow-lg p-5 rounded-lg bg-white'
                            >

                                <div className='grid grid-cols-2 gap-4'>

                                    <div>
                                        <Label>First Name</Label>
                                        <Input
                                            name="firstName"
                                            value={updateUser.firstName || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <Label>Last Name</Label>
                                        <Input
                                            name="lastName"
                                            value={updateUser.lastName || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>

                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        value={updateUser.email || ""}
                                        disabled
                                    />
                                </div>

                                <div>
                                    <Label>Phone</Label>
                                    <Input
                                        name="phoneNo"
                                        value={updateUser.phoneNo || ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label>Address</Label>
                                    <Input
                                        name="address"
                                        value={updateUser.address || ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label>City</Label>
                                    <Input
                                        name="city"
                                        value={updateUser.city || ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label>Zip Code</Label>
                                    <Input
                                        name="zipCode"
                                        value={updateUser.zipCode || ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button className="bg-black text-white px-4 py-2 rounded">
                                    Save
                                </button>

                            </form>

                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="analytics">Analytics</TabsContent>
                <TabsContent value="reports">Reports</TabsContent>
                <TabsContent value="settings">Settings</TabsContent>

            </Tabs>
        </div>
    )
}

export default Profile