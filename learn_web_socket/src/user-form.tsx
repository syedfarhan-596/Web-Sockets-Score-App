import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Form {
  name: string;
  email: string;
}

function UserForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Form>({
    name: "",
    email: "",
  });

  const url = import.meta.env.VITE_BACKEND_URL;

  const handleClick = async (e: any) => {
    e.preventDefault();

    try {
      const response: any = await fetch(`${url}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, name: formData.name }),
      });

      const jsonResponse = await response.json();

      navigate(`/scores/${jsonResponse.user._id}`);
    } catch (error) {}
  };

  const handleFormElementChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <>
      <h1 className="text-center text-3xl font-bold m-10">Web Sockets</h1>
      <div className="flex items-center justify-center">
        <form className="w-full max-w-md">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormElementChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleFormElementChange}
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleClick}
              className="bg-gray-400 p-2 px-4 rounded-md hover:bg-gray-500 font-bold"
            >
              Add Score
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UserForm;
