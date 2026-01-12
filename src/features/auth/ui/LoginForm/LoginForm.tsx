import React, { useState } from "react";

import { Button, Input } from "src/shared/ui";

import { GoogleSignInButton } from "../GoogleSignInButton/GoogleSignInButton";

export type LoginFormProps = {
  onGoogleSuccess: (from: string) => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onGoogleSuccess }) => {
  const [email, setEmail] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <GoogleSignInButton onSuccess={onGoogleSuccess} onError={setErrorText} />

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-2 text-xs text-muted-foreground">
            или
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email (пока только UI)</label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          autoComplete="email"
        />
        <Button className="w-full" disabled>
          Continue
        </Button>
      </div>

      {errorText && (
        <div className="rounded-md border border-border bg-muted p-3 text-sm">
          <div className="font-medium">Ошибка входа</div>
          <div className="mt-1 text-muted-foreground">{errorText}</div>
        </div>
      )}
    </div>
  );
};
