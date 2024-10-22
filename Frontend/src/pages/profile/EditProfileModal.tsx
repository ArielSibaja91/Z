import { ChangeEvent, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { FormData } from "../../types/formData";
import { FaArrowLeft } from "react-icons/fa6";

export const EditProfileModal = () => {
  const { modalRef, backdropRef, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <button
        className="bg-black text-white hover:bg-white hover:text-black outline outline-1 outline-white/35 px-4 py-1.5 rounded-full duration-150"
        onClick={openModal}
      >
        Edit profile
      </button>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 hidden"
        ref={backdropRef}
      ></div>
      <dialog
        ref={modalRef}
        className="px-6 py-8 bg-black text-white rounded-lg outline outline-1 outline-white/35"
      >
        <div className="p-4">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form
            className="flex flex-col gap-4 [&>div>input]:flex-1 [&>div>input]:rounded [&>div>input]:p-2 [&>div>input]:bg-black [&>div>input]:border [&>div>input]:border-white/35"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Profile updated successfully");
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 border border-white/35 bg-black rounded p-2"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              placeholder="Link"
              className="flex-1 border border-white/35 bg-black rounded p-2"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <button onClick={closeModal} className="bg-primary rounded-full py-2 text-white hover:brightness-[.80] duration-200">
              Update
            </button>
          </form>
        </div>
        <button onClick={closeModal}>
          <FaArrowLeft className="w-4 h-4" />
        </button>
      </dialog>
    </>
  );
};

