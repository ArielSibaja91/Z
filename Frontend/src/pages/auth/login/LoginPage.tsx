import { Link } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { FormData } from "../../../types/formData";
import { ZSVG } from "../../../components/svgs/ZSVG";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useAuth } from "../../../hooks/useAuth";

export const LoginPage = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const { login, isLoading, isError } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    login(formData);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <ZSVG className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="w-full flex gap-4 flex-col" onSubmit={handleSubmit}>
          <ZSVG className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="border border-white/25 p-2 rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow bg-transparent"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>
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
            {isLoading ? "Loading..." : "Log in"}
          </button>
          {isError && <p className="text-red-500">Something went wrong...</p>}
        </form>
        <div className="w-full flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">Don't have an account?</p>
          <Link to="/signup">
            <button className="rounded-full py-1.5 font-semibold bg-transparent text-primary w-full outline outline-1 outline-white/40">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};
