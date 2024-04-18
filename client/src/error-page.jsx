import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div id="error-page" className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="">That page doesn't exist</p>
    </div>
  );
}

