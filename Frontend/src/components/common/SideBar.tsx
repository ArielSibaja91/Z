import { ZSVG } from "../svgs/ZSVG";
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

export const SideBar = () => {
  const { data: user } = useAuthCheckQuery();
  const { data: notifications } = useGetNotificationsQuery();
  const notificationsCount = notifications?.length || 0;
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const handleLogout = async (): Promise<void> => {
    const confirm = window.confirm(
      "Are you sure you want to logout?"
    );
    if (!confirm) return;
    await toast.promise(logout().unwrap(), {
      loading: "Loggin Out...",
      success: "Logged out successfully!",
      error: "Failed to logout!",
    });
    dispatch(authApi.util.resetApiState());
  };

  return (
    <nav className='md:flex-[2_2_0] sm:flex w-18 max-w-52 hidden'>
      <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-white/20 w-20 md:w-full'>
        <Link to='/' className='flex justify-center md:justify-start'>
          <ZSVG className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
        </Link>
        <ul className='flex flex-col gap-3 mt-4'>
          <li className='flex justify-center md:justify-start'>
            <Link
              to='/'
              className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer'
            >
              <MdHomeFilled className='w-8 h-8' />
              <span className='text-lg hidden md:block'>Home</span>
            </Link>
          </li>
          <li className='flex justify-center md:justify-start'>
            <Link
              to='/notifications'
              className='relative flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer'
            >
              <IoNotifications className='w-6 h-6' />
              {notificationsCount > 0 && (
                <span className='absolute left-5 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
                  {notificationsCount > 99 ? "99+" : notificationsCount}
                </span>
              )}
              <span className='text-lg hidden md:block'>Notifications</span>
            </Link>
          </li>
          <li className='flex justify-center md:justify-start'>
            <Link
              to={`/profile/${user?.username}`}
              className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer'
            >
              <FaUser className='w-6 h-6' />
              <span className='text-lg hidden md:block'>Profile</span>
            </Link>
          </li>
        </ul>
        {user && (
          <div className='mt-auto mb-10 flex gap-2 items-center transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'>
            <Link
              to={`/profile/${user.username}`}
              className='hidden md:flex flex-1 items-center gap-2'
            >
              <div className='hidden md:inline-flex'>
                <div className='w-8'>
                  <img
                    className='rounded-full'
                    src={user?.profileImg || "/avatar-placeholder.png"}
                    alt='User profile'
                  />
                </div>
              </div>
              <div className='hidden md:block'>
                <p className='text-white font-bold text-sm w-20 truncate'>
                  {user?.fullName}
                </p>
                <p className='text-slate-500 text-sm'>@{user?.username}</p>
              </div>
            </Link>
            <BiLogOut
              className='md:w-5 md:h-5 w-6 h-6 cursor-pointer md:ml-auto mx-auto'
              onClick={handleLogout}
            />
          </div>
        )}
      </div>
    </nav>
  );
};
