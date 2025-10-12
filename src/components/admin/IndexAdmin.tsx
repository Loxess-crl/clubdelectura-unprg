import AdminLayout from "@/components/admin/AdminLayout";
import React from "react";

const IndexAdmin = ({ currentPath }: { currentPath: string }) => {
  return (
    <AdminLayout currentPath={currentPath}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
        <p>Bienvenido al panel de administración del Club de Lectura.</p>
        {/* Aquí puedes agregar más contenido o componentes específicos para el panel de administración */}
      </div>
    </AdminLayout>
  );
};

export default IndexAdmin;
