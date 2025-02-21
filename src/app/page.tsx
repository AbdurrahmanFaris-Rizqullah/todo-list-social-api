"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Import Swagger UI dynamically to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <header className="bg-white dark:bg-gray-900 shadow p-4">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">API Documentation</h1>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <SwaggerUI url="/swagger.yaml" docExpansion="list" defaultModelsExpandDepth={-1} persistAuthorization={true} supportedSubmitMethods={["get", "post", "put", "delete"]} tryItOutEnabled={true} />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 shadow p-4 mt-8">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">© 2024 Social Media Post Management API. All rights reserved.</p>
      </footer>
    </div>
  );
}
