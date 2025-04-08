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
          car_id: string | null
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
        }
        Insert: {
          car_id?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
        }
        Update: {
          car_id?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "car_images_car_id_fkey"
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
        Args: {
          car_id: string
        }
        Returns: undefined
      }
      increment_view_count: {
        Args: {
          car_id: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
