export interface CategoryActionState {
  status: "idle" | "error";
  fieldErrors?: { name?: string };
  formError?: string;
  values?: { name?: string };
}

export const initialCategoryActionState: CategoryActionState = {
  status: "idle",
};
