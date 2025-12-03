import { MyInputForm } from "../../components/molecules/Form";
import { MyButton } from "../../components/atoms/Button";

export function SettingPage() {
  return (
    <div className="py-4 px-8">
      <div>
        <h1>Setting</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      {/* Profile */}
      <div className="flex  justify-between">
        <div>
          <p className="font-bold">Profile</p>
          <p className="font-light">Set your account detail</p>
        </div>

        <div className="flex  items-center gap-10   w-[65%]">
          <div className="flex flex-1 flex-col gap-4 ">
            <MyInputForm label="Name" />
            <MyInputForm label="Password" />
          </div>
          <div className="flex flex-col gap-2  items-center">
            <img
              src="../../../../public/img/ryujin.jpg"
              alt=""
              className="w-28 h-28 rounded-full object-cover"
            />
            <div className="flex gap-3 ">
              <MyButton titleButton="Edit Photo" size="sm" />
              <MyButton titleButton="i" size="sm" variant="circle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
