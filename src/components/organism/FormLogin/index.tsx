import { MyInputForm } from "../../molecules/Form";
import { MyButton, MyButtonIcon } from "../../atoms/Button";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import api from "../../../services/api";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";

export function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loginGoogle = () => {
    window.location.href = "http://127.0.0.1:8000/api/auth/google/redirect";
  };

  const login = async (e: any) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      // redirect
      window.location.replace("/dashboard");
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  return (
    <div>
      <form onSubmit={login} className="flex flex-col gap-6">
        {/* <MyInputForm
          label="Email"
          type="email"
          placeholder="youremail@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <MyInputForm
          label="Password"
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex flex-col gap-4">
          <Button type="submit">login</Button>
        </div> */}
      </form>
      <MyButtonIcon
        className="w-full"
        titleButton="Login with Google"
        icon={faGoogle}
        size="lg"
        onClick={loginGoogle}
      />
    </div>
  );
}
