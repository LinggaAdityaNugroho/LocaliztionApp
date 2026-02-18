import { AuthLayout } from "../../layouts/AuthForm";
import { FormLogin } from "../../components/organism/FormLogin";
// import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <div className=" flex items-center justify-center max-w-screen h-screen overflow-hidden">
      <AuthLayout
        titleCard="Login to your account"
        descriptionContent="Enter your email below to login your account"
      >
        <div className="flex flex-col gap-2">
          <FormLogin />

          {/* <Link to="/register" className="text-primary hover:underline">
            Dont have an account? <span className="font-semibold">Sign Up</span>
          </Link> */}
        </div>
      </AuthLayout>
    </div>
  );
}
