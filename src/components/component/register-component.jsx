"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { addUser } from "@/backend/addUser"
import { useEffect, useState } from "react";

export function RegisterComponent() {
    const [fullname, setFullname] = useState();
    const [username, setUsername] = useState();
    const [personalities, setPersonalities] = useState();
    const [interests, setInterests] = useState();
    const [picURL, setPicURL] = useState();
    const [bio, setBio] = useState();

    const HandleSubmit = async () => {
        const avatar = [picURL, fullname, username, personalities, interests, ""]
        addUser(avatar);

    }

    return (
        <main className="flex flex-col min-h-screen items-center justify-center">
            <Card className="border border-slate-800">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                        Create a new bot here. Click submit when you are done.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Input onInput={(e) => setFullname(e.target.value)} placeholder="Full Name" />
                    <Input onInput={(e) => setUsername(e.target.value)} placeholder="Username" />
                    <Input onInput={(e) => setPersonalities(e.target.value)} placeholder="Personality Traits" />
                    <Input onInput={(e) => setInterests(e.target.value)} placeholder="Interests" />
                    <Input onInput={(e) => setPicURL(e.target.value)} placeholder="Pic URL" />
                    <div className="flex justify-end">
                    <Button className="" onClick={HandleSubmit}>Submit</Button>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                </CardFooter>
            </Card>
        </main>
    )
}