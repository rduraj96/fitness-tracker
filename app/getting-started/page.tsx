import React from "react";
import UserDetailsForm from "./UserDetailsForm";
type Props = {};

const page = (props: Props) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="shadow-md px-8 py-8 pt-12 space-y-12 bg-foreground rounded-xl">
        <h1 className="font-bold text-2xl text-center text-black">
          Getting Started
        </h1>
        <UserDetailsForm />
      </div>
    </div>
  );
};

export default page;