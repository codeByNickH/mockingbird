"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CardContent, Card, CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { generateTweet } from '@/backend/generateTweet'
import { fetchRandomUser, fetchUserById } from "@/backend/fetchUser"
import { addTweet } from "@/backend/addTweet"


export function InputTweetComponent() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [response, setResponse] = useState([]);
  
  let chars = 280;

  const HandleImage = async () => {
    
  }

  const HandleTweet = async () => {
    setIsLoading(true);
    
    const user = await fetchRandomUser();
    console.log(user);
    
    const avatar = [user[1].gpt_interest, user[1].gpt_personality];
    const tweet = await generateTweet(" ", avatar);
    await addTweet(user[0], tweet);
    setIsLoading(false);
  }

  if (message?.length > 0) {
    chars -= message.length;
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6">
        <div className="grid w-full max-w-sm gap-2">
          <Textarea className="h-[96px] text-base font-bold"
            placeholder="What's happening?"
            onInput={(e) => setMessage(e.target.value)}
          />
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-bold">{chars}</span>
            <span className="text-gray-500 dark:text-gray-400">Characters remaining</span>
          </div>
        </div>
        <CardFooter className="flex p-4 items-center space-x-52">
          <Button onClick={HandleImage} disabled={isloading} size="sm">
            <ImageIcon className="w-4 h-4 mr-1 -translate-y-0.5" />
            Add image
          </Button>
          <Button onClick={HandleTweet} disabled={isloading} className="ml-auto" size="sm">
            Tweet
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  )
}


function ImageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}