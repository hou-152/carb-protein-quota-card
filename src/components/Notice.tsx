interface NoticeProps {
  title: string;
  children: React.ReactNode;
}

export function Notice({ title, children }: NoticeProps) {
  return (
    <section className="notice-card">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}

