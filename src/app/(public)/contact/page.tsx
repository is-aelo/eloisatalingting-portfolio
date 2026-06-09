import { createClient } from "@/lib/supabase/server";
import { ContactSection } from "@/components/sections/ContactSection";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: contact } = await supabase
    .from("contact")
    .select("email, linkedin_url")
    .maybeSingle();

  return (
    <ContactSection email={contact?.email ?? null} linkedinUrl={contact?.linkedin_url ?? null} />
  );
}
