import React from "react";
import { useParams, Link } from "react-router-dom";
import CityDetail from "../components/CityDetail";

const CityPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  if (!name) return <div>Invalid city</div>;

  const cityName = decodeURIComponent(name); // handles spaces like "New York"

  return (
    <div>
      <Link to="/" className="text-blue-500 underline mb-4 block">
        ← Back to Dashboard
      </Link>
      <CityDetail cityName={cityName} />
    </div>
  );
};

export default CityPage;
