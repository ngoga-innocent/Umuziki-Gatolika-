import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db, realdb } from "../../firebase";
import NProgress from "nprogress";
import PostAnalytics from "./DashboardHomeSections/BarChat";
import { ChartNoAxesCombined, Coins, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  onValue,
  orderByChild,
  query,
  ref,
  limitToLast
} from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { url } from "../../url";
export default function DashboardHome() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any>();
  const [totAmount, setTotAmount] = useState<any>();
  const [uploaders, setTopUploaders] = useState<any>();
  const [messages, setMessages] = useState<any[]>();
  dayjs.extend(relativeTime);

  const formatRelativeTime = (timestamp: number) => {
    return dayjs(timestamp).fromNow(); // e.g., "2 minutes ago"
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        const postList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setPosts(postList);
        // setLoading(false);
        NProgress.done();
      },
      (error) => {
        console.error("Error fetching posts:", error);
        // setLoading(false);
        NProgress.done();
      }
    );

    NProgress.start();

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);
  // Step 1: Group posts by uploader
  const uploaderStats: Record<string, { count: number; name: string }> = {};

  function getUpuploaders() {
    posts?.forEach((post: any) => {
      const id = post?.uploader?.user?.id || "Admin";
      let name;
      if (post?.uploader) {
        name =
          post?.uploader?.user?.first_name +
            " " +
            post?.uploader?.user?.last_name || "Admin";
      } else {
        name = "Web Admin ";
      }

      if (!uploaderStats[id]) {
        uploaderStats[id] = { count: 0, name };
      }
      uploaderStats[id].count += 1;
    });

    // Step 2: Convert to array and sort
    const topUploaders = Object.entries(uploaderStats)
      .map(([id, data]) => ({
        id,
        name: data?.name || "New User",
        count: data.count,
        percent: ((data.count / posts?.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5
    console.log("top uploaders", topUploaders);

    setTopUploaders(topUploaders);
  }
  useEffect(() => {
    getUpuploaders();
  }, [posts]);
  async function getChats() {
    const messageRef = query(
      ref(realdb, "messages/"),
      orderByChild("timestamp"),
      limitToLast(10)
    );
    const unsbscribe = onValue(messageRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesArray = Object.entries(snapshot.val() || {}).map(
          ([key, value]: any) => ({
            id: key,
            ...value
          })
        );
        console.log("messages", messagesArray);
        setMessages(messagesArray);
      }
    });
    return () => unsbscribe;
  }
  useEffect(() => {
    getChats();
    getTotalAmount();
  }, []);
  // Fwtch Amount
  const getTotalAmount = async () => {
    const result = await axios.get(`${url}/staff/payment_api`);
    setTotAmount(result?.data);
  };
  return (
    <div className="h-[90vh] bg-white flex-1 flex flex-col items-start justify-start max-h-screen max-w-screen w-[80vw] overflow-scroll rounded-xl p-3">
      <div className="flex flex-row gap-x-2 flex-wrap justify-between w-[70vw]">
        <button
          onClick={() => navigate("/dashboard/posts")}
          className="py-1 transition-all hover:bg-[#195e3d] hover:text-white hover:cursor-pointer px-2 rounded-md flex flex-col border border-gray-500 items-start text-gray-500"
        >
          <div className="flex flex-row items-center gap-x-2 ">
            <ChartNoAxesCombined />
            <h1 className="font-bold">Total Posts</h1>
          </div>
          <div className="flex flex-row gap-x-2">
            {posts?.length}
            <TrendingUp />
          </div>
        </button>
        <div className="flex flex-row items-center gap-x-2">
          <div className="py-1  px-2 rounded-md flex flex-col border border-gray-500 transition-all hover:bg-[#195e3d] hover:text-white hover:cursor-pointer text-gray-500 items-center">
            <div className="flex flex-row items-center gap-x-2">
              <Coins />
              <h1 className="font-bold">MTN Amount</h1>
            </div>
            <div className="flex flex-row gap-x-2 font-bold text-sm items-center">
              {totAmount?.info?.mtn_balance ?? 0} Rwf
              {/* <TrendingUp /> */}
            </div>
          </div>
          <div className="py-1  px-2 rounded-md flex flex-col border border-gray-500 transition-all hover:bg-[#195e3d] hover:text-white hover:cursor-pointer text-gray-500 items-center">
            <div className="flex flex-row items-center gap-x-2">
              <Coins />
              <h1 className="font-bold">Airtel Amount</h1>
            </div>
            <div className="flex flex-row gap-x-2 font-bold text-sm items-center">
              {totAmount?.info?.airtel_balance ?? 0} Rwf
              {/* <TrendingUp /> */}
            </div>
          </div>
          <div className="py-1  px-2 rounded-md flex flex-col border border-gray-500 transition-all hover:bg-[#195e3d] hover:text-white hover:cursor-pointer text-gray-500 items-center">
            <div className="flex flex-row items-center gap-x-2">
              <Coins />
              <h1 className="font-bold">Total Amount</h1>
            </div>
            <div className="flex flex-row gap-x-2 font-bold text-sm items-center">
              {totAmount?.info?.balance ?? 0} Rwf
              {/* <TrendingUp /> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[100%]">
        <PostAnalytics posts={posts} />
      </div>
      <div className="flex flex-row gap-x-6 mt-8">
        <div className="bg-gray-200 p-2 rounded-lg">
          <h1 className="font-bold text-xl text-[#195e3d] my-3">
            Recent Messages
          </h1>
          <div className="flex-1 flex flex-col divide-y bg-gray-200  divide-gray-300 ">
            {messages?.map((message, index) => {
              return (
                <div key={index} className="flex flex-row items-center py-1">
                  <div className="rounded-full bg-white ring-1 flex flex-col w-8 h-8 ring-[#195e3d] items-center justify-center">
                    <p>{message?.user?.username?.slice(0, 1)}</p>
                  </div>
                  <div className="flex-1 px-2 text-zinc-500">
                    {message?.text}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(message?.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col w-[20vw] h-fit text-[#195e3d] border border-gray-300 rounded-lg py-3 px-3 ">
          <h1 className="font-bold text-lg">Top post Uploader</h1>
          <div className="flex flex-col my-4 divide-y divide-gray-200 ">
            {uploaders?.map((uploader: any, index: number) => {
              return (
                <div
                  key={index}
                  className="flex gap-y-0  flex-row w-[100%] justify-between items-center"
                >
                  <div className="flex flex-row items-center gap-x-1">
                    <div
                      className={`w-3 h-3 rounded-full bg-[#195e3d] opacity-${index}`}
                    ></div>
                    <p>{uploader?.name}</p>
                  </div>
                  <p>{uploader?.percent}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
