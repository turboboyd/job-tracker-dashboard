import React from "react";

import type { DateFormat } from "src/app/store/userSettings";
import { Button } from "src/shared/ui/Button/Button";
import { Card } from "src/shared/ui/Card/Card";
import { FormField } from "src/shared/ui/Form/FormField/FormField";
import { Input } from "src/shared/ui/Form/Input/Input";
import { LanguageSelectConnected } from "src/shared/ui/molecules/LanguageSelect/LanguageSelectConnected";
import { SectionHeader } from "src/shared/ui/PageHeaders/PageHeaders";

import { PreferencesSection, type TimeZoneOption } from "./PreferencesSection";

type ProfileProps = {
  // Profile
  email: string;
  firstName: string;
  lastName: string;
  canEditName: boolean;
  isNameSaving: boolean;
  nameError: string | null;
  saveNameDisabled: boolean;
  resetNameDisabled: boolean;
  onFirstNameChange: (next: string) => void;
  onLastNameChange: (next: string) => void;
  onSaveName: () => void;
  onResetName: () => void;

  // Preferences
  timeZone: string;
  timeZoneOptions: ReadonlyArray<TimeZoneOption>;
  dateFormat: DateFormat;
  disabledPreferences: boolean;
  isSavingPreferences: boolean;
  hasPreferencesChanges: boolean;
  preferencesErrorMessage: string | null;
  onTimeZoneChange: (next: string) => void;
  onDateFormatChange: (next: DateFormat) => void;
  onSavePreferences: () => void;
  onResetPreferences: () => void;
};

function SectionShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function ProfilePreferencesCard(props: ProfileProps) {
  const {
    email,
    firstName,
    lastName,
    canEditName,
    isNameSaving,
    nameError,
    saveNameDisabled,
    resetNameDisabled,
    onFirstNameChange,
    onLastNameChange,
    onSaveName,
    onResetName,

    timeZone,
    timeZoneOptions,
    dateFormat,
    disabledPreferences,
    isSavingPreferences,
    hasPreferencesChanges,
    preferencesErrorMessage,
    onTimeZoneChange,
    onDateFormatChange,
    onSavePreferences,
    onResetPreferences,
  } = props;

  return (
    <Card padding="md" shadow="md" className="space-y-6">
      <SectionHeader
        title="Profile & Preferences"
        subtitle="Manage your account details and app settings"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionShell title="Profile">
          <div className="grid grid-cols-1 gap-4">
            <FormField label="First name" required>
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  value={firstName}
                  onChange={(e) => onFirstNameChange(e.target.value)}
                  preset="default"
                  intent="default"
                  disabled={!canEditName || isNameSaving}
                />
              )}
            </FormField>

            <FormField label="Last name">
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  value={lastName}
                  onChange={(e) => onLastNameChange(e.target.value)}
                  preset="default"
                  intent="default"
                  disabled={!canEditName || isNameSaving}
                />
              )}
            </FormField>

            <FormField label="Email" required>
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  value={email}
                  onChange={() => {}}
                  preset="default"
                  intent="default"
                  disabled
                />
              )}
            </FormField>

            <FormField
              label="App language"
              hint="Stored locally and synced to Firestore when signed in"
            >
              {() => (
                <LanguageSelectConnected
                  labelMode="full"
                  persistForAuthedUser
                />
              )}
            </FormField>

            <div className="pt-2 flex flex-wrap gap-2">
              <Button
                variant="outline"
                shadow="sm"
                disabled={resetNameDisabled}
                onClick={onResetName}
              >
                Reset
              </Button>
              <Button
                variant="default"
                shadow="sm"
                disabled={saveNameDisabled}
                onClick={onSaveName}
              >
                {isNameSaving ? "Saving..." : "Save"}
              </Button>
            </div>

            {nameError ? (
              <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-foreground">
                {nameError}
              </div>
            ) : null}
          </div>
        </SectionShell>

        <SectionShell title="Preferences" subtitle="Firestore">
          <PreferencesSection
            timeZone={timeZone}
            timeZoneOptions={timeZoneOptions}
            dateFormat={dateFormat}
            disabled={disabledPreferences}
            isSaving={isSavingPreferences}
            hasChanges={hasPreferencesChanges}
            errorMessage={preferencesErrorMessage}
            onTimeZoneChange={onTimeZoneChange}
            onDateFormatChange={onDateFormatChange}
            onReset={onResetPreferences}
            onSave={onSavePreferences}
          />
        </SectionShell>
      </div>
    </Card>
  );
}
