import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({auth}) {
    return (
        <AuthenticatedLayout auth={auth} page="Tourist Dashboard">
            <Head title="Dashboard" />
            You're logged in!
        </AuthenticatedLayout>
    );
}
