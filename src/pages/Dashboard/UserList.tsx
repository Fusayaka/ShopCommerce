import { useEffect, useState } from 'react';
import { userApi } from '@/api/userApi';
import type { User, Role } from '@/types';
import { ConfirmModal, Pagination, DropDownSelector, SubmitButton, Avatar } from '@/components';
import { useAuth } from '@/utils/auth';
import { CONFIG } from '@/config';
import { toast } from 'react-toastify';

type RoleFilter = 'all' | Role;
const ROLES: Role[] = ['admin', 'manager', 'customer'];
const LIMIT = CONFIG.DEFAULT_PAGE_SIZE;

const ROLE_STYLE: Record<Role, string> = {
    admin: 'bg-rose-50 text-rose-700',
    manager: 'bg-indigo-50 text-indigo-700',
    customer: 'bg-slate-100 text-slate-600',
};

// Privilege order — promoting to a higher rank asks for confirmation first.
const RANK: Record<Role, number> = { customer: 0, manager: 1, admin: 2 };

export default function UserList() {
    const { user: me } = useAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadToken, setReloadToken] = useState(0);

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
    const [page, setPage] = useState(1);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [draftRole, setDraftRole] = useState<Role>('customer');
    const [saving, setSaving] = useState(false);

    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [promoteUser, setPromoteUser] = useState<User | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await userApi.getAll();
                if (cancelled) return;
                setUsers(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Failed to load users:', err);
                if (!cancelled) setError('Failed to load users. Please try again.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [reloadToken]);

    const filtered = users.filter((u) => {
        const q = search.trim().toLowerCase();
        if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
        if (roleFilter !== 'all' && u.role !== roleFilter) return false;
        return true;
    });
    const lastPage = Math.max(1, Math.ceil(filtered.length / LIMIT));
    const safePage = Math.min(page, lastPage);
    const pageRows = filtered.slice((safePage - 1) * LIMIT, safePage * LIMIT);

    const startEdit = (u: User) => { setEditingId(u.id); setDraftRole(u.role); };
    const cancelEdit = () => { if (!saving) setEditingId(null); };

    const save = (id: number) => {
        const u = users.find((x) => x.id === id);
        if (u && RANK[draftRole] > RANK[u.role]) { setPromoteUser(u); return; } // escalation → confirm first
        void doSave(id);
    };

    const doSave = async (id: number) => {
        setSaving(true);
        try {
            await userApi.updateRole(id, draftRole);
            toast.success('Role updated');
            setEditingId(null);
            setPromoteUser(null);
            setReloadToken((t) => t + 1);
        } catch {
            // axiosClient already toasts the error
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteUser) return;
        setDeleting(true);
        try {
            await userApi.remove(deleteUser.id);
            toast.success('User deleted');
            setDeleteUser(null);
            setReloadToken((t) => t + 1);
        } catch (err) {
            console.error('Failed to delete user:', err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <section className="flex flex-1 flex-col gap-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 pl-4">Users</h1>
                    <p className="text-sm text-slate-500 text-left pl-5">
                        {loading ? 'Loading…' : `${filtered.length} user${filtered.length === 1 ? '' : 's'}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by name or email"
                        className="w-64 h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900"
                    />
                    <DropDownSelector<RoleFilter>
                        label="Role"
                        value={roleFilter}
                        onChange={(v) => { setRoleFilter(v); setPage(1); }}
                        options={[
                            { value: 'all', label: 'All' },
                            ...ROLES.map((r) => ({ value: r, label: r })),
                        ]}
                        className="capitalize"
                    />
                </div>
            </header>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {error ? (
                    <div className="p-8 text-center text-sm text-red-600">{error}</div>
                ) : loading ? (
                    <div className="p-8 text-center text-sm text-slate-400">Loading users…</div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-400">No users found.</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[820px] text-center text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                        <th className="pr-4 pl-8 py-3 font-semibold text-left">User</th>
                                        <th className="px-4 py-3 font-semibold">Contact</th>
                                        <th className="px-4 py-3 font-semibold">Address</th>
                                        <th className="px-4 py-3 font-semibold">Role</th>
                                        <th className="w-32 px-4 py-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageRows.map((u) => {
                                        const isSelf = me?.id === u.id;
                                        const isEditing = editingId === u.id;
                                        return (
                                            <tr key={u.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                                                <td className="pr-4 pl-8 py-3 text-left">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar
                                                            src={u.avatar}
                                                            name={u.name}
                                                            className="h-8 w-8 shrink-0 rounded-full"
                                                            fallbackClassName="bg-slate-200 text-xs text-slate-600"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium text-slate-800">
                                                                {u.name}{isSelf && <span className="ml-1 text-xs text-slate-400">(you)</span>}
                                                            </p>
                                                            <p className="truncate text-xs text-slate-400">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{u.contact || '—'}</td>
                                                <td className="px-4 py-3 max-w-48 truncate text-slate-600">{u.address || '—'}</td>
                                                <td className="px-4 py-3">
                                                    {isEditing ? (
                                                        <DropDownSelector<Role>
                                                            variant="compact"
                                                            value={draftRole}
                                                            onChange={setDraftRole}
                                                            options={ROLES.map((r) => ({ value: r, label: r }))}
                                                            className="capitalize"
                                                        />
                                                    ) : (
                                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${ROLE_STYLE[u.role]}`}>
                                                            {u.role}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="w-32 px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {isEditing ? (
                                                            <>
                                                                <SubmitButton
                                                                    type="button" loading={saving} loadingText="Saving…" onClick={() => save(u.id)}
                                                                    className="cursor-pointer rounded-md border border-transparent bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                                                >
                                                                    Save
                                                                </SubmitButton>
                                                                <button
                                                                    type="button" onClick={cancelEdit} disabled={saving}
                                                                    className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button" onClick={() => startEdit(u)} disabled={editingId != null || isSelf}
                                                                    title={isSelf ? "You can't change your own role" : 'Edit role'}
                                                                    className="cursor-pointer rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type="button" onClick={() => setDeleteUser(u)} disabled={editingId != null || isSelf}
                                                                    title={isSelf ? "You can't delete yourself" : 'Delete user'}
                                                                    className="cursor-pointer rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {lastPage > 1 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm">
                                <span className="text-slate-500">Page {safePage} of {lastPage}</span>
                                <Pagination page={safePage} totalPages={lastPage} onPageChange={setPage} />
                            </div>
                        )}
                    </>
                )}
            </div>

            <ConfirmModal
                isOpen={promoteUser != null}
                title="Promote user"
                content={<span>Give <strong>{promoteUser?.name}</strong> the <strong className="capitalize">{draftRole}</strong> role ? This grants more access.</span>}
                confirmText="Promote"
                cancelText="Cancel"
                variant="primary"
                isLoading={saving}
                onClose={() => { if (!saving) setPromoteUser(null); }}
                onConfirm={() => { if (promoteUser) void doSave(promoteUser.id); }}
            />

            <ConfirmModal
                isOpen={deleteUser != null}
                title="Delete user"
                content={
                    <span>
                        Permanently delete <strong>{deleteUser?.name}</strong> ({deleteUser?.email})? 
                        All associated orders, reviews, and cart data will also be removed. This cannot be undone.
                    </span>
                }
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                isLoading={deleting}
                onClose={() => { if (!deleting) setDeleteUser(null); }}
                onConfirm={confirmDelete}
            />
        </section>
    );
}
