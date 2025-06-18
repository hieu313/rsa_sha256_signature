import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function AuthWrapper({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="min-w-[400px] gap-0">
      <CardHeader>
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <CardDescription className="space-y-2 flex flex-col items-center">
          <p>{description}</p>
        </CardDescription>
      </CardHeader>
      {children}
    </Card>
  );
}
