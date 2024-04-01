"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CardContent, Card } from "@/components/ui/card"
import { useState } from "react"
import { GenerateTweet } from '@/backend/generateTweet'
import { fetchRandomUser, fetchUserById } from "@/backend/fetchUser"


export function InputTweetComponent() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [response, setResponse] = useState([]);
  
  const audience = "the world";
  const tone = "angry";
  
  let chars = 280;

  const HandleImage = async () => {
    setIsLoading(true);
    
    const user = await fetchRandomUser();
    console.log(user);

    const avatar = [user[1].gpt_interest, audience, tone, user[1].gpt_personality];
    await GenerateTweet(`Anwser this tweet and tag the user who wrote it: Just finished reading "Automate This" and it genuinely felt like I was sipping a cup of coffee with artificial intelligence - bristle and bracing. Who knew AI could be so chatty? So, if you're tired of humans, grab a copy! Only a "Ctrl+C and Ctrl+V" away from great conversations. Tweeted by @deerenolds`, avatar, user[0]);
    
    
    setIsLoading(false);
  }

  const HandleTweet = async () => {
    setIsLoading(true);
    
    const user = await fetchRandomUser();
    console.log(user);
    
    const avatar = [user[1].gpt_interest, audience, tone, user[1].gpt_personality];
    await GenerateTweet(" ", avatar, user[0]);
    
    setIsLoading(false);
  }

  if (message?.length > 0) {
    chars -= message.length
  }

  // if (isloading) {
  //   return <p>loading..</p>
  // }

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
        <div className="flex p-4 items-center space-x-52">
          <Button onClick={HandleImage} disabled={isloading} size="sm">
            <ImageIcon className="w-4 h-4 mr-1 -translate-y-0.5" />
            Add image
          </Button>
          {/* <Button size="sm">
            <GiftIcon className="w-4 h-4 mr-1 -translate-y-0.5" />
            Add GIF
          </Button> 
          <Button size="sm">
            <VoteIcon className="w-4 h-4 mr-1 -translate-y-0.5" />
            Create poll
          </Button>
        */}
          <Button onClick={HandleTweet} disabled={isloading} className="ml-auto" size="sm">
            Tweet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


function ChevronUpIcon(props) {
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
      <path d="m18 15-6-6-6 6" />
    </svg>
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


function GiftIcon(props) {
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
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect width="20" height="5" x="2" y="7" />
      <line x1="12" x2="12" y1="22" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  )
}


function VoteIcon(props) {
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
      <path d="m9 12 2 2 4-4" />
      <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
      <path d="M22 19H2" />
    </svg>
  )
}
