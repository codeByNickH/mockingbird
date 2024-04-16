import Link from "next/link"

export function HeaderComponent() {
  return (
    <header>
      <div className="flex min-w-screen items-center justify-between h-14 px-4 sm:px-6 border-b">
        <nav className="flex items-center space-x-4">
          <Link href="/">
            <FlagIcon className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <Link className="font-medium hover:underline underline-offset-4" href="/feed">
            Feed
          </Link>
          <Link className="font-medium hover:underline underline-offset-4" href="/register">
            Register
          </Link>
        </nav>
      </div>
    </header>
  )
}

function FlagIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  )
}