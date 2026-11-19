import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl leading-8 font-bold tracking-[-0.02em] md:text-[30px] md:leading-9">
          Dashboard
        </h1>
        <p className="text-sm leading-5 text-muted-foreground">
          Ringkasan keuangan pribadi Anda.
        </p>
      </header>

      <Card>
        <CardContent>
          <p className="text-sm leading-5 font-medium text-muted-foreground">
            Anda masuk sebagai
          </p>
          <p className="mt-1 text-base leading-6 font-semibold break-all">
            {user.email}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
