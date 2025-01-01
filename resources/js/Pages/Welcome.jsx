import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />

            <div className="h-24 px-4 bg-orange-100 w-full flex items-center justify-between gap-4">
                <div>
                    <img src="/images/dmo.png" className="w-16" alt="" />
                </div>
                <div>
                    {auth.user ? (
                        <Link href={route("dashboard")}>Dashboard</Link>
                    ) : (
                        <>
                            <Link href={route("login")}>Log in</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
