import AppLayout from '@/Components/Layout/AppLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout title="Mi perfil">
            <Head title="Mi perfil" />

            <div className="max-w-2xl space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <UpdatePasswordForm />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <DeleteUserForm />
                </div>
            </div>
        </AppLayout>
    );
}
