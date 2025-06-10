import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useAuthCheckQuery } from "../../features/auth/authApi";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";

type CreatePostProps = {
  addPost: (postData: { text: string; img: string | null }) => Promise<void>;
};

export const CreatePost: React.FC<CreatePostProps> = ({ addPost }) => {
  const { data: user } = useAuthCheckQuery();
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<string | null>(null);
  const isLoading: boolean = false;
  const imgRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addPost({ text, img });
    setText("");
    setImg(null);
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-white/20">
      <img
        className="w-8 rounded-full"
        src={user?.profileImg || "/avatar-placeholder.png"}
      />
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="bg-transparent w-full p-0 text-lg resize-none focus:outline-none"
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          maxLength={500}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-1 right-1 text-white bg-black rounded-full w-5 h-5 cursor-pointer hover:brightness-75 duration-150"
              onClick={() => {
                setImg(null);
                if (imgRef.current) {
                  imgRef.current.value = "";
                }
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
              alt={`user ${user?.fullName}`}
            />
          </div>
        )}

        <div className="flex justify-between py-2 border-t border-white/20">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current?.click()}
            />
          </div>
          <input
            type="file"
            accept="/image*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button className="text-white bg-primary rounded-full px-5 py-1 font-semibold hover:brightness-[.85] duration-150">
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};
