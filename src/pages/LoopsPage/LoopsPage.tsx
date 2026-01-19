import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "src/shared/lib";
import { Button } from "src/shared/ui";

import { CardText, Header } from "./components/Header";
import { LoopDetailsView } from "./components/LoopDetailsView";
import { LoopsListView } from "./components/LoopsListView";

export default function LoopsPage() {
  const { user } = useAuth();
  const userId = user?.uid ?? null;

  const navigate = useNavigate();
  const { loopId } = useParams<{ loopId: string }>();

  const isDetails = Boolean(loopId);

  if (!userId) {
    return (
      <div className="space-y-6">
        <Header
          title={isDetails ? "Loop" : "My Loops"}
          subtitle="Sign in to continue."
          right={
            isDetails ? (
              <Button
                variant="outline"
                shape="lg"
                onClick={() => navigate("/dashboard/loops")}
              >
                Back
              </Button>
            ) : null
          }
        />
        <CardText>Please sign in to view your loops.</CardText>
      </div>
    );
  }

  return isDetails ? (
    <LoopDetailsView
      userId={userId}
      loopId={loopId!}
      onBack={() => navigate("/dashboard/loops")}
    />
  ) : (
    <LoopsListView
      userId={userId}
      onOpenLoop={(id) => navigate(`/dashboard/loops/${id}`)}
    />
  );
}
