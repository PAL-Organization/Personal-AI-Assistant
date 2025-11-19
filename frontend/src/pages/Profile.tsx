export default function Profile() {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>

      <div className="space-y-3 text-slate-700">
        <p><strong>Name:</strong> Shivansh (placeholder)</p>
        <p><strong>Email:</strong> shivansh@pal.ai (temp)</p>
        <p><strong>Status:</strong> Logged in</p>
      </div>

      <p className="text-slate-500 mt-6 text-sm">
        (Real profile data will come after backend auth is integrated.)
      </p>
    </div>
  );
}