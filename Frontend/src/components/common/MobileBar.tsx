import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useAuthCheckQuery } from "../../features/auth/authApi";
import { useLogoutMutation } from "../../features/auth/authApi";
import { useDispatch } from "react-redux";
import { authApi } from "../../features/auth/authApi";
import { useGetNotificationsQuery } from "../../features/notifications/notificationApi";
import toast from "react-hot-toast";

export const MobileBar = () => {
  const { data: user } = useAuthCheckQuery();
  const { data: notifications } = useGetNotificationsQuery();
  const notificationsCount = notifications?.length || 0;
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const handleLogout = async (): Promise<void> => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (!confirm) return;
    await toast.promise(logout().unwrap(), {
      loading: "Loggin Out...",
      success: <b>Logged out successfully!</b>,
      error: <b>Failed to logout!</b>,
    });
    dispatch(authApi.util.resetApiState());
  };

  return (
    <nav className='sm:hidden flex items-center justify-between bg-black border-t border-white/20 h-16 px-4 fixed bottom-0 left-0 right-0 z-50'>
      <Link to='/' className='flex items-center gap-2'>
        <MdHomeFilled className='w-8 h-8' />
      </Link>
      <Link
        to='/notifications'
        className='relative flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer'
      >
        <IoNotifications className='w-7 h-7' />
        {notificationsCount > 0 && (
          <span className='absolute left-5 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
            {notificationsCount > 99 ? "99+" : notificationsCount}
          </span>
        )}
        <span className='text-lg hidden md:block'>Notifications</span>
      </Link>
      <Link
        to={`/profile/${user?.username}`}
        className='flex items-center gap-2'
      >
        <FaUser className='w-6 h-6 text-white' />
      </Link>
      <BiLogOut className='w-7 h-7 cursor-pointer' onClick={handleLogout} />
    </nav>
  );
};
