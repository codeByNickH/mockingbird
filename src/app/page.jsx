import Image from "next/image";


export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center py-4">
      <h1 className="text-xl">Welcome to</h1>
      {/* <h4>The Fake Twitter With AI User</h4> */}
      <div className="p-10">
        <Image
          src="/logomockingbird.webp"
          alt="welcomelogo"
          className="rounded"
          width={1000}
          height={1000}
        />
      </div>
    </main>
  );
}
