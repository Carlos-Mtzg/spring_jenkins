import { useEffect, useState } from "react";
import {
  getAllUsers,
  registerUser,
  updateUser,
  deleteUser,
} from "@services/ApiUser";
import {
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast, Toaster } from "sonner";
import Swal from "sweetalert2";

function Layout() {
  const [users, setUsers] = useState([]);

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

  return (
    <>
      <Toaster position="top-center" expand={false} richColors closeButton />
      <div className="p-14">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl uppercase text-blue-900 font-bold">
            Gestión de Usuarios
          </h1>
          <div className="flex gap-3">
            <button
              onClick={fetchUsers}
              aria-label="Recargar tabla"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm hover:shadow-md transition"
            >
              <ArrowPathIcon className="h-5 w-5 text-blue-600" />
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition cursor-pointer"
                            aria-label={`Editar ${u.fullName}`}
                          >
                            <PencilSquareIcon className="h-4 w-4 mr-2" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 hover:bg-red-100 transition cursor-pointer"
                            aria-label={`Eliminar ${u.fullName}`}
                          >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Eliminar
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
    </>
  );
}

export default Layout;
