import { useState } from "react";

import { Grid2X2Check, Table2Icon,PlusIcon, XCircle } from "lucide-react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import TopLoadingBar from "../Utils/TopLineLoader";
import NProgress from "nprogress";
import { PostCard } from "../Utils/PostCard";
import  Masonry from "react-masonry-css";
import NewPostForm from "../Utils/Forms/UploadMedia";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
// import {toast} from 'react-toastify'
// import 'nprogress/nprogress.css';
export default function DashboardPosts() {
     const { user } = useSelector((state: RootState) => state?.auth);
  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
    const postList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPosts(postList);
    setLoading(false);
    NProgress.done();
  }, (error) => {
    console.error("Error fetching posts:", error);
    setLoading(false);
    NProgress.done();
  });

  NProgress.start();

  return () => unsubscribe(); // Clean up the listener on unmount
}, []);
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };
  const [Posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [uploadForm,setUploadForm]=useState(false)
//   const fetchPost = async () => {
//     NProgress.start();
//     try {
//       const querySnapshot = await getDocs(collection(db, "posts"));
//       const postList: any = querySnapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data
//         };
//       });
//       setPosts(postList);
//       console.log(postList);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     } finally {
//       setLoading(false);
//       NProgress.done();
//     }
//   };
  return (
    <div className="relative flex flex-col py-4 flex-1 bg-white px-3 text-gray-500 rounded-3xl min-h-[90vh] max-h-[90vh] overflow-scroll ">
      <TopLoadingBar isLoading={loading} />
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center  ">
          <button className="bg-[#195e3d] rounded-l-full px-5 py-2">
            <Grid2X2Check size={20} color="#fff" />
          </button>
          <button className="bg-[#fff] rounded-r-full border px-5 py-2">
            <Table2Icon size={20} color="black" />
          </button>
        </div>
        <div className="flex flex-row gap-x-2 ">
          <div className="divide-x divide-gray-200 items-center border  border-gray-200 rounded-full">
            <button className="py-2 px-4 ">Previous</button>
          <button className="py-2 px-4 ">Next</button>
          </div>
          <button onClick={()=>setUploadForm(true)} className='flex flex-row items-center gap-x-2 rounded-full px-3 py-1 bg-gradient-to-r from-[#195e3d] to-[#3b793e] tx=ext-white'>
            <PlusIcon color='#fff' />
            <h1 className='text-gray-200'>Add New Post</h1>
        </button>
        </div>
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid py-4"
        columnClassName="my-masonry-grid_column"
      >
        {Posts.map((post:any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Masonry>
       {uploadForm && <div className="absolute top-0 w-[100%] h-[100%] bg-[rgba(0,0,0,0.7)] flex flex-col items-center jutsify-center">
        <button className="text-white bg-red-900 flex flex-row items-center my-2 rounded-lg px-4 py-1 " onClick={()=>setUploadForm(false)}><XCircle color="white" />
        close</button>
        <NewPostForm currentUser={user} />
      </div>}
    </div>
  );
}
