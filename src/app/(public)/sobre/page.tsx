import { redirect } from "next/navigation";

// Página "Sobre" descontinuada: o conteúdo sobre a advogada agora vive
// na seção "Sobre" da página inicial. Mantém links e favoritos antigos.
export default function SobreRedirect() {
  redirect("/#sobre");
}
