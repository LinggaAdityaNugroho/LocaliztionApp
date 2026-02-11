interface Props {
  status: boolean;
}

export function StatusBadge({ status }: Props) {
  return (
    <span className={status ? "text-green-600" : "text-red-600"}>
      {status ? "Online" : "Offline"}
    </span>
  );
}
