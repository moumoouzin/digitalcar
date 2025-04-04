
import { Database } from "@/integrations/supabase/types";

export type CarAd = Database['public']['Tables']['car_ads']['Row'] & {
  car_images?: Array<{
    image_url: string;
    is_primary: boolean | null;
  }>;
  car_features?: Array<{
    feature_id: string;
  }>;
  images?: string[];
  features?: string[];
};
