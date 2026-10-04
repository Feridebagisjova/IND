import { getSettings } from "@/lib/admin-data";
import SettingsPage from "./SettingsForm";

export default async function SettingsRoutePage() {
  const settings = await getSettings();
  return <SettingsPage initial={settings} />;
}
