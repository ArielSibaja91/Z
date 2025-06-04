import { useState } from "react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import {
  useGetNotificationsQuery,
  useDeleteNotificationsMutation,
} from "../../features/notifications/notificationApi";
import { toast } from "react-hot-toast";

export const NotificationPage = () => {
  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useGetNotificationsQuery();

  const [deleteNotificationsMutation, { isLoading: isDeleting }] =
    useDeleteNotificationsMutation();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const handleDeleteNotifications = async (): Promise<void> => {
    try {
      if (notifications?.length === 0) {
        toast.error("No notifications to delete.");
        setIsOpen(false);
        return;
      }
      await deleteNotificationsMutation().unwrap();
      toast.success("All notifications deleted successfully!");
      setIsOpen(false);
    } catch (err: any) {
      console.error("Failed to delete notifications:", err);
      toast.error(err.data?.error || "Failed to delete notifications");
    }
  };

  if (isError) {
    console.error("Error fetching notifications:", error);
    return (
      <main className='flex-[4_4_0] border-r border-white/20 min-h-screen flex justify-center items-center'>
        <p className='text-red-500'>
          Error loading notifications. Please try again later.
        </p>
      </main>
    );
  }

  return (
    <main className='flex-[4_4_0] border-r border-white/20 min-h-screen'>
      <div className='flex justify-between items-center p-4 border-b border-white/20'>
        <p className='font-bold'>Notifications</p>
        <div className='relative m-1'>
          <button
            tabIndex={0}
            onClick={toggleDropdown}
            className='cursor-pointer'
          >
            <IoSettingsOutline className='w-4' />
          </button>
          {isOpen && (
            <ul className='absolute z-10 px-2 py-1 bg-black rounded-md w-52 ml-[-50px]'>
              <li>
                <button
                  onClick={handleDeleteNotifications}
                  className='w-full text-left px-4 py-2 hover:bg-zinc-900 duration-150'
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete all notifications"}
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
      {(isLoading || isDeleting) && (
        <div className='flex justify-center h-full items-center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && !isDeleting && notifications?.length === 0 && (
        <div className='text-center p-4'>
          <p className='text-gray-500'>No notifications found.</p>
        </div>
      )}
      {!isLoading &&
        !isDeleting &&
        notifications &&
        notifications.length > 0 &&
        notifications.map((notification) => (
          <div className='border-b border-white/20' key={notification._id}>
            <div className='flex gap-2 p-4'>
              {notification.type === "follow" && (
                <FaUser className='w-7 h-7 text-primary' />
              )}
              {notification.type === "like" && (
                <FaHeart className='w-7 h-7 text-red-500' />
              )}
              <Link to={`/profile/${notification.from.username}`}>
                <div className='avatar'>
                  <div className='w-8 rounded-full'>
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                      alt={`${notification.from.username}'s profile`}
                    />
                  </div>
                </div>
                <div className='flex gap-1'>
                  <span className='font-bold'>
                    @{notification.from.username}
                  </span>{" "}
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
