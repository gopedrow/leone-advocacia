import { redirect } from "next/navigation";

// Página integrada à seção "Direitos do Paciente" dentro de /direito-da-saude.
// Mantém links e favoritos antigos funcionando.
export default function DireitosDoPacienteRedirect() {
  redirect("/direito-da-saude#pacientes");
}
