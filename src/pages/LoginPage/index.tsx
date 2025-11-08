import { AuthLayout } from "../../layouts/AuthForm";
import { FormLogin } from "../../components/organism/FormLogin";
import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <AuthLayout
      titleCard="Login"
      descriptionContent="Enter your email below to login"
      titleButtonEmail="Login"
      titleButtonPolines="Masuk dengan email Polines"
    >
      <div className="flex flex-col">
        <FormLogin />
        <Link to="/register">
          <p className="text-primary">
            Dont have account? <a>Sign Up</a>
          </p>
        </Link>
      </div>
    </AuthLayout>
  );
}
