import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuthSelectors } from "src/app/store/auth";
import { useUpdateUserSettingsMutation } from "src/app/store/userSettings";
import type { SupportedLng } from "src/shared/config/i18n/i18n";

import { LANGUAGES } from "./languages";
import {
  LanguageSelect,
  type LanguageItem,
  type LanguageLabelMode,
} from "./LanguageSelect";

export type LanguageSelectConnectedProps = {
  labelMode?: LanguageLabelMode;

  /**
   * Если задано — компонент будет controlled.
   * Если не задано — значение берётся из i18n.language.
   */
  value?: SupportedLng;

  /** Событие изменения (полезно, если родитель хочет реагировать) */
  onChanged?: (next: SupportedLng) => void;

  /**
   * Если true (по умолчанию), и пользователь залогинен — сохраняем выбранный язык
   * в users/{uid}/private/settings.uiLanguage.
   */
  persistForAuthedUser?: boolean;

  disabled?: boolean;
  className?: string;

  size?: "sm" | "md" | "lg";
  radius?: "md" | "lg" | "xl";
  width?: "full" | "auto";
  intent?: "default" | "error" | "success" | "warning";
  shadow?: "none" | "sm" | "md";

  placeholder?: React.ReactNode;
};

function normalizeToSupported<L extends string>(
  input: string,
  supported: ReadonlyArray<LanguageItem<L>>,
  fallback: L,
): L {
  const two = input.slice(0, 2).toLowerCase();
  const found = supported.find((x) => x.code === (two as L));
  return found ? found.code : fallback;
}

export function LanguageSelectConnected({
  labelMode = "short",
  value,
  onChanged,
  persistForAuthedUser = true,
  disabled,
  className,
  size,
  radius,
  width,
  intent,
  shadow,
  placeholder,
}: LanguageSelectConnectedProps) {
  const languages = LANGUAGES;
  const { i18n } = useTranslation();

  const { userId, isAuthenticated, isAuthReady } = useAuthSelectors();
  const canPersist = Boolean(
    persistForAuthedUser && isAuthReady && isAuthenticated && userId,
  );

  const [updateUserSettings] = useUpdateUserSettingsMutation();
  const [isPersisting, setIsPersisting] = useState(false);

  const fallback = (languages[0]?.code ?? "en") as SupportedLng;

  const current = useMemo(() => {
    if (value) return value;
    return normalizeToSupported(i18n.language ?? "en", languages, fallback);
  }, [value, i18n.language, languages, fallback]);

  async function handleChange(next: SupportedLng) {
    // UI язык меняем сразу
    await i18n.changeLanguage(next);

    // Persist — best effort
    if (canPersist && userId) {
      setIsPersisting(true);
      try {
        await updateUserSettings({
          uid: userId,
          patch: { uiLanguage: next },
        }).unwrap();
      } catch {
        // оставляем локальную смену языка даже если сохранение не удалось
      } finally {
        setIsPersisting(false);
      }
    }

    onChanged?.(next);
  }

  const isDisabled = disabled || isPersisting;

  return (
    <LanguageSelect
      labelMode={labelMode}
      value={current}
      onChange={handleChange}
      disabled={isDisabled}
      className={className}
      size={size}
      radius={radius}
      width={width}
      intent={intent}
      shadow={shadow}
      placeholder={placeholder}
    />
  );
}
