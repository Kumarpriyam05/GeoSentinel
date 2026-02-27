import { Link } from "react-router-dom";

const PublicFooter = () => (
  <footer className="border-t border-base-200/50 bg-base-50/65 px-5 py-8 backdrop-blur-xl lg:px-8">
    <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-3">
      <div>
        <p className="text-lg font-bold text-base-800">
          Geo<span className="text-accent-500">Sentinel</span>
        </p>
        <p className="mt-2 text-sm text-base-500">Enterprise-grade real-time geospatial tracking platform.</p>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-base-700">Company</p>
        <div className="space-y-1 text-sm text-base-500">
          <p>
            <Link className="hover:text-accent-600" to="/about">
              About
            </Link>
          </p>
          <p>
            <Link className="hover:text-accent-600" to="/contact">
              Contact
            </Link>
          </p>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-base-700">Platform</p>
        <div className="space-y-1 text-sm text-base-500">
          <p>JWT Authentication</p>
          <p>Socket.IO Realtime Streams</p>
          <p>Leaflet Geospatial Dashboard</p>
        </div>
      </div>
    </div>
  </footer>
);

export default PublicFooter;

