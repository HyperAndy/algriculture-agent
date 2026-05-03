import type { ReactNode } from "react";

export function PanelTitle({ icon, title }: { icon?: ReactNode; title: string }) {
  return (
    <div className="sci-panel-title">
      {icon ? <span>{icon}</span> : null}
      <h2>{title}</h2>
    </div>
  );
}
