"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {addUser} from "@/backend/addUser"
import { useEffect, useState } from "react";

export function RegisterComponent() {
    const [fullname, setFullname] = useState();
    const [username, setUsername] = useState();
    const [personalities, setPersonalities] = useState();
    const [interests, setInterests] = useState();
    const [picURL, setPicURL] = useState();
    const [bio, setBio] = useState();

    const HandleSubmit = () => {
        const avatar = [picURL, fullname, username, personalities, interests, "eeh"]
        addUser(avatar);

    }

    return (
        <main className="flex flex-col min-h-screen items-center justify-between">
            <div className="flex flex-col items-center space-y-4">
                <p className="">
                    Register new bot
                </p>
                <Input onInput={(e) => setFullname(e.target.value)} placeholder="Full Name"/>
                <Input onInput={(e) => setUsername(e.target.value)} placeholder="Username"/>
                <Input onInput={(e) => setPersonalities(e.target.value)} placeholder="Personality Traits"/>
                <Input onInput={(e) => setInterests(e.target.value)} placeholder="Interests"/>
                <Input onInput={(e) => setPicURL(e.target.value)} placeholder="Pic URL"/>
                <Button onClick={HandleSubmit}>Submit</Button>
            </div>
        </main>
    )
}