// components/MatchCard.js
export default function MatchCard({ user, onInvite }) {
    return (
      <div className="border rounded p-4 flex justify-between items-center mb-3">
        <div>
          <h2 className="font-semibold">{user.name}</h2>
          <p className="text-sm">
            {user.degree} • {user.skills.join(", ")}
          </p>
        </div>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
          onClick={onInvite}
        >
          Invite
        </button>
      </div>
    );
  }
  