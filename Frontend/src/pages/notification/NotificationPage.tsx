import { useState } from "react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

export const NotificationPage = () => {
  const isLoading: boolean = false;
  const notifications = [
    {
      _id: "1",
      from: {
        _id: "1",
        username: "johndoe",
        profileImg: "/avatars/boy2.png",
      },
      type: "follow",
    },
    {
      _id: "2",
      from: {
        _id: "2",
        username: "janedoe",
        profileImg: "/avatars/girl1.png",
      },
      type: "like",
    },
  ];

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const deleteNotifications = (): void => {
    alert("All notifications deleted");
    setIsOpen(!isOpen);
  };

  return (
    <main className="flex-[4_4_0] border-r border-white/20 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-white/20">
        <p className="font-bold">Notifications</p>
        <div className="relative m-1">
          <button
            tabIndex={0}
            onClick={toggleDropdown}
            className="cursor-pointer"
          >
            <IoSettingsOutline className="w-4" />
          </button>
          {isOpen && (
            <ul className="absolute z-10 px-2 py-1 bg-black rounded-md w-52 ml-[-50px]">
              <li>
                <button
                  onClick={deleteNotifications}
                  className="w-full text-left px-4 py-2 hover:bg-zinc-900 duration-150"
                >
                  Delete all notifications
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center h-full items-center">
          <LoadingSpinner />
        </div>
      )}
      {notifications?.length === 0 && (
        <div className="text-center p-4 font-bold">No notifications 🤔</div>
      )}
      {notifications?.map((notification) => (
        <div className="border-b border-white/20" key={notification._id}>
          <div className="flex gap-2 p-4">
            {notification.type === "follow" && (
              <FaUser className="w-7 h-7 text-primary" />
            )}
            {notification.type === "like" && (
              <FaHeart className="w-7 h-7 text-red-500" />
            )}
            <Link to={`/profile/${notification.from.username}`}>
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img
                    src={
                      notification.from.profileImg || "/avatar-placeholder.png"
                    }
                  />
                </div>
              </div>
              <div className="flex gap-1">
                <span className="font-bold">@{notification.from.username}</span>{" "}
                {notification.type === "follow"
                  ? "followed you"
                  : "liked your post"}
              </div>
            </Link>
          </div>
        </div>
      ))}
    </main>
  );
};
