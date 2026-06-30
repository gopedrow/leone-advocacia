import { redirect } from "next/navigation";

// Conteúdo integrado à seção "Direitos do Paciente" na página inicial.
// Mantém links e favoritos antigos funcionando.
export default function DireitosDoPacienteRedirect() {
  redirect("/#pacientes");
}
