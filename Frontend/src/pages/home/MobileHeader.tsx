import { useAuthCheckQuery } from "../../features/auth/authApi";
import { ZSVG } from "../../components/svgs/ZSVG";
import { Link } from "react-router-dom";

export const MobileHeader = () => {
  const { data: user } = useAuthCheckQuery();

  return (
    <div className='sm:hidden flex w-full h-16 bg-black pl-4 pr-12'>
      <div className='flex items-center justify-between w-full'>
        {user && (
          <Link
            to={`/profile/${user.username}`}
            className="cursor-pointer"
          >
            <img
              src={user.profileImg || "/avatar-placeholder.png"}
              className='w-8 h-8 rounded-full'
            />
          </Link>
        )}
        <ZSVG className='w-10 h-10 fill-white mx-auto' />
      </div>
    </div>
  );
};
