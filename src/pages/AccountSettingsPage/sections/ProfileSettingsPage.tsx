import { updateProfile } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";


import { useAuthSelectors } from "src/app/store/auth";
import {
  DEFAULT_USER_SETTINGS,
  type DateFormat,
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} from "src/app/store/userSettings";
import { selectRtkqErrorMessage } from "src/shared/api/selectRtkqErrorMessage";
import { auth } from "src/shared/config/firebase/firebase";
import { getDefaultTimeZone, getTimeZoneOptions } from "src/shared/lib/date";

import { AccountSettingsLayout } from "../ui/AccountSettingsLayout";
import { ProfilePreferencesCard } from "../ui/ProfilePreferencesCard";

function splitDisplayName(name: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  const clean = (name ?? "").trim().replace(/\s+/g, " ");
  if (!clean) return { firstName: "", lastName: "" };

  const parts = clean.split(" ");
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ").trim();
  return { firstName, lastName };
}

function joinDisplayName(firstName: string, lastName: string): string {
  const fn = firstName.trim();
  const ln = lastName.trim();
  return fn + (ln ? ` ${ln}` : "");
}

export default function ProfileSettingsPage() {
  const { userId, email, displayName, isAuthReady, isAuthenticated } =
    useAuthSelectors();

  const skip = !isAuthReady || !isAuthenticated || !userId;

  const {
    data: settings,
    isLoading,
    isFetching,
    error: getError,
  } = useGetUserSettingsQuery({ uid: userId ?? "" }, { skip });

  const [updateUserSettings, updateState] = useUpdateUserSettingsMutation();

  const isSavingSettings = updateState.isLoading;
  const isPageLoading = isLoading || isFetching;

  const settingsErrorMessage =
    selectRtkqErrorMessage(getError) ||
    selectRtkqErrorMessage(updateState.error);

  const tzOptions = useMemo(() => getTimeZoneOptions(), []);
  const [formTimeZone, setFormTimeZone] = useState<string>(
    getDefaultTimeZone(DEFAULT_USER_SETTINGS.timeZone),
  );

  const [formDateFormat, setFormDateFormat] =
    useState<DateFormat>("DD.MM.YYYY");

  const initialName = useMemo(
    () => splitDisplayName(displayName),
    [displayName],
  );
  const [firstName, setFirstName] = useState<string>(initialName.firstName);
  const [lastName, setLastName] = useState<string>(initialName.lastName);
  const [isNameSaving, setIsNameSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (!settings) return;
    setFormTimeZone(
      settings.timeZone || getDefaultTimeZone(DEFAULT_USER_SETTINGS.timeZone),
    );
    setFormDateFormat(settings.dateFormat ?? DEFAULT_USER_SETTINGS.dateFormat);
  }, [settings]);

  useEffect(() => {
    const s = splitDisplayName(displayName);
    setFirstName(s.firstName);
    setLastName(s.lastName);
  }, [displayName]);

  const initialTimeZone =
    settings?.timeZone ?? getDefaultTimeZone(DEFAULT_USER_SETTINGS.timeZone);
  const initialDateFormat =
    settings?.dateFormat ?? DEFAULT_USER_SETTINGS.dateFormat;

  const hasPreferencesChanges =
    formTimeZone !== initialTimeZone || formDateFormat !== initialDateFormat;

  const tzHasCurrent = tzOptions.includes(formTimeZone);
  const tzSelectOptions = (
    tzHasCurrent ? tzOptions : [formTimeZone, ...tzOptions]
  ).map((tz) => ({
    value: tz,
    label: tz,
  }));

  const originalFullName = useMemo(
    () => joinDisplayName(initialName.firstName, initialName.lastName),
    [initialName.firstName, initialName.lastName],
  );
  const currentFullName = useMemo(
    () => joinDisplayName(firstName, lastName),
    [firstName, lastName],
  );
  const hasNameChanges = currentFullName !== originalFullName;

  async function onSavePreferences() {
    if (!userId) return;
    try {
      await updateUserSettings({
        uid: userId,
        patch: { timeZone: formTimeZone, dateFormat: formDateFormat },
      }).unwrap();
    } catch {
      // errors shown via settingsErrorMessage
    }
  }

  function onResetPreferences() {
    setFormTimeZone(initialTimeZone);
    setFormDateFormat(initialDateFormat);
  }

  async function onSaveName() {
    setNameError(null);

    if (!isAuthenticated) {
      setNameError("You must be signed in to update your name.");
      return;
    }

    const nextDisplayName = joinDisplayName(firstName, lastName);
    if (!nextDisplayName) {
      setNameError("First name is required.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setNameError("Auth user is not available.");
      return;
    }

    setIsNameSaving(true);
    try {
      await updateProfile(user, { displayName: nextDisplayName });
      await user.reload();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setNameError(`Failed to update display name: ${msg}`);
    } finally {
      setIsNameSaving(false);
    }
  }

  function onResetName() {
    setNameError(null);
    setFirstName(initialName.firstName);
    setLastName(initialName.lastName);
  }

  const canEditName = isAuthReady && isAuthenticated;
  const preferencesDisabled = !isAuthReady || !isAuthenticated || isPageLoading;

  const saveNameDisabled = !canEditName || isNameSaving || !hasNameChanges;
  const resetNameDisabled = !canEditName || isNameSaving || !hasNameChanges;

  return (
    <AccountSettingsLayout
      title="Account settings"
      subtitle="Profile"
      content={
        <ProfilePreferencesCard
          email={email ?? ""}
          firstName={firstName}
          lastName={lastName}
          canEditName={canEditName}
          isNameSaving={isNameSaving}
          nameError={nameError}
          saveNameDisabled={saveNameDisabled}
          resetNameDisabled={resetNameDisabled}
          onFirstNameChange={(v: string) => {
            setNameError(null);
            setFirstName(v);
          }}
          onLastNameChange={(v: string) => {
            setNameError(null);
            setLastName(v);
          }}
          onSaveName={onSaveName}
          onResetName={onResetName}
          timeZone={formTimeZone}
          timeZoneOptions={tzSelectOptions}
          dateFormat={formDateFormat}
          disabledPreferences={preferencesDisabled}
          isSavingPreferences={isSavingSettings}
          hasPreferencesChanges={hasPreferencesChanges}
          preferencesErrorMessage={settingsErrorMessage}
          onTimeZoneChange={setFormTimeZone}
          onDateFormatChange={setFormDateFormat}
          onSavePreferences={onSavePreferences}
          onResetPreferences={onResetPreferences}
        />
      }
    />
  );
}
