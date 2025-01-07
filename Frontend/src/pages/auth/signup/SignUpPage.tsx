import { Link } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { ZSVG } from "../../../components/svgs/ZSVG";
import {
  MdOutlineMail,
  MdPassword,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FormData } from "../../../types/formData";
import { useAuth } from "../../../hooks/useAuth";

export const SignUpPage = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
  const { signup, isLoading, isError } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    signup(formData);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <ZSVG className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <ZSVG className="w-24 lg:hidden fill-white" />
          <h1 className="text-[2.70rem] leading-none font-extrabold text-white/90">
            Welcome to Z.
          </h1>
          <h2 className="text-2xl font-extrabold text-white/90">Join In now</h2>
          <label className="border border-white/25 p-2 rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow bg-transparent"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="border border-white/25 p-2 rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow bg-transparent"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="border border-white/25 p-2 rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow bg-transparent"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
          <label className="border border-white/25 p-2 rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow bg-transparent"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="rounded-full py-1.5 bg-primary text-white font-semibold w-full">
            {isLoading ? "Loading..." : "Signup"}
          </button>
          {isError && <p className="text-red-500">Something went wrong...</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="rounded-full py-1.5 font-semibold bg-transparent text-primary w-full outline outline-1 outline-white/40">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};
