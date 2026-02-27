import { Link } from "react-router-dom";
import Button from "@/components/common/Button";

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center p-6">
    <div className="card-base max-w-lg text-center">
      <p className="text-xs uppercase tracking-[0.24em] text-base-500">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-base-800">Page Not Found</h1>
      <p className="mt-3 text-sm text-base-500">The page you requested does not exist.</p>
      <Link className="mt-5 inline-block" to="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  </div>
);

export default NotFoundPage;

