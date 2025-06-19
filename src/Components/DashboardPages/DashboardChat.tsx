import { SendHorizonal } from "lucide-react";
// import React from 'react'
import {
  query,
  ref,
  limitToLast,
  orderByChild,
  onValue,
  push,
  serverTimestamp
} from "firebase/database";
import { realdb } from "../../firebase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
// import ChatBg from '../../assets/DefaultWallpaper.png'
export default function DashboardChat() {
  const [messages, setMessages] = useState<any>([]);
  const [message,setMessage]=useState<string>("")
  const { user } = useSelector((state: RootState) => state?.auth);
  async function getChats() {
    const messageRef = query(
      ref(realdb, "messages/"),
      orderByChild("timestamp"),
      limitToLast(100)
    );
    const unsbscribe = onValue(messageRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesArray = Object.entries(snapshot.val() || {}).map(
          ([key, value]: any) => ({
            id: key,
            ...value
          })
        );
        console.log("messagessss", messagesArray);
        setMessages(messagesArray);
      }
    });
    return () => unsbscribe;
  }
  useEffect(() => {
    getChats();
  }, []);
  const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeString = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) {
    return `${timeString}`;
  } else if (isYesterday) {
    return `Yesterday, ${timeString}`;
  } else {
    const dateString = date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return `${dateString} , ${timeString}`;
  }
};
const handleSendMessage=async()=>{
    try {
        if(message?.trim()=="") return ;
        const messageRef=ref(realdb,'messages/')
        console.log(user?.id);
        
        await push(messageRef,{
            text:message,
            user:{
                userId:user?.id,
                username:user?.username,
            },
            timestamp:serverTimestamp()
        })
        setMessage("")
    } catch (error) {
        console.log(error);
        
    }
    // console.log(message)
}
  return (
    <div 
 className=" max-h-[90vh] bg-gray-800 overflow-scroll h-[90vh] flex-1 rounded-xl w-[100%] flex flex-col p-2">
      <h2 className="font-bold text-xl text-[#195e3d]">GROUP CHATS</h2>
      <div className="flex-1 flex flex-col w-[100%] max-h-[80vh] overflow-scroll py-7">
        {messages?.map((message:any,index:number)=>{
            return(
                <div className={`flex flex-col bg-gray-200 rounded-lg my-1 p-2 w-fit max-w-[60%] flex-wrap ${ message?.user?.userId ==user?.id && 'self-end flex-end bg-green-700 text-gray-200'}`} key={index}>
                    <span className="font-bold text-xs">
                        ~{message?.user?.username }
                    </span>
                    <p className="py-2">{message?.text}</p>
                    <span className="font-bold text-[#195e3d] text-xs self-end">
                        {formatTime(message?.timestamp)}
                    </span>
                </div>
            )
        })}
      </div>
      <div className="flex flex-row bg-gray-200 w-[80%] border border-zinc rounded-full px-3 items-center p-1">
        <input type="text" value={message} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setMessage(e.target.value)} className="flex-1  outline-none " />
        <button onClick={handleSendMessage} className="rounded-full p-1 bg-[#195e3d]">
          <SendHorizonal color="white" />
        </button>
      </div>
    </div>
  );
}
