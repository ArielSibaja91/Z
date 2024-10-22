import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";

export const CreatePost = () => {
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<string | null>(null);

  const imgRef = useRef<HTMLInputElement | null>(null);
  const isPending: boolean = false;
	const isError: boolean = false;

  const data = {
		profileImg: "/vite.svg",
	};

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Post submited successfully");
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
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={data.profileImg || "/vite.svg"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="bg-transparent w-full p-0 text-lg resize-none border-none focus:outline-none border-white/35"
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-1 right-1 text-white bg-black rounded-full w-5 h-5 cursor-pointer hover:brightness-75 duration-150"
              onClick={() => {
                setImg(null);
                if(imgRef.current){
                  imgRef.current.value = "";
                }
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between py-2">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current?.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input type="file" accept="/image*" hidden ref={imgRef} onChange={handleImgChange} />
          <button className="text-white bg-primary rounded-full px-5 py-1 font-semibold hover:brightness-[.85] duration-150">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};
