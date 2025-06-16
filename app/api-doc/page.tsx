import { getApiDocs } from "@/lib/swagger";
import SwaggerClient from "./swagger-client";

export default async function ApiDocPage() {
  const spec = await getApiDocs();
  return (
    <section className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <SwaggerClient spec={spec} />
    </section>
  );
}
