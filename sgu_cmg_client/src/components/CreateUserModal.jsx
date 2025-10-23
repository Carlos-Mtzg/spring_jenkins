import { useState, useEffect } from "react";
import {
  XMarkIcon,
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";

import { registerUser } from "@services/ApiUser";

const schema = yup
  .object({
    fullName: yup
      .string()
      .required("El campo de nombre es obligatorio")
      .test(
        "no-angle-brackets",
        "No se permiten los caracteres < o >",
        (value) => !/[<>]/.test(value || "")
      ),
    email: yup
      .string()
      .required("El campo de correo es obligatorio")
      .email("Ingresa un correo electrónico válido")
      .test(
        "no-angle-brackets",
        "No se permiten los caracteres < o >",
        (value) => !/[<>]/.test(value || "")
      ),
    phone: yup
      .string()
      .required("El campo de teléfono es obligatorio")
      .test(
        "no-angle-brackets",
        "No se permiten los caracteres < o >",
        (value) => !/[<>]/.test(value || "")
      ),
  })
  .required();

const CreateUserModal = ({
  open = false,
  onClose = () => {},
  onSuccess = () => {},
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show, setShow] = useState(open);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  if (!show) return null;

  const handleClose = () => {
    setAnimateIn(false);
    reset();
    setTimeout(() => onClose(), 220);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await toast.promise(registerUser(data), {
        loading: "Registrando usuario...",
        success: (response) => {
          // Llama al callback del padre para que refresque la tabla
          onSuccess && onSuccess(response);
          return `Registro de ${
            response?.user?.fullName || "usuario"
          } correcto`;
        },
        error: (err) => {
          if (err?.response?.status === 409) {
            return "Ya hay un usuario registrado con esta información";
          }
          return "Ocurrió un error inesperado";
        },
      });
      reset();
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-user-title"
    >
      <div
        aria-hidden
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative w-full max-w-md mx-auto transform transition-all duration-200 ${
          animateIn
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        <div className="bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900 text-white rounded-md flex items-center justify-center">
                <UserPlusIcon className="w-5 h-5" />
              </div>
              <div>
                <h2
                  id="create-user-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Registrar usuario
                </h2>
                <p className="text-xs text-gray-500">
                  Agregar un nuevo contacto al sistema
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              aria-label="Cerrar modal"
              className="text-gray-400 hover:text-gray-600 transition p-1 rounded-md cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nombre
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <UserPlusIcon className="w-4 h-4" />
                  </span>
                  <input
                    {...register("fullName")}
                    aria-invalid={errors.fullName ? "true" : "false"}
                    className={`w-full bg-gray-50 pl-10 pr-3 py-2 rounded-md placeholder-slate-400/60 transition focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? "border-red-500 ring-1 ring-red-500/30 focus:ring-red-500"
                        : "border border-gray-200 focus:ring-blue-200 focus:border-blue-300"
                    }`}
                    placeholder="Nombre completo"
                    autoFocus
                  />
                </div>
                {errors.fullName && (
                  <span className="text-xs text-red-500 mt-2 flex items-center gap-2">
                    {errors.fullName.message}
                    <ExclamationCircleIcon className="text-red-500 size-4" />
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <EnvelopeIcon className="w-4 h-4" />
                  </span>
                  <input
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                    className={`w-full bg-gray-50 pl-10 pr-3 py-2 rounded-md placeholder-slate-400/60 transition focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-500 ring-1 ring-red-500/30 focus:ring-red-500"
                        : "border border-gray-200 focus:ring-blue-200 focus:border-blue-300"
                    }`}
                    placeholder="correo@ejemplo.com"
                    inputMode="email"
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-red-500 mt-2 flex items-center gap-2">
                    {errors.email.message}
                    <ExclamationCircleIcon className="text-red-500 size-4" />
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Teléfono
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <PhoneIcon className="w-4 h-4" />
                  </span>
                  <input
                    {...register("phone")}
                    aria-invalid={errors.phone ? "true" : "false"}
                    className={`w-full bg-gray-50 pl-10 pr-3 py-2 rounded-md placeholder-slate-400/60 transition focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? "border-red-500 ring-1 ring-red-500/30 focus:ring-red-500"
                        : "border border-gray-200 focus:ring-blue-200 focus:border-blue-300"
                    }`}
                    placeholder="Teléfono"
                    inputMode="tel"
                  />
                </div>
                {errors.phone && (
                  <span className="text-xs text-red-500 mt-2 flex items-center gap-2">
                    {errors.phone.message}
                    <ExclamationCircleIcon className="text-red-500 size-4" />
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-md bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-900 text-white text-sm hover:opacity-95 transition cursor-pointer"
                  disabled={isSubmitting}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
