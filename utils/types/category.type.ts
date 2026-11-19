export interface CategorySummary {
  id: number;
  name: string;
  transactionCount: number;
}

export interface CategoryActionState {
  status: "idle" | "error";
  fieldErrors?: { name?: string };
  formError?: string;
  values?: { name?: string };
}
