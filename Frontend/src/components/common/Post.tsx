import { FormEvent, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Link } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark, FaArrowLeft } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { PostProps } from "../../types/postProps";
import { LoadingSpinner } from "./LoadingSpinner";

export const Post: React.FC<PostProps> = ({ post }) => {
  const { modalRef, backdropRef, openModal, closeModal } = useModal();
  const [comment, setComment] = useState<string>("");
  const postOwner = post.user;
  const isLiked: boolean = false;

  const isMyPost: boolean = true;

  const formattedDate: string = "1h";

  const isCommenting: boolean = false;


  const handleDeletePost = () => {};

  const handlePostComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleLikePost = () => {};

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-white/20">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeletePost}
                />
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-white/20"
                alt="of the post"
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={openModal}
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 hidden"
                ref={backdropRef}
              ></div>
              <dialog
                ref={modalRef}
                className="bg-black text-white rounded outline outline-1 outline-white/35"
              >
                <div className="py-6 px-12">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-6 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="w-8">
                          <img
                            className="rounded-full w-full h-full"
                            src={
                              comment.user.profileImg ||
                              "/avatar-placeholder.png"
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user.fullName}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment.user.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-white/20 pt-4"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="bg-black w-full p-1 rounded text-md resize-none border border-white/20 focus:outline-none"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="bg-primary rounded-full text-white px-4 py-2">
                      {isCommenting ? (
                        <LoadingSpinner className="w-5 h-5" />
                      ) : (
                        "Post"
                      )}
                    </button>
                  </form>
                </div>
                <button onClick={closeModal} className="ml-3 mb-3">
                  <FaArrowLeft className="w-4 h-4" />
                </button>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {!isLiked && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}
                {isLiked && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
                )}

                <span
                  className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : ""
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
