import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import Logo from "../../assets/icon.png";
import { MessageCircleMore, ThumbsUp, Trash2Icon } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { storage, db } from "../../firebase";
import { toast } from "react-toastify";
interface MediaItem {
  type: "image" | "video";
  downloadURL: string;
  alt?: string;
}

interface User {
  username: string;
  profile?: string;
  //   location: string;
}
interface Uploader {
  user: User;
}
interface PostProps {
  id?: string;
  uploader?: Uploader;
  timestamp?: string; // ISO string or formatted date
  caption?: string;
  media: MediaItem[];
  comments?: string[];
  likes?: string[];
}

export const PostCard: React.FC<{ post: PostProps }> = ({ post }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { media, uploader } = post;
  console.log(media);

  const handlePrev = () => {
    setCurrentIndex((i) => (i - 1 + media.length) % media.length);
  };
  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % media.length);
  };

  // Swipe handlers for mobile touch
  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true // allow swipe with mouse (for testing)
  });
  const deletePost = async () => {
    if (!post?.id) {
      return toast?.error(
        "Failed to Delete post,please contact Technical Support"
      );
    }
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      // Step 1: Delete media files
      for (const item of post.media || []) {
        const url = item.downloadURL;
        const path = getStoragePathFromUrl(url);
        if (path) {
          const storageRef = ref(storage, path);
          await deleteObject(storageRef);
        }
      }

      // Step 2: Delete Firestore document
      await deleteDoc(doc(db, "posts", post.id));
      toast.success("✅ Post deleted successfully");
      
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const getStoragePathFromUrl = (url: string): string | null => {
    try {
      const decodedUrl = decodeURIComponent(url);
      const match = decodedUrl.match(/\/o\/(.+)\?alt=media/);
      if (match && match[1]) {
        return match[1]; // this is the path inside Firebase Storage
      }
    } catch (e) {
      console.error("Error parsing URL:", e);
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow mb-6">
      {/* Post Header: profile image, name, location, timestamp */}
      <div className="flex flex-row justify-between items-center p-4 w-[100%]">
        <div className="flex">
          <img
            src={uploader?.user?.profile ? uploader?.user?.profile : Logo}
            alt={`${uploader?.user?.username}'s profile`}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-row items-center">
            <div className="ml-3 flex-1 flex flex-row justify-between">
              <h3 className="text-[#195e3d] font-semibold">
                {uploader?.user?.username}
              </h3>
              <div className="flex flex-row gap-x-1">
                {" "}
                <p className="text-gray-500 text-sm flex flex-row items-center">
                  {" "}
                  <MessageCircleMore /> {post?.comments?.length}
                </p>
                <p className="text-gray-500 text-sm flex flex-row items-center">
                  {" "}
                  <ThumbsUp /> {post?.likes?.length}
                </p>
              </div>
            </div>
          </div>
          {/* Time element for timestamp (machine-readable datetime) */}
          <time className="text-gray-500 text-sm">{post.timestamp}</time>
        </div>
        <button
          onClick={deletePost}
          className="bg-red-800 px-4 py-2 rounded-md text-white font-bold"
        >
          <Trash2Icon />
        </button>
      </div>

      {/* Media Carousel */}
      <div
        {...handlers}
        className="relative overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Post media carousel"
      >
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${currentIndex + 1} of ${media.length}`}
        >
          {/* Render current media item */}
          {media[currentIndex]?.type?.startsWith("image") ? (
            <img
              src={media[currentIndex].downloadURL}
              alt={media[currentIndex].alt || post.caption}
              className="w-full object-contain transition-transform duration-200 ease-in-out transform hover:scale-105"
            />
          ) : (
            <video
              src={media[currentIndex].downloadURL}
              className="w-full object-contain"
              muted={false}
              loop
              playsInline
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
              aria-label="Post video"
            />
          )}
        </div>

        {/* Navigation Buttons (visible only if multiple media items) */}
        {media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-[#195e3d] p-2 rounded-full"
            >
              {/* Left arrow icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-[#195e3d] p-2 rounded-full"
            >
              {/* Right arrow icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Post Caption */}
      <div className="px-4 py-2">
        <p className="text-gray-700">{post.caption}</p>
      </div>
    </div>
  );
};
