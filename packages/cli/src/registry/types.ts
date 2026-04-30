export interface RegistryComponent {
  name: string;
  description: string;
  category: "primitives" | "layout" | "content" | "feedback";
  files: string[];
  deps: string[];
  registryDeps: string[];
}
