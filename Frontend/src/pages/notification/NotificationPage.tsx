import { useState } from "react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaTrash } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import {
  useGetNotificationsQuery,
  useDeleteNotificationsMutation,
  useDeleteNotificationMutation,
} from "../../features/notifications/notificationApi";
import { toast } from "react-hot-toast";
import { NotificationSkeleton } from "../../components/skeletons/NotificationSkeleton";

export const NotificationPage = () => {
  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useGetNotificationsQuery();

  const [deleteNotificationsMutation, { isLoading: isDeleting }] =
    useDeleteNotificationsMutation();

  const [deleteNotificationMutation] = useDeleteNotificationMutation();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const handleDeleteNotifications = async (): Promise<void> => {
    if (notifications?.length === 0) {
      toast.error("No notifications to delete.");
      setIsOpen(false);
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all notifications?"
    );
    if (!confirmDelete) {
      setIsOpen(false);
      return;
    }
    await toast.promise(deleteNotificationsMutation().unwrap(), {
      loading: "Deleting notifications...",
      success: <b>All notifications deleted successfully!</b>,
      error: <b>Failed to delete notifications</b>,
    });
    setIsOpen(false);
  };

  const handleDeleteNotification = async (
    notificationId: string
  ): Promise<void> => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );
    if (!confirmDelete) return;
    await toast.promise(deleteNotificationMutation(notificationId).unwrap(), {
      loading: "Deleting notification...",
      success: <b>Notification deleted successfully!</b>,
      error: <b>Failed to delete notification</b>,
    });
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
        <div className='flex flex-col'>
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
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
                  <div className='w-8'>
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                      alt={`${notification.from.username}'s profile`}
                      className='rounded-full'
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
              <span className='flex justify-end flex-1'>
                {!isLoading && (
                  <FaTrash
                    className='cursor-pointer hover:text-red-500'
                    onClick={() => handleDeleteNotification(notification._id)}
                  />
                )}
                {isLoading && <LoadingSpinner className='w-5 h-5' />}
              </span>
            </div>
          </div>
        ))}
    </main>
  );
};
