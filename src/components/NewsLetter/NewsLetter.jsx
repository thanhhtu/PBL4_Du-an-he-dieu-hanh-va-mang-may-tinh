import React from 'react'
import './NewsLetter.css'
const NewsLetters = () => {
  return (
    <div className='newsletter'>
      <h1>Get Exclusive Ofeers On Your Email</h1>
      <p>Subcribe to our newletter and stay updated</p>
      <div>
        <input type="email" placeholder='Your Email id' ></input>
        <button>Subcribe</button>
      </div>
    </div>
  )
}

export default NewsLetters
