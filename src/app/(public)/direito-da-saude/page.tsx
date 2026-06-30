import { redirect } from "next/navigation";

// Página "Saúde" descontinuada: as demandas e os direitos do paciente
// foram integrados à página inicial. Mantém links e favoritos antigos.
export default function DireitoDaSaudeRedirect() {
  redirect("/");
}
