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
      air_accounts: {
        Row: {
          account: string
          account_name: string
          created_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          account: string
          account_name: string
          created_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          account?: string
          account_name?: string
          created_at?: string | null
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      air_companies: {
        Row: {
          company_name: string | null
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      air_opening_balances: {
        Row: {
          account: string
          balance: number
          created_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          account: string
          balance: number
          created_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          account?: string
          balance?: number
          created_at?: string | null
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      air_templates: {
        Row: {
          account_number: string
          created_at: string | null
          credit: number
          debit: number
          description: string | null
          id: number
          name: string
          sort_order: number | null
        }
        Insert: {
          account_number: string
          created_at?: string | null
          credit: number
          debit: number
          description?: string | null
          id?: number
          name: string
          sort_order?: number | null
        }
        Update: {
          account_number?: string
          created_at?: string | null
          credit?: number
          debit?: number
          description?: string | null
          id?: number
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      air_transactions: {
        Row: {
          account: string
          created_at: string | null
          credit: number
          date: string | null
          debit: number
          description: string | null
          id: number
          user_id: string
          ver: number | null
        }
        Insert: {
          account: string
          created_at?: string | null
          credit: number
          date?: string | null
          debit: number
          description?: string | null
          id?: number
          user_id: string
          ver?: number | null
        }
        Update: {
          account?: string
          created_at?: string | null
          credit?: number
          date?: string | null
          debit?: number
          description?: string | null
          id?: number
          user_id?: string
          ver?: number | null
        }
        Relationships: []
      }
      anavid_testdata: {
        Row: {
          age: string | null
          gender: string | null
          Id: number
          id_camera: number | null
          id_person: number | null
          leave_date: string | null
          visit_date: string | null
        }
        Insert: {
          age?: string | null
          gender?: string | null
          Id: number
          id_camera?: number | null
          id_person?: number | null
          leave_date?: string | null
          visit_date?: string | null
        }
        Update: {
          age?: string | null
          gender?: string | null
          Id?: number
          id_camera?: number | null
          id_person?: number | null
          leave_date?: string | null
          visit_date?: string | null
        }
        Relationships: []
      }
      image_analyses: {
        Row: {
          analysis: string
          created_at: string | null
          id: string
          image_count: number
          user_id: string
        }
        Insert: {
          analysis: string
          created_at?: string | null
          id?: string
          image_count: number
          user_id: string
        }
        Update: {
          analysis?: string
          created_at?: string | null
          id?: string
          image_count?: number
          user_id?: string
        }
        Relationships: []
      }
      letgo_classifieds: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: number
          image_analysis_result: string | null
          image_description: string | null
          image_url: string | null
          price: number
          seller_id: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: number
          image_analysis_result?: string | null
          image_description?: string | null
          image_url?: string | null
          price: number
          seller_id: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: number
          image_analysis_result?: string | null
          image_description?: string | null
          image_url?: string | null
          price?: number
          seller_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_seller"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "letgo_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      letgo_favourites: {
        Row: {
          classified_id: number
          created_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          classified_id: number
          created_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          classified_id?: number
          created_at?: string | null
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_classified"
            columns: ["classified_id"]
            isOneToOne: false
            referencedRelation: "letgo_classifieds"
            referencedColumns: ["id"]
          },
        ]
      }
      letgo_messages: {
        Row: {
          classified_id: number
          content: string
          created_at: string | null
          id: number
          receiver_id: string
          sender_id: string
        }
        Insert: {
          classified_id: number
          content: string
          created_at?: string | null
          id?: number
          receiver_id: string
          sender_id: string
        }
        Update: {
          classified_id?: number
          content?: string
          created_at?: string | null
          id?: number
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_classified"
            columns: ["classified_id"]
            isOneToOne: false
            referencedRelation: "letgo_classifieds"
            referencedColumns: ["id"]
          },
        ]
      }
      letgo_sellers: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id: string
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migraine_entries: {
        Row: {
          created_at: string | null
          duration_hours: number | null
          id: number
          notes: string | null
          pain_intensity: number
          pain_location: string
          triggers: string[]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_hours?: number | null
          id?: number
          notes?: string | null
          pain_intensity: number
          pain_location: string
          triggers: string[]
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_hours?: number | null
          id?: number
          notes?: string | null
          pain_intensity?: number
          pain_location?: string
          triggers?: string[]
          user_id?: string
        }
        Relationships: []
      }
      presentation_images: {
        Row: {
          created_at: string | null
          id: number
          image_url: string
          sort_order: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url: string
          sort_order: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string
          sort_order?: number
          user_id?: string
        }
        Relationships: []
      }
      quickpitch_call_history: {
        Row: {
          channel_name: string
          created_at: string | null
          end_time: string | null
          id: number
          participant_count: number | null
          start_time: string
          user_id: string
        }
        Insert: {
          channel_name: string
          created_at?: string | null
          end_time?: string | null
          id?: number
          participant_count?: number | null
          start_time: string
          user_id: string
        }
        Update: {
          channel_name?: string
          created_at?: string | null
          end_time?: string | null
          id?: number
          participant_count?: number | null
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
      room_timers: {
        Row: {
          created_at: string | null
          room_id: string
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          room_id: string
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          room_id?: string
          start_time?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_secret: {
        Args: { secret_name: string }
        Returns: Json
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      insert_record: {
        Args: { p_user_id: string; p_record: Json }
        Returns: Json
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
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
