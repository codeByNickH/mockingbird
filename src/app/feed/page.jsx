import React from 'react'
import { FeedComponent } from '@/components/component/feed-component'
import { InputTweetComponent } from '@/components/component/input-tweet-component'

export default function Feed() {
  return (
    <div>
      <InputTweetComponent />
      <FeedComponent /> 
    </div>
  )
}
