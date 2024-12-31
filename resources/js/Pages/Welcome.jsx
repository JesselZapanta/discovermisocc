import { Head, Link } from "@inertiajs/react";
import { Button } from "@nextui-org/button";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />

            <div className="h-16 px-4 flex items-center justify-end">
                <div className="flex gap-4">
                    {auth.user ? (
                        <Link href={route("dashboard")}>Dashboard</Link>
                    ) : (
                        <>
                            <Button>
                                <Link href={route("login")}>Log in</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
