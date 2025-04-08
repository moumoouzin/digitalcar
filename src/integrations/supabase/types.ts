export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      car_ads: {
        Row: {
          brand: string
          color: string
          contacts: number | null
          created_at: string
          description: string
          id: string
          is_featured: boolean | null
          mileage: string
          model: string
          price: number
          status: string
          title: string
          transmission: string
          updated_at: string
          views: number | null
          whatsapp: string
          year: string
        }
        Insert: {
          brand: string
          color: string
          contacts?: number | null
          created_at?: string
          description: string
          id?: string
          is_featured?: boolean | null
          mileage: string
          model: string
          price: number
          status?: string
          title: string
          transmission: string
          updated_at?: string
          views?: number | null
          whatsapp: string
          year: string
        }
        Update: {
          brand?: string
          color?: string
          contacts?: number | null
          created_at?: string
          description?: string
          id?: string
          is_featured?: boolean | null
          mileage?: string
          model?: string
          price?: number
          status?: string
          title?: string
          transmission?: string
          updated_at?: string
          views?: number | null
          whatsapp?: string
          year?: string
        }
        Relationships: []
      }
      car_features: {
        Row: {
          car_id: string | null
          feature_id: string
          id: string
        }
        Insert: {
          car_id?: string | null
          feature_id: string
          id?: string
        }
        Update: {
          car_id?: string | null
          feature_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_features_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "car_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      car_images: {
        Row: {
          car_id: string
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
        }
        Insert: {
          car_id: string
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
        }
        Update: {
          car_id?: string
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_car_id"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "car_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      financing_requests: {
        Row: {
          account: string
          account_type: string
          additional_info: string | null
          address: string
          address_complement: string | null
          agency: string
          bank: string
          birth_date: string
          city: string
          cnpj: string | null
          company: string
          cpf: string
          created_at: string | null
          down_payment: string | null
          driver_license: boolean | null
          driver_license_url: string | null
          email: string
          father_name: string | null
          gender: string
          id: string
          income: string
          income_proof: boolean | null
          income_proof_url: string | null
          installments: string | null
          marital_status: string
          mother_name: string
          name: string
          nationality: string
          neighborhood: string
          phone: string
          residence_proof: boolean | null
          residence_proof_url: string | null
          residence_type: string
          rg: string
          role: string
          state: string
          status: string | null
          time_at_work: string
          vehicle_brand: string
          vehicle_color: string
          vehicle_model: string
          vehicle_value: string
          vehicle_year: string
          work_address: string
          work_city: string
          work_complement: string | null
          work_neighborhood: string
          work_number: string
          work_phone: string
          work_state: string
          work_zip_code: string
          zip_code: string
        }
        Insert: {
          account: string
          account_type: string
          additional_info?: string | null
          address: string
          address_complement?: string | null
          agency: string
          bank: string
          birth_date: string
          city: string
          cnpj?: string | null
          company: string
          cpf: string
          created_at?: string | null
          down_payment?: string | null
          driver_license?: boolean | null
          driver_license_url?: string | null
          email: string
          father_name?: string | null
          gender: string
          id?: string
          income: string
          income_proof?: boolean | null
          income_proof_url?: string | null
          installments?: string | null
          marital_status: string
          mother_name: string
          name: string
          nationality: string
          neighborhood: string
          phone: string
          residence_proof?: boolean | null
          residence_proof_url?: string | null
          residence_type: string
          rg: string
          role: string
          state: string
          status?: string | null
          time_at_work: string
          vehicle_brand: string
          vehicle_color: string
          vehicle_model: string
          vehicle_value: string
          vehicle_year: string
          work_address: string
          work_city: string
          work_complement?: string | null
          work_neighborhood: string
          work_number: string
          work_phone: string
          work_state: string
          work_zip_code: string
          zip_code: string
        }
        Update: {
          account?: string
          account_type?: string
          additional_info?: string | null
          address?: string
          address_complement?: string | null
          agency?: string
          bank?: string
          birth_date?: string
          city?: string
          cnpj?: string | null
          company?: string
          cpf?: string
          created_at?: string | null
          down_payment?: string | null
          driver_license?: boolean | null
          driver_license_url?: string | null
          email?: string
          father_name?: string | null
          gender?: string
          id?: string
          income?: string
          income_proof?: boolean | null
          income_proof_url?: string | null
          installments?: string | null
          marital_status?: string
          mother_name?: string
          name?: string
          nationality?: string
          neighborhood?: string
          phone?: string
          residence_proof?: boolean | null
          residence_proof_url?: string | null
          residence_type?: string
          rg?: string
          role?: string
          state?: string
          status?: string | null
          time_at_work?: string
          vehicle_brand?: string
          vehicle_color?: string
          vehicle_model?: string
          vehicle_value?: string
          vehicle_year?: string
          work_address?: string
          work_city?: string
          work_complement?: string | null
          work_neighborhood?: string
          work_number?: string
          work_phone?: string
          work_state?: string
          work_zip_code?: string
          zip_code?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_contact_count: {
        Args: { car_id: string }
        Returns: undefined
      }
      increment_view_count: {
        Args: { car_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
