"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ClientFormState } from "@/app/admin/clientes/actions";

type Action = (prev: ClientFormState, formData: FormData) => Promise<ClientFormState>;

export type ClientInitial = {
  id?: string;
  name?: string;
  email?: string;
  cpf?: string | null;
  phone?: string | null;
  active?: boolean;
  personType?: "PF" | "PJ";
  rg?: string | null;
  maritalStatus?: string | null;
  profession?: string | null;
  nationality?: string | null;
  companyName?: string | null;
  cnpj?: string | null;
  legalRep?: string | null;
  cep?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  district?: string | null;
  city?: string | null;
  state?: string | null;
  demandType?: string | null;
  feeModality?: string | null;
  feeValue?: string | null;
  contractDate?: string | null;
  paymentMethod?: string | null;
  contractSigned?: boolean;
  contractFileName?: string | null;
  observation?: string | null;
  qualification?: string | null;
};

const initialState: ClientFormState = { ok: false };
const field =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-navy-800 focus-visible:border-petrol-400";
const label = "mb-1.5 block text-sm font-medium text-navy-700";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-line bg-white p-6">
      <legend className="px-2 font-serif text-lg font-semibold text-navy-800">{title}</legend>
      <div className="mt-2">{children}</div>
    </fieldset>
  );
}

export function ClientForm({
  action,
  mode,
  initial,
}: {
  action: Action;
  mode: "create" | "edit";
  initial?: ClientInitial;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [personType, setPersonType] = useState<"PF" | "PJ">(initial?.personType ?? "PF");
  const [qualification, setQualification] = useState(initial?.qualification ?? "");

  function gerarQualificacao() {
    const fd = new FormData(formRef.current!);
    const g = (k: string) => String(fd.get(k) || "").trim();
    const parts: string[] = [];

    const endereco = () => {
      const ruaNum = [g("street"), g("number") && `nº ${g("number")}`].filter(Boolean).join(", ");
      const comp = g("complement");
      const bairro = g("district") && `bairro ${g("district")}`;
      const cidUf = [g("city"), g("state")].filter(Boolean).join("/");
      const cep = g("cep") && `CEP ${g("cep")}`;
      const e = [ruaNum, comp, bairro, cidUf, cep].filter(Boolean).join(", ");
      return e ? `residente e domiciliado(a) na ${e}` : "";
    };

    if (personType === "PJ") {
      const razao = g("companyName") || g("name");
      if (razao) parts.push(razao);
      parts.push("pessoa jurídica de direito privado");
      if (g("cnpj")) parts.push(`inscrita no CNPJ sob o nº ${g("cnpj")}`);
      const end = endereco().replace("residente e domiciliado(a) na", "com sede na");
      if (end) parts.push(end);
      if (g("legalRep")) parts.push(`neste ato representada por ${g("legalRep")}`);
    } else {
      if (g("name")) parts.push(g("name"));
      if (g("nationality")) parts.push(g("nationality"));
      if (g("maritalStatus")) parts.push(g("maritalStatus").toLowerCase());
      if (g("profession")) parts.push(g("profession").toLowerCase());
      if (g("cpf")) parts.push(`inscrito(a) no CPF sob o nº ${g("cpf")}`);
      if (g("rg")) parts.push(`portador(a) do RG nº ${g("rg")}`);
      const end = endereco();
      if (end) parts.push(end);
      if (g("email")) parts.push(`e-mail ${g("email")}`);
    }

    setQualification(parts.join(", ").replace(/\s+,/g, ",").trim() + ".");
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6" noValidate>
      {mode === "edit" && <input type="hidden" name="id" defaultValue={initial?.id} />}

      {state.message && !state.ok && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      {/* Tipo de cliente */}
      <Section title="Tipo de cliente">
        <div className="flex gap-6">
          {(["PF", "PJ"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-navy-700">
              <input
                type="radio"
                name="personType"
                value={t}
                checked={personType === t}
                onChange={() => setPersonType(t)}
              />
              {t === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
            </label>
          ))}
        </div>
      </Section>

      {/* Dados cadastrais */}
      <Section title="Dados cadastrais">
        <div className="grid gap-5 sm:grid-cols-2">
          {personType === "PF" ? (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="name" className={label}>Nome completo *</label>
                <input id="name" name="name" required defaultValue={initial?.name} className={field} />
                <FieldError errors={state.errors?.name} />
              </div>
              <div>
                <label htmlFor="cpf" className={label}>CPF</label>
                <input id="cpf" name="cpf" defaultValue={initial?.cpf ?? ""} className={field} inputMode="numeric" />
              </div>
              <div>
                <label htmlFor="rg" className={label}>RG</label>
                <input id="rg" name="rg" defaultValue={initial?.rg ?? ""} className={field} />
              </div>
              <div>
                <label htmlFor="maritalStatus" className={label}>Estado civil</label>
                <select id="maritalStatus" name="maritalStatus" defaultValue={initial?.maritalStatus ?? ""} className={field}>
                  <option value="">—</option>
                  <option>Solteiro(a)</option>
                  <option>Casado(a)</option>
                  <option>União estável</option>
                  <option>Divorciado(a)</option>
                  <option>Viúvo(a)</option>
                  <option>Separado(a)</option>
                </select>
              </div>
              <div>
                <label htmlFor="profession" className={label}>Profissão</label>
                <input id="profession" name="profession" defaultValue={initial?.profession ?? ""} className={field} />
              </div>
              <div>
                <label htmlFor="nationality" className={label}>Nacionalidade</label>
                <input id="nationality" name="nationality" defaultValue={initial?.nationality ?? "brasileiro(a)"} className={field} />
              </div>
            </>
          ) : (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="name" className={label}>Razão social *</label>
                <input id="name" name="name" required defaultValue={initial?.name} className={field} />
                <FieldError errors={state.errors?.name} />
              </div>
              <div>
                <label htmlFor="cnpj" className={label}>CNPJ</label>
                <input id="cnpj" name="cnpj" defaultValue={initial?.cnpj ?? ""} className={field} inputMode="numeric" />
              </div>
              <div>
                <label htmlFor="legalRep" className={label}>Representante legal</label>
                <input id="legalRep" name="legalRep" defaultValue={initial?.legalRep ?? ""} className={field} />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className={label}>E-mail (login) *</label>
            <input id="email" name="email" type="email" required defaultValue={initial?.email} className={field} autoComplete="off" />
            <FieldError errors={state.errors?.email} />
          </div>
          <div>
            <label htmlFor="phone" className={label}>Telefone</label>
            <input id="phone" name="phone" defaultValue={initial?.phone ?? ""} className={field} inputMode="tel" />
          </div>
        </div>
      </Section>

      {/* Endereço */}
      <Section title="Endereço">
        <div className="grid gap-5 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label htmlFor="cep" className={label}>CEP</label>
            <input id="cep" name="cep" defaultValue={initial?.cep ?? ""} className={field} inputMode="numeric" />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="street" className={label}>Rua</label>
            <input id="street" name="street" defaultValue={initial?.street ?? ""} className={field} />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="number" className={label}>Número</label>
            <input id="number" name="number" defaultValue={initial?.number ?? ""} className={field} />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="complement" className={label}>Complemento</label>
            <input id="complement" name="complement" defaultValue={initial?.complement ?? ""} className={field} />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="district" className={label}>Bairro</label>
            <input id="district" name="district" defaultValue={initial?.district ?? ""} className={field} />
          </div>
          <div className="sm:col-span-4">
            <label htmlFor="city" className={label}>Cidade</label>
            <input id="city" name="city" defaultValue={initial?.city ?? ""} className={field} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="state" className={label}>Estado (UF)</label>
            <input id="state" name="state" maxLength={2} defaultValue={initial?.state ?? ""} className={field} />
          </div>
        </div>
      </Section>

      {/* Demanda */}
      <Section title="Tipo de demanda (Direito da Saúde)">
        <select name="demandType" defaultValue={initial?.demandType ?? ""} className={field}>
          <option value="">Selecione…</option>
          <option>Plano de Saúde</option>
          <option>SUS</option>
          <option>Pessoas com Deficiência (PCD) e TEA</option>
          <option>Erro Médico e Responsabilidade Civil</option>
          <option>Medicamentos</option>
          <option>Tratamentos Especiais</option>
        </select>
      </Section>

      {/* Contrato e honorários */}
      <Section title="Contrato e honorários">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="feeModality" className={label}>Modalidade</label>
            <select id="feeModality" name="feeModality" defaultValue={initial?.feeModality ?? ""} className={field}>
              <option value="">Selecione…</option>
              <option value="AVISTA">À vista</option>
              <option value="PARCELADO">Parcelado</option>
              <option value="EXITO">Êxito</option>
              <option value="ENTRADA_PARCELAMENTO">Entrada + Parcelamento</option>
              <option value="MENSALIDADE">Mensalidade</option>
              <option value="HIBRIDO">Híbrido</option>
            </select>
          </div>
          <div>
            <label htmlFor="feeValue" className={label}>Valor dos honorários</label>
            <input id="feeValue" name="feeValue" defaultValue={initial?.feeValue ?? ""} className={field} placeholder="Ex.: R$ 5.000,00" />
          </div>
          <div>
            <label htmlFor="contractDate" className={label}>Data da contratação</label>
            <input id="contractDate" name="contractDate" type="date" defaultValue={initial?.contractDate ?? ""} className={field} />
          </div>
          <div>
            <label htmlFor="paymentMethod" className={label}>Forma de pagamento</label>
            <select id="paymentMethod" name="paymentMethod" defaultValue={initial?.paymentMethod ?? ""} className={field}>
              <option value="">Selecione…</option>
              <option value="PIX">PIX</option>
              <option value="CARTAO">Cartão</option>
              <option value="BOLETO">Boleto</option>
              <option value="TRANSFERENCIA">Transferência</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </div>
          <div>
            <label htmlFor="contractSigned" className={label}>Contrato assinado?</label>
            <select id="contractSigned" name="contractSigned" defaultValue={initial?.contractSigned ? "true" : "false"} className={field}>
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
          <div>
            <label htmlFor="contractFile" className={label}>Upload do contrato</label>
            <input id="contractFile" name="contractFile" type="file" accept=".pdf,.doc,.docx,image/*" className={field} />
            {initial?.contractFileName && (
              <p className="mt-1 text-xs text-muted">Atual: {initial.contractFileName}</p>
            )}
          </div>
        </div>
      </Section>

      {/* Observação + Qualificação */}
      <Section title="Observação e qualificação processual">
        <label htmlFor="observation" className={label}>Observação</label>
        <textarea id="observation" name="observation" rows={3} defaultValue={initial?.observation ?? ""} className={field} />

        <div className="mt-5 flex items-center justify-between gap-3">
          <label htmlFor="qualification" className={label}>Qualificação processual</label>
          <Button type="button" variant="outline" size="sm" onClick={gerarQualificacao}>
            Gerar Qualificação Processual
          </Button>
        </div>
        <textarea
          id="qualification"
          name="qualification"
          rows={4}
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          placeholder="Clique em “Gerar” para montar automaticamente a partir dos dados acima — você pode editar o texto depois."
          className={field}
        />
      </Section>

      {/* Acesso / senha */}
      <Section title="Acesso à Área do Cliente">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className={label}>
              {mode === "create" ? "Senha inicial *" : "Nova senha"}
            </label>
            <input
              id="password"
              name="password"
              type="text"
              required={mode === "create"}
              placeholder={mode === "edit" ? "Deixe em branco para manter" : ""}
              className={field}
              autoComplete="off"
            />
            <FieldError errors={state.errors?.password} />
          </div>
          {mode === "edit" && (
            <label className="flex items-center gap-2.5 self-end pb-2.5 text-sm text-navy-700">
              <input type="checkbox" name="active" defaultChecked={initial?.active ?? true} className="h-4 w-4 rounded border-line" />
              Acesso ativo
            </label>
          )}
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Salvando..." : mode === "create" ? "Cadastrar cliente" : "Salvar alterações"}
        </Button>
        <a href="/admin/clientes" className="text-sm font-medium text-muted hover:text-navy-700">
          Cancelar
        </a>
      </div>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-red-600">{errors[0]}</p>;
}
