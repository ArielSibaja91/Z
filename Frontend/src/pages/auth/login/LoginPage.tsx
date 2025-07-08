import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { ZSVG } from "../../../components/svgs/ZSVG";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import toast from "react-hot-toast";
import { useLoginMutation } from "../../../features/auth/authApi";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await toast.promise(login(formData).unwrap(), {
      loading: 'Loggin...',
      success: <b>Logged in successfully!</b>,
      error: <b>Login failed. Please check your credentials.</b>
    });
    navigate("/");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className='max-w-screen-xl mx-auto flex h-screen xl:p-0 px-9 pt-9'>
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <ZSVG className='lg:w-2/3 fill-white' />
      </div>
      <div className='flex-1 flex flex-col xl:justify-center items-center'>
        <form className='w-full flex gap-4 flex-col' onSubmit={handleSubmit}>
          <ZSVG className='w-8 lg:hidden fill-white mb-10' />
          <h1 className='xl:text-6xl text-4xl font-bold text-white mb-4'>What's happening now</h1>
          <h2 className='xl:text-3xl text-2xl font-bold text-white mb-1'>Join Today</h2>
          <label className='border border-white/25 p-2 rounded flex items-center gap-2'>
            <MdOutlineMail />
            <input
              type='text'
              className='grow bg-transparent'
              placeholder='username'
              name='username'
              onChange={handleInputChange}
              value={formData.username}
              disabled={isLoading}
            />
          </label>
          <label className='border border-white/25 p-2 rounded flex items-center gap-2'>
            <MdPassword />
            <input
              type='password'
              className='grow bg-transparent'
              placeholder='Password'
              name='password'
              onChange={handleInputChange}
              value={formData.password}
              disabled={isLoading}
            />
          </label>
          <button
            className='rounded-full py-1.5 bg-primary text-white font-semibold w-full flex items-center justify-center'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner className='w-5 h-5' /> : "Log in"}
          </button>
        </form>
        <div className='w-full flex flex-col gap-2 mt-4'>
          <p className='text-white text-lg'>Don't have an account?</p>
          <Link to='/signup'>
            <button
              className='rounded-full py-1.5 font-semibold bg-transparent text-primary w-full outline outline-1 outline-white/40'
              disabled={isLoading}
            >
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};
