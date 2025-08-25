"use client";

export default function LoginPage({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">

        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Create your account</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter your email address to creating in to your account
        </p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-3 text-center">
          By proceeding you accept our{" "}
          <a href="#" className="text-blue-600">Terms of Use</a> and{" "}
          <a href="#" className="text-blue-600">Privacy Policy</a>.
        </p>

        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button className="w-full flex items-center justify-center gap-2 border rounded-lg py-2 mb-2 hover:bg-gray-50">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>

      </div>
    </div>
  );
}
