// import { useState } from "react";
import loginBg from "../assets/login_bg1.jpg";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { isAxiosError } from "axios";
import { url } from "../url";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { setCredentials } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const schema = z.object({
  username: z.string().nonempty("Username is Required"),
  password: z.string().nonempty("password is Required")
});
export default function Login() {
  // const [LoginSuccess, setSuccessLogin] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = async (data: any) => {
    try {
      console.log("Submitting:", data);

      const response = await axios.post(`${url}/account/Login`, {
        username: data.username,
        password: data.password
      });

      console.log("Response:", response.data);
      if (response?.data?.token) {
        await dispatch(
          setCredentials({
            user: response?.data?.user,
            token: response?.data?.token
          })
        );
        // Example: store token in Redux or localStorage
        localStorage.setItem("token", response.data.token);
        toast.success("Login Success!");
        navigate("/dashboard");
      }else{
        toast.error("Login Failed!check your Credentials");
      }
      //   alert("Login successful!");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        toast.error("Login Failed!");
      } else {
        console.error("Unknown error:", error);
        toast.error("Login Failed!");
        // alert("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <div
      className="flex flex-col w-full h-screen items-center justify-center bg-opacity-10"
      style={{
        backgroundImage: `url(${loginBg})`
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg p-5 w-[90%] md:w-[35%] flex flex-col items-center gap-y-4 shadow-md shadow-[#3b793e] z-10"
      >
        <h1 className="text-center text-xl w-[90%] text-[#3b793e]  py-2 rounded-full font-bold border-0 hover:border-2 border-[#3b793e] transition-all duration-500 ease-in">
          Login
        </h1>
        <input
          type="text"
          {...register("username")}
          name="username"
          placeholder="Username"
          className="py-1 outline-none border-b-1 border-tr-0 w-[90%] text-gray-400"
        />
        {errors.username && (
          <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
        )}
        <input
          type="password"
          {...register("password")}
          name="password"
          placeholder="Password"
          className="py-1 outline-none border-b-1 border-tr-0 w-[90%] text-gray-400"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
        <button className="self-end text-[#195e3d]">Forget Password?</button>
        <button
          disabled={isSubmitting}
          type="submit"
          className={`w-[90%] ${
            isSubmitting
              ? "bg-gray-500"
              : "bg-gradient-to-r from-[#195e3d] to-[#3b793e]"
          }  text-white py-2 rounded-full font-bold`}
        >
          {isSubmitting ? "submitting.." : "Login"}
        </button>
      </form>
    </div>
  );
}
