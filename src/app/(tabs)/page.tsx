import { ProjectDataForm } from "@/components/forms/ProjectDataForm";
import { PolygonDataForm } from "@/components/forms/PolygonDataForm";
import { VertexList } from "@/components/forms/VertexList";

export default function DataEntryPage() {
  return (
    <div className="space-y-4">
      <ProjectDataForm />
      <PolygonDataForm />
      <VertexList />
    </div>
  );
}
