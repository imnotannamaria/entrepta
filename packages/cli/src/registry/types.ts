export interface RegistryComponent {
  name: string;
  description: string;
  category: "primitives" | "layout" | "content" | "feedback" | "hooks";
  files: string[];
  deps: string[];
  registryDeps: string[];
}
