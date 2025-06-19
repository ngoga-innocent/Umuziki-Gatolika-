import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from '../../../firebase';
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

interface UploadedMedia {
  downloadURL: string;
  type: string;
}

interface Props {
  currentUser: any;
}

const NewPostForm: React.FC<Props> = ({ currentUser }) => {
  const [caption, setCaption] = useState("");
  const [choirName, setChoirName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    setMediaFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: true,
  });

  const uploadFile = async (file: File, index: number): Promise<UploadedMedia> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => {
            const newProgress = [...prev];
            newProgress[index] = progress;
            return newProgress;
          });
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ downloadURL, type: file.type });
        }
      );
    });
  };

  const handleCreatePost = async () => {
    if (!caption || !choirName || !eventDate || mediaFiles.length === 0) {
      toast.error("Please fill all fields and select media");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(Array(mediaFiles.length).fill(0));

      const uploadedMedia = await Promise.all(
        mediaFiles.map((file, idx) => uploadFile(file, idx))
      );

      const postData = {
        caption,
        choirName,
        eventDate,
        createdAt: Date.now(),
        // uploader: currentUser?.user,
        media: uploadedMedia,
        likes: [],
        comments: [],
      };

      await addDoc(collection(db, "posts"), postData);
      toast.success("Post created successfully");

      // Clear
      setCaption("");
      setChoirName("");
      setEventDate("");
      setMediaFiles([]);
      setUploadProgress([]);
    } catch (err) {
      console.error("Post creation failed", err);
      toast.error("Failed to create post");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>

      <input
        className="w-full border p-2 rounded mb-3"
        type="text"
        placeholder="Post Name"
        value={choirName}
        onChange={(e) => setChoirName(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded mb-3"
        rows={3}
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 rounded mb-4 text-center cursor-pointer ${
          isDragActive ? "border-green-500" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop files here...</p> : <p>Drag and drop images/videos here, or click to select files</p>}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {mediaFiles.map((file, index) => (
          <div key={index} className="relative">
            {file.type.startsWith("image") ? (
              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-32 object-cover rounded" />
            ) : (
              <video className="w-full h-32 object-cover rounded" controls>
                <source src={URL.createObjectURL(file)} type={file.type} />
              </video>
            )}
            <div className="w-full h-1 bg-gray-200 mt-1">
              <div
                className="h-1 bg-green-600"
                style={{ width: `${uploadProgress[index] || 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleCreatePost}
        disabled={uploading}
        className="bg-[#195e3d] text-white px-6 py-2 rounded hover:bg-[#144b31]"
      >
        {uploading ? "Uploading..." : "Post"}
      </button>
    </div>
  );
};

export default NewPostForm;
