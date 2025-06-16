import { getApiDocs } from "@/lib/swagger";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default async function ApiDocPage() {
  const spec = await getApiDocs();
  return (
    <section className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <SwaggerUI spec={spec} />
    </section>
  );
}
