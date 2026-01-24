import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("/api/groups", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch groups");
        }

        const data = await res.json();
        setGroups(data);
      } catch (err) {
        alert("Unable to load groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-6">
      <div
        className="
          w-full
          max-w-sm
          sm:max-w-md
          md:max-w-lg
          lg:max-w-xl
          xl:max-w-2xl
          bg-white
          rounded-2xl
          shadow-lg
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4">
          <h1 className="text-center text-white text-xl font-semibold">
            Dashboard
          </h1>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">
            Your Groups
          </h2>

          {groups.length === 0 ? (
            <>
             <p className="text-center text-gray-500">
              No groups created yet
            </p>
             <button
            onClick={() => navigate("/create-group")}
            className="w-full mt-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg font-medium"
          >
            Create Group
          </button>
            </>
        
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <div
                  key={group._id}
                  onClick={() => navigate(`/groups/${group._id}`)}
                  className="
                    border
                    rounded-xl
                    p-4
                    flex
                    justify-between
                    items-center
                    cursor-pointer
                    hover:bg-gray-50
                  "
                >
                  <div>
                    <h3 className="font-medium text-lg">
                      {group.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {group.members?.length || group.membersCount} members
                    </p>
                  </div>

                  <span className="text-indigo-600 font-medium">
                    View →
                  </span>
                </div>
              ))}
            </div>
          )}
           <button
            onClick={() => navigate(-1)}
            className="w-full mt-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg font-medium"
          >
            Back
          </button>
        </div>
        
      </div>
    </div>
  );
}
