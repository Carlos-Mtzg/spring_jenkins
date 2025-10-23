import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "@services/ApiUser";
import {
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { toast, Toaster } from "sonner";
import CreateUserModal from "@components/CreateUserModal";
import UpdateUserModal from "@components/UpdateUserModal";
import Swal from "sweetalert2";

function Layout() {
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : data.data);
    } catch (e) {
      toast.error("No se pudieron cargar las requisiciones");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: `¿Desea eliminar al usuario ${user.fullName}?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#444646",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const id = user.uuid ?? user.id;
      toast.promise(deleteUser(id), {
        loading: "Eliminando usuario...",
        success: () => {
          fetchUsers();
          return `El usuario ${user.fullName} se eliminó con éxito`;
        },
        error: () => "Ocurrió un error al eliminar el usuario",
      });
    }
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  return (
    <>
      <Toaster position="top-center" expand={false} richColors closeButton />
      <div className="p-10 md:p-48 bg-gray-100/50 h-screen">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between mb-6">
          <h3 className="text-2xl font-bold uppercase text-blue-900">
            Gestión de Usuarios
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              aria-label="Agregar usuario"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm hover:shadow-md transition duration-300 cursor-pointer"
            >
              <PlusIcon className="h-5 w-5 text-blue-900" />
              Agregar
            </button>

            <button
              onClick={fetchUsers}
              aria-label="Recargar tabla"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm hover:shadow-md transition duration-300 cursor-pointer"
            >
              <ArrowPathIcon className="h-5 w-5 text-blue-900" />
              <span>Recargar</span>
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay registros
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Creado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.uuid ?? u.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {u.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEdit(u)}
                            className="flex items-center p-2 bg-blue-50 border border-gray-200 rounded-lg text-sm transition duration-300 cursor-pointer hover:bg-blue-100"
                            aria-label={`Editar ${u.fullName}`}
                          >
                            <PencilSquareIcon className="h-5 w-5 text-blue-900" />
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="inline-flex items-center p-2 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 hover:bg-red-100 transition cursor-pointer duration-300"
                            aria-label={`Eliminar ${u.fullName}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CreateUserModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchUsers();
        }}
      />

      <UpdateUserModal
        open={showUpdateModal}
        user={selectedUser}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          setShowUpdateModal(false);
          setSelectedUser(null);
          fetchUsers();
        }}
      />
    </>
  );
}

export default Layout;
