import React, { useState } from "react";

import { useAuth } from "src/shared/lib";
import { Button } from "src/shared/ui";


export type LogoutButtonProps = {
  className?: string;
};

export const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={onLogout}
      disabled={isLoading}
    >
      {isLoading ? "Выход..." : "Logout"}
    </Button>
  );
};
