import { AuthLayout } from "../../layouts/AuthForm";
import { FormLogin } from "../../components/organism/FormLogin";
import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <AuthLayout
      titleCard="Login to your account"
      descriptionContent="Enter your email below to login your account"
    >
      <div className="flex flex-col gap-2">
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
