export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bill_notifications: {
        Row: {
          bill_id: number
          change_type: string
          created_at: string
          detail: string | null
          id: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          bill_id: number
          change_type: string
          created_at?: string
          detail?: string | null
          id?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          bill_id?: number
          change_type?: string
          created_at?: string
          detail?: string | null
          id?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      bill_watches: {
        Row: {
          bill_id: number
          created_at: string
          id: string
          last_checked_at: string
          snapshot_last_action: string
          snapshot_progress: number
          snapshot_status: string
          snapshot_timeline_count: number
          snapshot_votes_count: number
          user_id: string
        }
        Insert: {
          bill_id: number
          created_at?: string
          id?: string
          last_checked_at?: string
          snapshot_last_action: string
          snapshot_progress: number
          snapshot_status: string
          snapshot_timeline_count?: number
          snapshot_votes_count?: number
          user_id: string
        }
        Update: {
          bill_id?: number
          created_at?: string
          id?: string
          last_checked_at?: string
          snapshot_last_action?: string
          snapshot_progress?: number
          snapshot_status?: string
          snapshot_timeline_count?: number
          snapshot_votes_count?: number
          user_id?: string
        }
        Relationships: []
      }
      bills: {
        Row: {
          code: string
          created_at: string
          id: number
          introduced_date: string
          last_action: string
          progress: number
          sponsors: Json
          status: string
          summary: string
          timeline: Json
          title: string
          topic: string
          updated_at: string
          votes: Json
        }
        Insert: {
          code: string
          created_at?: string
          id: number
          introduced_date: string
          last_action: string
          progress?: number
          sponsors?: Json
          status: string
          summary: string
          timeline?: Json
          title: string
          topic: string
          updated_at?: string
          votes?: Json
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          introduced_date?: string
          last_action?: string
          progress?: number
          sponsors?: Json
          status?: string
          summary?: string
          timeline?: Json
          title?: string
          topic?: string
          updated_at?: string
          votes?: Json
        }
        Relationships: []
      }
      candidate_summaries: {
        Row: {
          created_at: string
          id: string
          name: string
          office: string
          source_url: string | null
          state: string
          summary: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          office?: string
          source_url?: string | null
          state: string
          summary: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          office?: string
          source_url?: string | null
          state?: string
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      house_candidates_cache: {
        Row: {
          candidates: Json
          created_at: string
          expires_at: string
          state: string
          updated_at: string
        }
        Insert: {
          candidates: Json
          created_at?: string
          expires_at?: string
          state: string
          updated_at?: string
        }
        Update: {
          candidates?: Json
          created_at?: string
          expires_at?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      representatives: {
        Row: {
          bio: string
          chamber: string
          committees: Json
          contact: Json
          created_at: string
          district: string | null
          id: string
          issue_scores: Json
          name: string
          party: string
          photo: string | null
          rating: string
          state: string
          term_end: string
          term_start: string
          updated_at: string
          voting_history: Json
        }
        Insert: {
          bio: string
          chamber: string
          committees?: Json
          contact?: Json
          created_at?: string
          district?: string | null
          id: string
          issue_scores?: Json
          name: string
          party: string
          photo?: string | null
          rating: string
          state: string
          term_end: string
          term_start: string
          updated_at?: string
          voting_history?: Json
        }
        Update: {
          bio?: string
          chamber?: string
          committees?: Json
          contact?: Json
          created_at?: string
          district?: string | null
          id?: string
          issue_scores?: Json
          name?: string
          party?: string
          photo?: string | null
          rating?: string
          state?: string
          term_end?: string
          term_start?: string
          updated_at?: string
          voting_history?: Json
        }
        Relationships: []
      }
      sponsored_legislation: {
        Row: {
          bill_code: string
          bill_title: string
          congress_url: string | null
          created_at: string
          id: string
          introduced_date: string | null
          rep_id: string
          status: string | null
          topic: string | null
        }
        Insert: {
          bill_code: string
          bill_title: string
          congress_url?: string | null
          created_at?: string
          id?: string
          introduced_date?: string | null
          rep_id: string
          status?: string | null
          topic?: string | null
        }
        Update: {
          bill_code?: string
          bill_title?: string
          congress_url?: string | null
          created_at?: string
          id?: string
          introduced_date?: string | null
          rep_id?: string
          status?: string | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsored_legislation_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "representatives"
            referencedColumns: ["id"]
          },
        ]
      }
      state_bills: {
        Row: {
          bill_code: string
          created_at: string
          history: Json
          id: number
          introduced_date: string | null
          last_action: string
          last_action_date: string | null
          legiscan_url: string | null
          progress: number
          session_name: string | null
          sponsors: Json
          state: string
          state_url: string | null
          status: string
          subjects: Json
          summary: string
          title: string
          topic: string
          updated_at: string
        }
        Insert: {
          bill_code: string
          created_at?: string
          history?: Json
          id: number
          introduced_date?: string | null
          last_action?: string
          last_action_date?: string | null
          legiscan_url?: string | null
          progress?: number
          session_name?: string | null
          sponsors?: Json
          state: string
          state_url?: string | null
          status?: string
          subjects?: Json
          summary?: string
          title: string
          topic?: string
          updated_at?: string
        }
        Update: {
          bill_code?: string
          created_at?: string
          history?: Json
          id?: number
          introduced_date?: string | null
          last_action?: string
          last_action_date?: string | null
          legiscan_url?: string | null
          progress?: number
          session_name?: string | null
          sponsors?: Json
          state?: string
          state_url?: string | null
          status?: string
          subjects?: Json
          summary?: string
          title?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      state_sync_log: {
        Row: {
          bill_count: number
          created_at: string
          last_error: string | null
          last_synced_at: string
          state: string
          updated_at: string
        }
        Insert: {
          bill_count?: number
          created_at?: string
          last_error?: string | null
          last_synced_at?: string
          state: string
          updated_at?: string
        }
        Update: {
          bill_count?: number
          created_at?: string
          last_error?: string | null
          last_synced_at?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          election_updates_opt_in: boolean
          election_updates_opt_in_at: string | null
          id: string
          selected_county: string | null
          selected_issues: Json
          selected_state: string | null
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          election_updates_opt_in?: boolean
          election_updates_opt_in_at?: string | null
          id?: string
          selected_county?: string | null
          selected_issues?: Json
          selected_state?: string | null
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          election_updates_opt_in?: boolean
          election_updates_opt_in_at?: string | null
          id?: string
          selected_county?: string | null
          selected_issues?: Json
          selected_state?: string | null
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
