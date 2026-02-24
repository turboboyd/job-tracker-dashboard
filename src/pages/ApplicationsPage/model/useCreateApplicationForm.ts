import { useCallback, useMemo, useState } from "react";

import type { CreateFormState } from "./types";
import { EMPTY_CREATE_FORM } from "./types";

function toOptionalTrimmed(value: string): string | undefined {
  const v = value.trim();
  return v.length ? v : undefined;
}

export function useCreateApplicationForm() {
  const [form, setForm] = useState<CreateFormState>(EMPTY_CREATE_FORM);
  const [isCreating, setIsCreating] = useState(false);

  const updateForm = useCallback(
    <K extends keyof CreateFormState>(key: K, value: CreateFormState[K]) => {
      setForm((prev: CreateFormState) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setForm(EMPTY_CREATE_FORM);
  }, []);

  const canSubmit = useMemo(() => {
    return Boolean(form.companyName.trim() && form.roleTitle.trim());
  }, [form.companyName, form.roleTitle]);

  const toPayload = useCallback(() => {
    return {
      companyName: form.companyName.trim(),
      roleTitle: form.roleTitle.trim(),
      vacancyUrl: toOptionalTrimmed(form.vacancyUrl),
      source: toOptionalTrimmed(form.source),
      rawDescription: toOptionalTrimmed(form.rawDescription),
    };
  }, [form]);

  return {
    form,
    updateForm,
    resetForm,
    canSubmit,
    isCreating,
    setIsCreating,
    toPayload,
  };
}
