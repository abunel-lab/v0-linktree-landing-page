import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { SiteSettings } from "@/lib/types";

export function useSiteSettings() {
  return useQuery<SiteSettings | null>({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return data as SiteSettings;
    },
    staleTime: 5 * 60 * 1000,
  });
}
