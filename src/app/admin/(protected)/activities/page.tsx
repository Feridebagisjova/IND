import { prisma } from "@/lib/prisma";

export default async function ActivitiesPage() {
  const categories = await prisma.activityCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Werkzaamheden</h2>
        <p className="muted mt-1">Centrale categorieën voor andere werkzaamheden.</p>
      </div>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Categorie</th>
              <th>Vermindert productietijd</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.reducesProductiveTime ? "Ja" : "Nee"}</td>
                <td>{category.active ? "Actief" : "Inactief"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
