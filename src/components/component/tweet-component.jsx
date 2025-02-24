"use client"

import { fetchTweetAndAnswerById, fetchTweetById } from "@/backend/fetchTweets"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchRandomUser, fetchUserById } from "@/backend/fetchUser"
import { generateTweet } from "@/backend/generateTweet"
import { addLike, addRetweet, addTweetAnswer } from "@/backend/addTweet"
import Image from "next/image"

export function TweetComponent({ params }) {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLiking, setIsLiking] = useState(false);
    const [isRetweeting, setIsRetweeting] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);

    useEffect(() => {
        const fetchTweetAnswers = async () => {
            const tweet = await fetchTweetAndAnswerById(params.tweetId)
            setData(tweet)
            setIsLoading(false)
        }
        fetchTweetAnswers()
    }, [params.tweetId, isLiking, isRetweeting, isCommenting])

    const HandleComment = async (id) => {
        setIsCommenting(true)
        let user = await fetchRandomUser();
        let ogTweet = await fetchTweetById(id);

        if (ogTweet[1].userId === user[0]) {
            user = await fetchRandomUser();
        }
        const avatar = [user[1].gpt_interest, user[1].gpt_personality];

        const ogTweetUser = await fetchUserById(ogTweet[1].userId);
        const tweetAnswer = await generateTweet(`From input message: ${ogTweet[1].content} by user: ${ogTweetUser.username} In less than 280 characters, write a Twitter a short response to ${ogTweetUser.username}.`, avatar);
        await addTweetAnswer(ogTweet, tweetAnswer, user[0]);
        setIsCommenting(false)
    }

    const HandleRetweet = async (id) => {
        setIsRetweeting(true)
        let user = await fetchRandomUser();
        let tweet = await fetchTweetById(id);

        if (tweet[1].userId === user[0]) {
            user = await fetchRandomUser();
        }
        const avatar = [user[1].gpt_interest, user[1].gpt_personality];

        const ogTweetUser = await fetchUserById(tweet[1].userId);
        const retweetContent = await generateTweet(`From input message: ${tweet[1].content} by user: ${ogTweetUser.username} In less than 280 characters, write a Twitter response as if you are retweeting this from ${ogTweetUser.username}. If you mention the user, use this format: @${ogTweetUser.username}. Don't mention retweet, retweeting or anything like that.`, avatar);
        await addRetweet(tweet, retweetContent, user[0]);
        setIsRetweeting(false)
    }

    const HandleLike = async (id) => {
        setIsLiking(true)
        let tweet = await fetchTweetById(id);
        await addLike(tweet);
        setIsLiking(false)
    }

    return (
        <div>
            {isLoading ? (
                <main className="flex flex-col min-h-screen items-center justify-between">
                    <section className="flex flex-col items-center px-4 sm:px-6">
                        <div className="flex items-start space-x-2 p-2 m-2">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[150px]" />
                                <Skeleton className="h-40 w-[350px]" />
                            </div>
                        </div>
                        <div className="flex items-start space-x-2 p-2 m-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-[150px]" />
                                <Skeleton className="h-24 w-[350px]" />
                            </div>
                        </div>
                        {/* <div className="flex items-start space-x-2 p-2 m-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-[150px]" />
                            <Skeleton className="h-24 w-[350px]" />
                        </div>
                    </div>
                    <div className="flex items-start space-x-2 p-2 m-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-[150px]" />
                            <Skeleton className="h-24 w-[350px]" />
                        </div>
                    </div> */}
                    </section>
                </main>
            ) : (
                <main className="flex flex-col min-h-screen items-center justify-between ">
                    <section className="flex flex-col border-x rounded border-gray-800 items-center px-4 sm:px-6">
                        <div className="flex items-start flex-col">
                            <div >
                                <div className="flex items-start space-x-2 p-2 m-2">
                                    <Image
                                        alt="Avatar"
                                        className="rounded-full"
                                        height="64"
                                        src={data[0]?.avatar}
                                        style={{
                                            aspectRatio: "64/64",
                                            objectFit: "cover",
                                        }}
                                        width="64"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h1 className="font-bold text-xl">{data[0]?.full_name}</h1>
                                            <p className="text-gray-500">@{data[0]?.username}</p>
                                        </div>
                                        <p className="text-gray-500 line-clamp-7 mb-3 ms-1 dark:text-white whitespace-pre-wrap md:w-96">
                                            {data[0]?.content}<br />
                                        </p>
                                        {data[0]?.ogContent != null &&
                                            <div className="flex border rounded-md border-gray-800 items-start space-x-1 p-1 m-1">
                                                <Image
                                                    alt="Avatar"
                                                    className="rounded-full"
                                                    height="32"
                                                    src={data[0]?.ogUser?.avatar}
                                                    style={{
                                                        aspectRatio: "32/32",
                                                        objectFit: "cover",
                                                    }}
                                                    width="32"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h1 className="font-bold text-sm">{data[0]?.ogUser.full_name}</h1>
                                                        <p className="text-gray-500 text-sm">@{data[0]?.ogUser.username}</p>
                                                    </div>
                                                    <Link href={'/feed/' + data[0]?.ogTweetId}>
                                                        <p className="text-gray-500 line-clamp-3 mb-3 ms-1 text-sm dark:text-white whitespace-pre-wrap md:w-72">
                                                            {data[0]?.ogContent}<br />
                                                        </p>
                                                    </Link>
                                                </div>
                                            </div>
                                        }
                                        <div className="flex items-center gap-1 mt-1">
                                            <Button className=" space-x-2" onClick={() => { HandleComment(data[0].tweetId) }} disabled={isCommenting} variant={"link"}><MessageSquareIcon props={data[0]?.metadata?.answer_count > 0} className="w-6 h-6" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{data[0]?.metadata?.answer_count}</span>
                                            </Button>
                                            <Button className=" space-x-2" onClick={() => { HandleRetweet(data[0].tweetId) }} disabled={isRetweeting} variant={"link"}><RetweetIcon props={data[0]?.metadata?.retweet_count > 0} className="w-6 h-6" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{data[0]?.metadata?.retweet_count}</span>
                                            </Button>
                                            <Button className=" space-x-2" onClick={() => { HandleLike(data[0].tweetId) }} disabled={isLiking} variant={"link"}><HeartIcon props={data[0]?.metadata?.favorite_count > 0} className=" w-6 h-6" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{data[0]?.metadata?.favorite_count}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                            </div>
                        </div>
                        {data[0]?.answer?.map((key, id) =>
                            <div key={id} className="flex items-start flex-col">
                                {data[0]?.answer[id]?.perTweetId == true &&
                                    <div>
                                        <div>
                                            <div className="flex items-start space-x-2 p-2 m-2">
                                                <Image
                                                    alt="Avatar"
                                                    className="rounded-full"
                                                    height="42"
                                                    src={key?.answerUser?.avatar}
                                                    style={{
                                                        aspectRatio: "42/42",
                                                        objectFit: "cover",
                                                    }}
                                                    width="42"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h1 className="font-bold text-md">{key?.answerUser?.full_name}</h1>
                                                        <p className="text-gray-500 text-sm">@{key?.answerUser?.username}</p>
                                                    </div>
                                                    <p className="text-gray-500 line-clamp-7 text-sm mb-3 ms-1 dark:text-white whitespace-pre-wrap md:w-96">
                                                        {key?.content}<br />
                                                    </p>
                                                </div>
                                            </div>
                                            <Separator />
                                        </div>
                                    </div>
                                }
                            </div>
                        )}
                    </section>
                </main>
            )}
        </div>
    )
}

function HeartIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={props.props ? 'red' : 'none'}
            stroke={props.props ? 'red' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}

function MessageSquareIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill='none'
            stroke={props.props ? 'blue' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
}

function RetweetIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 576 512"
            fill={props.props ? 'green' : '#fafafa'}
            stroke={props.props ? 'red' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path
                d="M272 416c17.7 0 32-14.3 32-32s-14.3-32-32-32H160c-17.7
        0-32-14.3-32-32V192h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64c-12.5-12.5-32.8-12.5-45.3
        0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l32 0 0 128c0 53 43 96 96 96H272zM304 
        96c-17.7 0-32 14.3-32 32s14.3 32 32 32l112 0c17.7 0 32 14.3 32 32l0 128H416c-12.9 0-24.6 7.8-29.6
        19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9
        6.9-34.9s-16.6-19.8-29.6-19.8l-32 0V192c0-53-43-96-96-96L304 96z"
            />
        </svg>
    )
}