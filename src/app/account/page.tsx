import { IndShell } from "@/components/IndShell";
import { EmployeeAccountForm } from "@/components/EmployeeAccountForm";

export default function AccountPage() {
  return (
    <IndShell showAdminLink={false}>
      <section className="ind-content-section">
        <div className="ind-container flex justify-center py-10">
          <div className="ind-content-panel w-full max-w-md">
            <EmployeeAccountForm />
          </div>
        </div>
      </section>
    </IndShell>
  );
}
